var express = require('express');
var router = express.Router();
var Article = require('../models/article')
var Comment = require('../models/comment')
var middleware = require('../modules/middleware')



/* GET home page. */
router.get('/',(req, res, next) =>{
    Article.find({},(err,data)=>{
        if(err) return next(err)
        res.render('articlespage',{ data })
    })
    
})
router.get('/create',(req, res, next)=>{
    res.render('articlePostForm')
})
router.post('/',middleware.isLoggedin,(req, res, next)=>{
    var articleData = req.body
    Article.create(articleData,(err, data)=>{
        if(err) return next(err)
        res.redirect('/articles')
        
    })
})
router.get('/:articleId/view',(req,res, next)=>{
    Article
    .findById(req.params.articleId)
    .populate('comments','content')
    .exec((err,data) =>{
      if(err) return next(err);
      res.render('singleArticle',{data})
      console.log(data)
    })
  })
router.post('/:articleId/view',(req, res, next) =>{
    // req.body.articleId = req.params.articleId; //articleId is the key we are adding .It must match with the name given in schema
    Comment.create(req.body,(err, data) => {
        if(err) return next(err)
        Article.findByIdAndUpdate(req.params.articleId,{$push : {comments : data.id}},(err, article)=>{
            if(err) return next(err)
            res.redirect('/articles/'+req.params.articleId+'/view')
        })
        
    })
})
router.use(middleware.isLoggedin)
router.get('/:id/edit',(req, res, next)=>{
    Article.findById(req.params.id,(err,data) =>{
        if(err) return next(err)
        res.render('articleEditForm',{ data })
    })
})
router.post('/:id/edit',(req, res, next) => {
    Article.findByIdAndUpdate(req.params.id,req.body,(err,data) =>{
        if(err) return next(err);
        res.redirect(`/articles/${req.params.id}/view`)
    })
})

router.get('/:id/delete',(req, res, next) =>{
    Article.findOneAndDelete({_id: req.params.id},(err,data)=>{
        if(err) return next(err)
        res.redirect('/articles')
    })
})
router.get('/:id/likes',(req, res, next)=>{
    Article.findByIdAndUpdate(req.params.id,{$inc: {likes:1}},(err,data)=>{
        if(err) return next(err)
        res.redirect(`/articles/${req.params.id}/view`)
    })
})
// router.get('/:id/likes',(req, res, next)=>{
//     Article.findByIdAndUpdate(req.params.id,{$inc: {likes:1}},(err,data)=>{
//         if(err) return next(err)
//         res.redirect(`/articles/${req.params.id}/view`)
//     })
// })
// router.get('/:id/view/editcomment',(req, res, next)=>{
//     Article
//     .findById(req.params.articleId)
//     .populate('comments','content')
//     .exec((err,data) =>{
//       if(err) return next(err);
//       res.render('singleArticle',{data})
//       console.log(data)
//     })
//   })
// })

router.get('/:articleId/:commentId', async (req, res, next) => {
console.log(req.body,'comment')
console.log(req.params.commentId)
    try{
        const article = await Article.findByIdAndUpdate(req.params.articleId, {$pull:{comments:req.params.commentId}})
        const comment = await Comment.findByIdAndRemove(req.params.commentId)
        res.redirect('/articles/'+req.params.articleId+"/view")

    }catch(e){
        next(err)
    }
    // Article.findByIdAndUpdate(req.params.articleId,(err,article)=>{
    //     Comment.findOneAndDelete(req.params.id,(err, data)=>{
    //         if(err) return next(err)
    //         res.redirect()
    //     })
    // })


  
})
module.exports = router;

var express = require('express');
var express = require('express');
var router = express.Router();
var User = require('../models/User')


/* GET home page. */
router.get('/registration',(req, res)=>{
  res.render('registration')
})

router.post('/registration',(req, res, next)=>{
  User.create(req.body,(err, data)=>{
    if(err) return next(err);
    res.redirect('/users/login')
  })

})

router.get('/login',(req, res)=>{
  res.render('login')
})

router.post('/login',(req, res)=>{
  var {email,password} = req.body;
  User.findOne({email},(err, user)=>{
    console.log(user)
    if(err) return res.redirect('/users/login');
    if(!user) return res.redirect('/users/login')
    console.log(user.verifyPassword(password))
    if(!user.verifyPassword(password)) return res.redirect('/users/login');
    req.session.userId = user.id;
    res.redirect('/');
      
    // }else{
    //   res.send("incorrect password")
    // }
  })
  
})

module.exports = router;

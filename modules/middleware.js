exports.isLoggedin = (req, res, next)=>{
    if(req.session.userId){
        next();
    }else{
        req.flash('error','You need to login first')
        res.redirect('/users/login')
    }

}
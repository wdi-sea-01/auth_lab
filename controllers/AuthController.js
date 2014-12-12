var db = require('../models');
var bcrypt = require('bcrypt');

module.exports = {
    get_login:function(req,res){
       res.render('auth/login');
    },
    post_login:function(req,res){
        //do login here (check password and set session value)
        db.user.find({where:{email:req.body.email}}).then(function(userObj){
            if(userObj){
                bcrypt.compare(req.body.password,userObj.password,function(err,match){
                    if(match){
                        req.session.user={
                            id:userObj.id,
                            email:userObj.email,
                            name:userObj.name
                        }
                        res.redirect('/');
                    }else{
                        res.send('invalid password');
                    }
                });
            }else{
                res.send('Unknown user.');
            }
        });
    },
    get_signup:function(req,res){
       res.render('auth/signup');
    },
    post_signup:function(req,res){
        //do sign up here (add user to database)
        var userData = {
            email:req.body.email,
            password:req.body.password,
            name:req.body.name
        };

        var findUser = {
            email:req.body.email
        };

        db.user.findOrCreate({where:findUser,defaults:userData})
        .spread(function(user,created){
            if(created){
                res.send('created user');
            }else{
                res.send('email already exists');
            }
        })
        .catch(function(error){
            if(error && Array.isArray(error.errors)){
                error.errors.forEach(function(errorItem){
                    req.flash('danger',errorItem.message);
                });
            }else{
                req.flash('danger','unknown error');
            }
            res.redirect('/auth/signup');
        });

        // res.send(req.body);

        //user is signed up forward them to the home page
        //res.redirect('/');
    },
    get_logout:function(req,res){
       delete req.session.user;
        req.flash('info','You have been logged out.');
        res.redirect('/')
    }
}
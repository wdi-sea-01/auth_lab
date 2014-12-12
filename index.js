var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var bcrypt = require('bcrypt');
var flash = require('connect-flash');
var app = express();

var db = require('./models');

app.set('view engine','ejs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(session({
  secret: 'myownsecrectgoeshere',
  resave: false,
  saveUninitialized: true
}));

app.use(flash());

app.use(function(req,res,next){
    req.getUser = function(){
        return req.session.user || false;
    }
    next();
});

app.get('*',function(req,res,next){
    var alerts = req.flash();
    res.locals.alerts = alerts;
    next();
});

app.get('/',function(req,res){
    var user = req.getUser();
    res.render('index',{user:user});
});

app.get('/restricted',function(req,res){
    if(req.getUser()){
        res.render('restricted');
    }else{
        res.send('ACCESS DENIED!!!');
    }
});

//login form
app.get('/auth/login',function(req,res){
    res.render('login');
});

app.post('/auth/login',function(req,res){
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
});

//sign up form
app.get('/auth/signup',function(req,res){
    res.render('signup');
});

app.post('/auth/signup',function(req,res){
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
});

//logout
//sign up form
app.get('/auth/logout',function(req,res){
    delete req.session.user;
    req.flash('info','You have been logged out.');
    res.redirect('/')
});

app.listen(3000);
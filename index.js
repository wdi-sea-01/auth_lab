var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var db = require('./models');

app.set('view engine','ejs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:false}));

app.get('/',function(req,res){
    res.render('index',{user:false});
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
            //check password
            res.send('we will check the password now');
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

    db.user.findOrCreate({where:findUser,defaults:userData}).spread(function(user,created){
        if(created){
            res.send('created user');
        }else{
            res.send('email already exists');
        }
    });

    // res.send(req.body);

    //user is signed up forward them to the home page
    //res.redirect('/');
});

//logout
//sign up form
app.get('/auth/logout',function(req,res){
    delete req.session.user;
    res.redirect('/')
});

app.listen(3000);
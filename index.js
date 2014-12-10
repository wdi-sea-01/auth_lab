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
    res.render('restricted');
});

//login form
app.get('/auth/login',function(req,res){
    res.render('login');
});

app.post('/auth/login',function(req,res){
    //do login here (check password and set session value)

    //user is logged in forward them to the home page
    res.redirect('/');
});

//sign up form
app.get('/auth/signup',function(req,res){
    res.render('signup');
});

app.post('/auth/signup',function(req,res){
    //do sign up here (add user to database)

    //user is signed up forward them to the home page
    res.redirect('/');
});

//logout
//sign up form
app.get('/auth/logout',function(req,res){
    res.send('logged out');
});

app.listen(3000);
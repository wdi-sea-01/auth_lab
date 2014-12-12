var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var expressControllers = require('express-controller');

var app = express();

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

//init express controllers module
expressControllers.setDirectory( __dirname + '/controllers').bind(app);

app.get('*',function(req,res,next){
    var alerts = req.flash();
    res.locals.alerts = alerts;
    next();
});

app.listen(3000);
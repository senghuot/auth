var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.set('view engine', 'jade');
app.locals.pretty = true;

// middleware
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
  res.render('index.jade');
});

app.post('/register', function(req, res) {
  //res.render('register.jade');
  res.json(req.body);
});

app.get('/register', function(req, res) {
  res.render('register.jade');
});

app.get('/login', function(req, res) {
  res.render('login.jade');
});

app.get('/logout', function(req, res) {
  res.redirect('/');
});

app.listen(3000);
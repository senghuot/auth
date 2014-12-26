var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('client-sessions');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// conntect to mongo
mongoose.connect('mongodb://localhost/newauth');

var User = mongoose.model('User', new Schema({
  id: ObjectId,
  fname: String,
  lname: String,
  email: {type: String, unique: true},
  password: String
}));

var app = express();
app.set('view engine', 'jade');
app.locals.pretty = true;

// middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  cookieName: 'session',
  secret: 'adfafafdajsdjpuaekrnzererzer',
  duration: 30 * 60 * 1000,
  activeDuration: 30 * 60 * 1000
}));


app.get('/', function(req, res) {
  res.render('index.jade');
});

app.post('/register', function(req, res) {
  var user = new User({
    fname: req.body.firstname,
    lname: req.body.lastname,
    email: req.body.email,
    password: req.body.password
  });

  user.save(function(err) {
    if (err) {
      var error = 'Something went wrong';
      if (err.code === 11000)
        error = 'Email already exist';

      res.render('register.jade', {error: error});
    } else {
      res.redirect('/dashboard');
    }
  })
});

app.get('/dashboard', function(req, res) {
  if (req.session && req.session.user) {
    User.findOne({ email: req.session.user.email}, function(err, user) {
      if (!user) {
        req.session.reset();
        res.redirect('/login');
      } else {
        res.locals.user = user;
        res.render('dashboard.jade');
      }
    });
  } else {
    res.render('login.jade');
  }
});

app.get('/register', function(req, res) {
  res.render('register.jade');
});

app.get('/logout', function(req, res) {
  req.session.reset();
  res.render('/');
});

app.get('/login', function(req, res) {
  res.render('login.jade');
});

app.post('/login', function(req, res) {
  User.findOne({email:req.body.email}, function(err, user) {
    if (!user) {
      res.render('login.jade', {error: 'Invalid credential.'});
    } else {
      if (req.body.password === user.password) {
        req.session.user = user;
        res.redirect('/dashboard');
      } else {
        res.render('login.jade', {error: 'Invalid email or password'});
      }
    }
  })
});

app.get('/logout', function(req, res) {
  res.redirect('/');
});

app.listen(3000);
var express = require('express');
const passport = require('passport');
var router = express.Router();
var userModel = require('./users')
var localstrategy = require('passport-local');
passport.use(new localstrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/register', function(req, res){
  let userdata = new userModel({
    username: req.body.username,
    email: req.body.email
  })

  userModel.register(userdata, req.body.password)
  .then(function(registereduser){
    passport.authenticate('local')(req, res, function(){
      res.redirect('/profile')
    })
  })
})


function isLoggedIn(req, res, next){
  if(req.isAuthenticated()) {
    return next()
  }
  res.redirect('/');
}

router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/'
}))

router.get('/profile', isLoggedIn,function(req, res) {
  res.render('profile')
})

router.get('/register', function(req, res) {
  res.render('register')
});

router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/register');
  });
});


module.exports = router;

var express = require('express');
const passport = require('passport');
var router = express.Router();
var userModel = require('./users');
const postModel = require('./post');
var localstrategy = require('passport-local');
passport.use(new localstrategy(userModel.authenticate()));
const upload = require('./multer');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {error: req.flash('error'), nav: false});
});


// show image route
router.get('/show/:id', async (req, res) => {
  const post = await postModel.findById(req.params.id);
  if (!post) return res.status(404).send('Not found');
  res.render('show', { post, nav: false });
});


// DELETE route for posts
router.get('/delete/:id', isLoggedIn, async function (req, res) {
  try {
    await postModel.findByIdAndDelete(req.params.id);
    res.redirect('/profile');
  } catch (err) {
    res.send("Something went wrong while deleting the post.");
  }
});



// feed rout
router.get('/feed',isLoggedIn,async function(req, res) {
let user = await userModel.findOne({username: req.session.passport.user});
let posts = await postModel.find().populate('user');
res.render('feed', {user, posts, nav: true});
})

//post add rout 
router.get('/add', isLoggedIn, async function(req, res){
  let user = await userModel.findOne({username: req.session.passport.user})
  res.render('add', {user, nav: true});
})

// post creation route
router.post('/createpost', isLoggedIn, upload.single('postImage'),async function(req, res) {
  let user = await userModel.findOne({username: req.session.passport.user});

  let post = await postModel.create({
       user: user._id,
       title: req.body.title,
       description: req.body.description,
       image: req.file.filename
  });

  user.posts.push(post._id);
  await user.save();
res.redirect('/profile');
})

router.post('/register', function(req, res){
  let userdata = new userModel({
    username: req.body.username,
    email: req.body.email
  })

  userModel.register(userdata, req.body.password)
  .then(function(registereduser){
    passport.authenticate('local')(req, res, function(){
      res.redirect('/profile');
    })
  })
    .catch(function(err){
      req.flash('error', err.message); // manually set flash message
      res.redirect('/register');
    });
})


function isLoggedIn(req, res, next){
  if(req.isAuthenticated()) {
    return next()
  }
  res.redirect('/');
}

router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/',
  failureFlash: true
}))

// profile raoute
router.get('/profile', isLoggedIn, async function(req, res) {
let user = await userModel.findOne({username: req.session.passport.user})
.populate('posts');
  res.render('profile', {user, nav: true});
})

// file upload route
router.post('/fileupload', isLoggedIn, upload.single('avatar'), async function(req, res){
let user = await userModel.findOne({username: req.session.passport.user});
user.profileImage = req.file.filename;
await user.save();
res.redirect('/profile');
})

router.get('/register', function(req, res) {
  res.render('register', {nav: false, error: req.flash('error')})
});

router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/register');
  });
});


module.exports = router;

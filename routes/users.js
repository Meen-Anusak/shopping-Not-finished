var express = require('express');
var router = express.Router();
var User = require('../model/Model_users');
const { check, validationResult } = require('express-validator');
var passport = require('passport');
var LocalStrategy = require('passport-local');


var substring = function(text,length){
  return text.substring(0,length);
}
/* GET users listing. */
router.get('/register', function (req, res, next) {
  res.render('users/signup');
});
router.post('/register',[
  check('username','กรุณาป้อนชื่อ').not().isEmpty(),
  check('password','กรุณาป้อนพาสเวิด 8 ถึง 20 ตัวอักษร').isLength({min:8,max:20}),
  check('email','กรุณาป้อนอีเมล').isEmail(),
  check('birthday','กรุณาป้อนวันเกิด').not().isEmpty(),
  check('gender','กรุณาป้อนเพศ').not().isEmpty()
],(req, res, next) => {
  var result = validationResult(req);
  var errors = result.errors;
  if(!result.isEmpty()){
    res.render('users/signup',{
      errors:errors
    })
  }else{
    var newUser = new User({
      username:req.body.username,
      password:req.body.password,
      email:req.body.email,
      birthday:req.body.birthday,
      gender:req.body.gender,
      type:req.body.type
    })
    User.addUsers(newUser,function(err,user){
      if(err) throw err;
    })
    res.location('/users/login');
    res.redirect('/users/login');
  }

});
router.get('/login',(req,res,next)=>{
  res.render('users/login')
})
router.post('/login',passport.authenticate('local',{
  failureRedirect:'/users/login'
}),(req,res,next)=>{
  var type = req.user.type;
  if(type == 'admin'){
    res.redirect('/admin')
  }else{
    res.redirect('/')
  }
})
router.get('/logout',(req,res)=>{
  req.logout();
  res.redirect('/')
})

passport.serializeUser(function(user, done) {
  done(null, user.id);
});
 
passport.deserializeUser(function(id, done) {
  User.UserfindById(id, function (err, user) {
    done(err, user);
  });
});
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findUsername(username,function(err,user){
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      User.comparepassword(password,user.password,function(err,isMatch){
        if (err) { return done(err); }
        if(isMatch){
          return done(null,user);
        }else{
          return done(null,false);
        }
      })
    })
  }
));





module.exports = router;

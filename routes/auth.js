var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var middleware = require('../middleware');

// router.use(passport.initialize());



router.get("/", function(req, res){
    res.render("landing");
});

// show register form

router.get('/register', function(req, res){
    res.render('register');
});

//handle signup logic

router.post('/register', function(req, res){
    var newUser = new User({username: req.body.username, firstName: req.body.firstName, lastName: req.body.lastName});
    console.log(newUser);
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash('error', err.message);
            res.redirect('back');
        } else {
            passport.authenticate('local')(req, res, function(){
                req.flash('success', "Welcome to the Student Gallery, " + user.firstName + "!");
                res.redirect('/artpieces');
            });
        }
    });
});


//show login form

router.get('/login', function(req, res){
    res.render('login');
});


//handle login logic


router.post('/login', passport.authenticate('local',
    {
        successRedirect: '/artpieces',
        failureRedirect: '/login',
        failureFlash: true
            // message: 'Password or username are incorrect.'
    }), function(req, res){
});


// logout route

router.get('/logout', function(req, res){
    req.logout(); // from passport, destroys session data
    req.flash('success', 'You are logged out.');
    res.redirect('/artpieces');
});


module.exports = router;

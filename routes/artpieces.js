var express     = require("express");
var router      = express.Router({mergeParams: true});
var Artpiece    = require('../models/artpiece');
var User        = require('../models/user');
var middleware = require('../middleware');

//INDEX route

router.get('/', function(req, res){
    Artpiece.find({}, function(err, allArtpieces){
        if(err){
            console.log(err);
        } else {
            res.render('artpieces/index', {artpieces: allArtpieces});
        }
    });
});


//NEW route

router.get('/new', middleware.isLoggedIn, function(req, res){
    res.render('artpieces/new');
});


//CREATE route

router.post('/', middleware.isLoggedIn, function(req, res){
    console.log(req.body);
    var name = req.body.artpiece.name;
    var url = req.body.artpiece.url;
    var desc = req.body.artpiece.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newArtpiece = {name: name, url: url, description: desc, author: author};
    Artpiece.create(newArtpiece, function(err, artpiece){
        if(err){
            console.log(err);
        } else {
            artpiece.author.id = req.user._id;
            artpiece.author.username = req.user.username;
            artpiece.save();
            var message = "'" + artpiece.name + "'" + " has been added to the database.";
            req.flash('success', message);
            res.redirect('/artpieces/' + artpiece.id);
        }
    });    
});


//SHOW route

router.get("/:id", function(req, res){
    Artpiece.findById(req.params.id)
            .populate('comments')
            .exec(function(err, foundArtpiece){
        if(err){
            console.log(err);
            req.flash('error', "Artpiece does not exist.");
            res.redirect('/artpieces');
        } else {
            res.render("artpieces/show", {artpiece: foundArtpiece});
        }
    });
});


//EDIT route

router.get('/:id/edit', middleware.checkArtpieceOwnership, function(req, res){
    Artpiece.findById(req.params.id, function(err, artpiece){
        res.render('artpieces/edit', {artpiece: artpiece});
    });
});


//UPDATE route

router.put('/:id', middleware.checkArtpieceOwnership, function(req, res){
    // req.body.artpiece.body = req.sanitize(req.body.artpiece.body);
    Artpiece.findByIdAndUpdate(req.params.id, req.body.artpiece, function(err, updatedArtpiece){
        res.redirect('/artpieces/' + req.params.id);
    });
});


//DESTROY

router.delete('/:id', middleware.checkArtpieceOwnership, function(req, res){
    Artpiece.findByIdAndRemove(req.params.id, function(err, deletedArtpiece){
        if(err){
            console.log(err);
            req.flash('error', "Something went wrong!");
        } else {
            console.log(deletedArtpiece);
            var message = "'" + deletedArtpiece.name + "'" + " has been removed from the databse.";
            req.flash('success', message);
            res.redirect('/artpieces');
        }
    });
});




module.exports = router;
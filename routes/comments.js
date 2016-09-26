var express = require('express');
var router = express.Router({mergeParams: true});
var Artpiece = require('../models/artpiece.js');
var Comment = require('../models/comment.js');
const util = require('util');
var middleware = require('../middleware');


// NEW route

router.get('/new', middleware.isLoggedIn, function(req, res){
    Artpiece.findById(req.params.id, function(err, foundArtpiece){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {artpiece: foundArtpiece});
        }
    });
});


//CREATE route

router.post('/', middleware.isLoggedIn, function(req, res){
    Artpiece.findById(req.params.id, function(err, artpiece){
        if(err){
            console.log("Can't find Campiste ID");
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                    req.flash('error', 'Something went wrong!');
                    res.redirect('/artpieces');
                } else {
                    comment.author.username = req.user.username;
                    comment.author.id = req.user._id;
                    comment.artpiece.id = req.params.id;
                    comment.save();
                    artpiece.comments.push(comment);
                    artpiece.save();
                    req.flash('success', "Your comment has been added.");
                    res.redirect("/artpieces/" + artpiece._id);
                }
            });
        }
    });
});


// EDIT route

router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            console.log("Comment not found");
            res.redirect('back');
        } else {
            res.render('comments/edit', {artpiece_id: req.params.id, comment: foundComment});
        }
    });
});


// UPDATE route

router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, foundComment){
        if(err){
            console.log(err);
        } else {
            console.log(foundComment);
            res.redirect("/artpieces/" + req.params.id);
        }
    });
});

//DESTROY route

router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, deletedComment){
        if(err){
            console.log(err);
        } else {
            req.flash('success', "Your comment has been removed!")
            res.redirect('/artpieces/' + req.params.id);
        }
    });
});



module.exports = router;
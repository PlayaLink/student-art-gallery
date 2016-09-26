var Artpiece = require('../models/artpiece');
var Comment = require('../models/comment');
const util = require('util');

var middlewareObj = {};

middlewareObj.checkArtpieceOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Artpiece.findById(req.params.id, function(err, foundArtpiece){
            if(err){
                req.flash('error', "You can't edit posts that don't exist!");
                res.redirect('back');
            } else {
                if(foundArtpiece.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash('error', 'Sorry, you can only edit posts that you have created.');
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash('error', 'Sorry, you need to be logged in to do that.')
        res.redirect('back');
    }
}

middlewareObj.checkCommentOwnership = function (req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                console.log(err);
            } else {
                console.log(foundComment);
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }
            }
        });
    } else {
        res.redirect('/login');
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    req.flash('error', 'You need to log in to do that.');
    res.redirect('/login');
}

module.exports = middlewareObj;
const Campground = require("../models/campground");
const Comment = require("../models/comment");

const middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    // is user logged in
    if (req.isAuthenticated()) {
        Campground.findOne({ _id: req.params.id }, function (err, foundCampground) {
            if (err) {
                res.redirect("back");
                // does user own the campground
            } else if (foundCampground.author.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect("back");
            }
        });
    } else {
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
    // is user logged in
    if (req.isAuthenticated()) {
        Comment.findOne({ _id: req.params.comment_id }, function (err, foundComment) {
            if (err) {
                res.redirect("back");
                // does user own the comment
            } else if (foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect("back");
            }
        });
    } else {
        res.redirect("back");
    }
};


middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

module.exports = middlewareObj;

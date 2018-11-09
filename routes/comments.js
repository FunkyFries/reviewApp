const express = require("express");
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

const router = express.Router({ mergeParams: true });

// Comments New
router.get("/new", middleware.isLoggedIn, middleware.csrf, function (req, res) {
    // find campground by id
    Campground.findOne({ _id: req.params.id }, function (err, campground) {
        if (err || !campground) {
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            res.render("comments/new", { campground, csrfToken: req.csrfToken() });
        }
    });
});

// Comments Create
router.post("/", middleware.isLoggedIn, middleware.csrf, function (req, res) {
    // lookup campground using ID
    Campground.findOne({ _id: req.params.id }, function (err, campground) {
        if (err || !campground) {
            req.flash("error", "Campground not found");
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function (error, comment) {
                if (error) {
                    req.flash("error", "Something went wrong");
                    res.redirect("back");
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect(`/campgrounds/${campground._id}`);
                }
            });
        }
    });
});

// Edit Comment Route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, middleware.csrf, function (req, res) {
    Campground.findOne({ _id: req.params.id }, function (err, foundCampground) {
        if (err || !foundCampground) {
            req.flash("error", "Campground not found");
            res.redirect("back");
        }
        Comment.findOne({ _id: req.params.comment_id }, function (error, foundComment) {
            if (error || !foundComment) {
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                res.render("comments/edit", { campground_id: req.params.id, comment: foundComment, csrfToken: req.csrfToken() });
            }
        });
    });
});

// Update Comment Route
router.put("/:comment_id", middleware.checkCommentOwnership, middleware.csrf, function (req, res) {
    Comment.findOneAndUpdate({ _id: req.params.comment_id }, req.body.comment,
        function (err, updatedComment) {
            if (err || !updatedComment) {
                res.redirect("back");
            } else {
                res.redirect(`/campgrounds/${req.params.id}`);
            }
        });
});

// Delete Comment Route
router.delete("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    Comment.findOneAndRemove({ _id: req.params.comment_id }, function (err) {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

module.exports = router;

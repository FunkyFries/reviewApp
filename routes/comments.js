const express = require("express");
const Campground = require("../models/campground");
const Comment = require("../models/comment");

const router = express.Router({ mergeParams: true });

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

// Comments New
router.get("/new", isLoggedIn, function (req, res) {
    // find campground by id
    Campground.findOne({ _id: req.params.id }, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground });
        }
    });
});

// Comments Create
router.post("/", isLoggedIn, function (req, res) {
    // lookup campground using ID
    Campground.findOne({ _id: req.params.id }, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

module.exports = router;

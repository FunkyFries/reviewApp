const express = require("express");
const Campground = require("../models/campground");

const router = express.Router();

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

// Index campground route
router.get("/", function (req, res) {
    // Get all campgrounds from DB
    Campground.find({}, function (err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds });
        }
    });
});

// Create campground route
router.post("/", isLoggedIn, function (req, res) {
    const { name, image, description } = req.body;
    const author = {
        id: req.user._id,
        username: req.user.username,
    };
    const newCampground = {
        name, image, description, author,
    };
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// New campground route
router.get("/new", isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});

// Show campground route
router.get("/:id", function (req, res) {
    Campground.findOne({ _id: req.params.id }).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});

module.exports = router;

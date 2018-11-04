const express = require("express");
const Campground = require("../models/campground");
const middleware = require("../middleware");

const router = express.Router();

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
router.post("/", middleware.isLoggedIn, function (req, res) {
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
router.get("/new", middleware.isLoggedIn, function (req, res) {
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

// Edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findOne({ _id: req.params.id }, function (err, foundCampground) {
        res.render("campgrounds/edit", { campground: foundCampground });
    });
});

// Update campground route
router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    // find and update the correct campground
    Campground.findOneAndUpdate(req.params.id, req.body.campground,
        function (err, updatedCampground) {
            if (err) {
                res.redirect("/campgrounds");
            } else {
                // redirect to show page
                res.redirect(`/campgrounds/${req.params.id}`);
            }
        });
});

// Destroy campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findOneAndRemove({ _id: req.params.id }, function (err) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;

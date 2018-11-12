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

// New campground route
router.get("/new", middleware.isLoggedIn, middleware.csrf, function (req, res) {
    res.render("campgrounds/new", { csrfToken: req.csrfToken() });
});

// Create campground route
router.post("/", middleware.isLoggedIn, middleware.csrf, function (req, res) {
    const {
        name, image, description, price,
    } = req.body;
    const author = {
        id: req.user._id,
        username: req.user.username,
    };
    const newCampground = {
        name, image, description, price, author,
    };
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// Show campground route
router.get("/:id", function (req, res) {
    Campground.findOne({ _id: req.params.id }).populate("comments").exec(function (err, foundCampground) {
        if (err || !foundCampground) {
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});

// Edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, middleware.csrf, function (req, res) {
    Campground.findOne({ _id: req.params.id }, function (err, foundCampground) {
        res.render("campgrounds/edit", { campground: foundCampground, csrfToken: req.csrfToken() });
    });
});

// Update campground route
router.put("/:id", middleware.checkCampgroundOwnership, middleware.csrf, function (req, res) {
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
            req.flash("success", "Campground deleted");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;

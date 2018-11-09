const express = require("express");
const passport = require("passport");
const User = require("../models/user");

const router = express.Router();

// Root route
router.get("/", function (req, res) {
    res.render("landing");
});

// AUTH ROUTES
router.get("/register", function (req, res) {
    res.render("register");
});

// Signup logic route
router.post("/register", function (req, res) {
    const newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            return res.render("register", { error: err.message });
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", `Welcome to YelpCamp ${user.username}`);
            res.redirect("/campgrounds");
        });
    });
});

// LOGIN ROUTES
router.get("/login", function (req, res) {
    res.render("login");
});

// Login form logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
    }), function (req, res) {
});

// LOGOUT ROUTES
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "You are now logged out.");
    res.redirect("/campgrounds");
});

module.exports = router;

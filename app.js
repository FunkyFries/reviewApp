const express                 = require("express");
const helmet                  = require("helmet");
const dotenv                  = require("dotenv");
const path                    = require("path");
const sessions                = require("client-sessions");
const passport                = require("passport");
const LocalStrategy           = require("passport-local");
const bodyParser              = require("body-parser");
const mongoose                = require("mongoose");
const methodOverride          = require("method-override");
const User                    = require("./models/user");
// const seedDB                  = require("./seeds");

const commentRoutes       = require("./routes/comments");
const campgroundRoutes    = require("./routes/campgrounds");
const indexRoutes         = require("./routes/index");

const app = express();

app.use(helmet());
dotenv.load();
dotenv.config({ encoding: "base64" });
mongoose.connect("mongodb://localhost/YelpCamp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
mongoose.set("useFindAndModify", false);
// seedDB(); //seed the database

app.use(sessions({
    cookieName: "session",
    secret: process.env.secret,
    duration: 30 * 60 * 1000,
    cookie: {
        ephemeral: true,
        httpOnly: true,
        secure: false,
    },
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.get("*", function (req, res) {
    res.send("Sorry, page not found...What are you doing with your life?");
});

// Tell Express to listen for requests (start server)
app.listen(3000, function () {
    console.log("Server started");
});

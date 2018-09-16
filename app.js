const express   = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");

mongoose.connect("mongodb://localhost/YelpCamp");

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

Campground.create({ name: "Salmon Creek", image: "https://cdn.pixabay.com/photo/2017/09/26/13/50/rv-2788677__340.jpg" }, function(err, campground){
    if(err){
        console.log(err);
    } else {
        console.log("Newly created campground");
        console.log(campground);
    }
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

var campgrounds = [
    { name: "Salmon Creek", image: "https://cdn.pixabay.com/photo/2017/09/26/13/50/rv-2788677__340.jpg" },
    { name: "Granite Hill", image: "https://cdn.pixabay.com/photo/2016/12/08/17/45/lake-sara-1892494__340.jpg" },
    { name: "Mountain Goat's Rest", image: "https://cdn.pixabay.com/photo/2018/05/16/15/49/camper-3406137__340.jpg" }
]

app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    campgrounds.push(newCampground);
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res){
    res.render("new");
});

app.get("*", function(req, res){
    res.send("Sorry, page not found...What are you doing with your life?");
});

//Tell Express to listen for requests (start server)
app.listen(3000, function () {
    console.log("Server started");
});
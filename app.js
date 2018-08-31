const express = require("express");
const app = express();

// "/" => "Hi there!"
app.get("/", function (req, res) {
    res.send("Hi there!");
});

// "/bye" => "Goodbye!"
app.get("/bye", function (req, res) {
    res.send("Goodbye!");
});

// "/dog" => "MEOW!"
app.get("/dog", function (req, res) {
    res.send("MEOW!");
});

//Tell Express to listen for requests (start server)
app.listen(3000, function () {
    console.log("Server has started!!!");
});
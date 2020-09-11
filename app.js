const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = { 
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

app.listen(3000, function() {
    console.log("Server is running on port 3000.");
});

app.get("/articles", function(req, res) {
    Article.find(function(err, foundArticles){
        if (err) {
            res.send(err);
        } else {
            res.send(foundArticles);
        }
    });
});

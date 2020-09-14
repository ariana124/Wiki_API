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

/************ Requests targeting all articles *************/

app.route("/articles")
    .get(function(req, res) {
        Article.find(function(err, foundArticles){
            if (err) {
                res.send(err);
            } else {
                res.send(foundArticles);
            }
        });
    })
    .post(function(req, res) {

        const title = req.body.title;
        const content = req.body.content;
    
        const newArticle = new Article ({
            title: title,
            content: content
        });
    
        newArticle.save(function(err){
            if (err) {
                console.log(err);
            } else {
                res.send("Successfully added a new article.");
            }
        });
    })
    .delete(function(req, res) {
        Article.deleteMany(function(err){
            if (err) {
                res.send(err);
            } else {
                res.send("Successfully deleted all articles.");
            }
        });
    });

/************* Requests targeting specific articles *************/

app.route("/articles/:articleTitle")
    .get(function(req, res) {
        const articleTitle = req.params.articleTitle;

        Article.findOne({title: articleTitle}, function(err, foundArticle){
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No articles matching the title were found.");
            }
        })
    })
    .put(function(req, res) {
        const articleTitle = req.params.articleTitle;
        const title = req.body.title;
        const content = req.body.content;

        Article.update(
            {title: articleTitle},
            {title: title, content: content},
            {overwrite: true},
            function(err){
                if (err) {
                    res.send(err);
                } else {
                    res.send("Successfully updated article.");
                }
        })
    })
    .patch(function(req, res) {
        const articleTitle = req.params.articleTitle;
        
        Article.update(
            {title: articleTitle},
            {$set: req.body},
            function (err){
                if (err) {
                    res.send(err);
                } else {
                    res.send("Successfully updated article.");
                }
            }
        )
    })

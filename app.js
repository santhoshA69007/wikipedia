const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');

require("dotenv").config();

const app = express();
app.use(express.static("public"));
app.use(express.json()); // Middleware to parse JSON bodies
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); 

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/wikiDB");

// Define article schema and model
const articleSchema = mongoose.Schema({
    title: String,
    content: String
});
const Article = mongoose.model("Article", articleSchema);

// GET route to retrieve all articles
app.route("/articles")
.get(async function(req, res) {
    try {
        const articles = await Article.find();
        res.send(articles);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving articles");
    }
})
.post(async function(req, res) {
    console.log(req.body.title,req.body.content)
    const title=req.body.title;
    const content=req.body.content;
    const new_article=new Article({
        title: title,
        content: content,
    })
    new_article.save();
    res.send("successfully created a article da!")
    console.log(new_article)
})
.delete(async function(req, res) {
    const db_res= await Article.deleteMany();
    console.log(db_res);
    res.send("successfully deleted");
});
///////////////////////END///////////////////////////////////////


/////////////////////GETTING A SPECIFIC ARTICLE //////////////////////
app.route("/articles/:route_param")
.get(async function(req, res) {
    const route_param = req.params.route_param;
    console.log("coming from paramater url: "+route_param);
    const db_res= await Article.findOne({title:route_param});
   
   
    res.send(db_res);
    // res.send("successfully found");
})
.put(async function(req, res) {
    const route_param = req.params.route_param;
    console.log(req.body);
    const db_res= await Article.updateOne({title:route_param}, {title:req.body.title,content:req.body.content});
    console.log(db_res);
    res.send("successfully updated!");
})
.patch(async function(req, res) {
    console.log(req.body);
    const route_param = req.params.route_param;
    const db_res =await Article.updateOne({title:route_param},{$set:req.body});
    res.send("successfully updated! using patch");
    console.log(db_res);
});


// Start the server
app.listen(3000, function() {
    console.log("Server is running on port 3000");
});

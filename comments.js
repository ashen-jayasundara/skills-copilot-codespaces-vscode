// Create web server

// Import modules
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
const mongoose = require("mongoose");
const port = 3000;

// Connect to database
mongoose.connect("mongodb://localhost:27017/comments", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create schema
const commentSchema = new mongoose.Schema({
  name: String,
  comment: String,
});

// Create model
const Comment = mongoose.model("Comment", commentSchema);

// Set up body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// Set up static files
app.use(express.static(path.join(__dirname, "public")));

// Set up view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Create routes
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/comments", (req, res) => {
  // Get all comments from database
  Comment.find({}, (err, comments) => {
    if (err) {
      console.log(err);
    } else {
      res.render("comments", { comments: comments });
    }
  });
});

app.post("/comments", (req, res) => {
  // Create new comment
  const newComment = new Comment({
    name: req.body.name,
    comment: req.body.comment,
  });
  // Save comment to database
  newComment.save((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/comments");
    }
  });
});

// Set up server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

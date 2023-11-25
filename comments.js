// Create web server application
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Comment = require('./models/comment');
var Post = require('./models/post');
var cors = require('cors');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/comments', { useNewUrlParser: true });

// Configure body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure CORS
app.use(cors());

// Set port
var port = process.env.PORT || 8080;

// Create router
var router = express.Router();

// Middleware for all requests
router.use(function (req, res, next) {
    console.log('Request received');
    next();
});

// Set route for home page
router.get('/', function (req, res) {
    res.json({ message: 'Welcome to our API' });
});

// Set route for comments
router.route('/comments')
    // Create a comment
    .post(function (req, res) {
        var comment = new Comment();
        comment.author = req.body.author;
        comment.text = req.body.text;
        comment.post = req.body.post;

        comment.save(function (err) {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Comment created' });
        });
    })
    // Get all comments
    .get(function (req, res) {
        Comment.find(function (err, comments) {
            if (err) {
                res.send(err);
            }
            res.json(comments);
        });
    });

// Set route for a specific comment
router.route('/comments/:comment_id')
    // Get a comment
    .get(function (req, res) {
        Comment.findById(req.params.comment_id, function (err, comment) {
            if (err) {
                res.send(err);
            }
            res.json(comment);
        });
    })
    // Update a comment
    .put(function (req, res) {
        Comment.findById(req.params.comment_id, function (err, comment) {
            if (err) {
                res.send(err);
            }
            comment.author = req.body.author;
            comment.text = req.body.text;
            comment.post = req.body.post;

            comment.save(function (err) {
                if (err) {
                    res.send(err);
                }
                res.json({ message: 'Comment updated' });
            });
        });
    })
    // Delete a comment
    .delete(function (req, res) {
        Comment.remove({ _id: req.params.comment_id }, function (err, comment) {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Comment deleted' });
        });
    })
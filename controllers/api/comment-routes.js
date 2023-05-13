// handle routes related to comments. import necessary models
const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// retrieve all comments from the db. if error occurs return 500 error message
router.get('/', (req, res) => {
    Comment.findAll()
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// create a new comment. if error occurs during process return 400 error
router.post('/', withAuth, (req, res) => {
    if(req.session) {
        Comment.create({
            comment_text: req.body.comment_text,
            post_id: req.body.post_id,
            user_id: req.session.user_id
        })
        .then(dbCommentData => res.json(dbCommentData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    }
});
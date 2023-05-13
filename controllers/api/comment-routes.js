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
// set up the router for handling various routes. import necessary models and authentication middleware for handling
const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

// retrieve all the post created by the currently authenticated user and the associated user information and comments. order by creation date
router.get('/', withAuth, (req, res) => {
    Post.findAll({
        where: {
            user_id: req.session.user_id
        },
        attributes: ['id', 'title', 'post_text', 'created_at'],
        order: [['created_at', 'DESC']],
        include: [
            {
                model: User,
                attributes: ['Username']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            }
        ]
    })

    // handle the response after retreiving the user posts. 
    .then(dbPostData => {
        const posts = dbPostData.map(post => post.get({ plain: true }));
        res.render('dashboard', {posts, loggedIn: true });
    })

    // if error occurs during retrieval or rendering, log the error and send 500 error
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});
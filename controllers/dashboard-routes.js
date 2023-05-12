// set up the router for handling various routes. import necessary models and authentication middleware for handling
const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');
const { post } = require('./home-routes');

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

// handler retrieves a specific post and the associated user info and comments from the db based on provided post id. 
router.get('/edit/:id', withAuth, (req, res) => {
    Post.findOne({
      where: {
        id: req.params.id
      },
      attributes: ['id', 'title', 'post_text', 'created_at'],
      include: [
        {
          model: User,
          attributes: ['username']
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
    // handle the response after retrieving post from db. if no post is found return 404 error response. If found render the 'edit-post' template. 
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        //serialize the data
        const post = dbPostData.get({ plain: true });
        // pass to the template
        res.render('edit-post', {
          post,
          loggedIn: req.session.loggedIn
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });
  
  // render the 'new-post' template to create a new post
  router.get('/new', (req, res) => {
    res.render('new-post');
  });
  
  
  module.exports = router;
// require the express package
const router = require('express').Router();
// require the sequelize connection from the connection.js file
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

// GET route for the root URL path
router.get('/', (req, res) => {
  Post.findAll({
    attributes: [
      'id',
      'title',
      "post_text",
      'created_at'      
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbPostData => {
      const posts = dbPostData.map(post => post.get({ plain: true }));
      // pass a single post object into the homepage template
      res.render('homepage', { 
        posts,
        loggedIn: req.session.loggedIn 
      });
    })
    // if error occurs the the post.findAll query, catch error and display 500 response
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});
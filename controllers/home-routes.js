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

// route handler checks if the user is already logged in, and either redirects to the root path and if not logged in renders the 'login' template
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('login');
});

// route retrieves a specific post and the associated comments along with user information from db based on the provided id
router.get('/post/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'title',
      'post_text',
      'created_at'
    ],
    include: [
      {
        model: Comment,
        attributes: [
          'id',
          'comment_text',
          'post_id',
          'user_id',
          'created_at' 
        ],
        include : {
          model: User,
          attributes: ['Username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  })

  // handle the response after retrieving a post from db. if post is not found send a 404 error. if post is found render the 'single-post' template with the data
  .then(dbPostData => {
    if (!dbPostData) {
      res.status(404).json({message: 'No post found with this id'});
      return;
    }
    const post = dbPostData.get({ plain: true });

    res.render('single-post', {
      post,
      loggedIn: req.session.loggedIn
    });
  })

  // any errors that occure during the retrieval of post or template render. log the error to the console and send 500 error response.
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

module.exports = router;
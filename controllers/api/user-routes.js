// set the router for handling routes and imports necessary models and authentication middleware for route handling
const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// retrieve user data from db, except password, and send response. If error occurrs log the error and send 500 response
router.get('/', (req, res) => {
    User.findAll({
      attributes: { exclude: ['password'] }
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
  });

  // include the pulled users associated posts and comments in the retreival process
  router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'post_text', 'created_at']
            },
            {
                model: Comment, 
                attributes: ['id', 'title', 'post_text', 'created_at']
            },
        ]
    })

    // if no user is found with the provided ID send 404 error response. if error occurs during process log and return 500 error
    .then(dbUserData => {
        if(!dbUserData) {
            res.status(404).json({ message: 'No User found with this id' });
            return;
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
  });

// take provided data and create a new user in the db. save the new user session and set variables. send created user data as JSON response. if error occurs return 500 error
  router.post('/', (req, res) => {
    User.create({
      username: req.body.username,
      password: req.body.password
    })
    .then(dbUserData => {
      req.session.save(() => {
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;
  
        res.json(dbUserData)
      })
    })    
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
  });
  
  // searche for the user in db based on the provided username
  router.post('/login', (req, res) => {
    User.findOne({
      where: {
        username: req.body.username
      }
    })

    // handle response after finding user in db. verify the provided password with the hashed password in db. if username or password is wrong send message. 
    .then(dbUserData => {
      //verify user
      if(!dbUserData) {
        res.status(400).json({ message: 'Username or Password is incorrect' });
        return;
      }
      const validPassword = dbUserData.checkPassword(req.body.password);
      if (!validPassword) {
        res.status(400).json({ message: 'Username or Password is incorrect' });
        return;
      }
      req.session.save(() => {
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;
        res.json({user: dbUserData, message: 'You are now logged in!' });
      });
    });
  });
  
  //logout route
  router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
      req.session.destroy(() => {
        res.status(204).end();
      })
    } else {
      res.status(404).end();
    }
  });
  
  // log the user out and end their session. 
  router.put('/:id', (req, res) => {
    User.update(req.body, {
      individualHooks: true,
      where: {
        id: req.params.id
      }
    })
    .then(dbUserData => {
      if (!dbUserData[0]) {
        res.status(404).json({ message: 'No User found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      res.status(500).json(err);
    });
  });
  
  // take provide user ID and delete from db. if no user is found return 404 response. 
  router.delete('/:id', (req, res) => {
    User.destroy({
      where: {
        id: req.params.id
      }
    })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No User found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
  });
  
  
  module.exports = router;
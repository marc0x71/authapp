const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const config = require('../config/database');

// register
router.post('/register', (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  });
  User.addUser(newUser, (err, user) => {
    if (err) {
      res.json({ success: false, msg: 'Failed to register user'});
    } else {
      res.json({ success: true, msg: 'User registered'});
    }
  });
});

// authenticate
router.post('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if (err) throw err;
    if (!user) {
      res.json({ success: false, msg: 'User not found'});
    } else {
      User.comparePassword(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          const token = jwt.sign(user, config.secret, {
            expiresIn: 604800 // one week
          })
          res.json({
            success: true,
            token: 'JWT ' + token,
            user: {
              id: user._id,
              username: user.username,
              email: user.email,
              name: user.name
            }
          });
        } else {
          res.json({ success: false, msg: 'Wrong password'});
        }
      });
    }
  });
});

// profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({ user: req.user });
});

module.exports = router;

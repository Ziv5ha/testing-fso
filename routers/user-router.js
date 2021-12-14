const express = require('express');
const router = express.Router();
const User = require('../models/user-model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const REFRESHTOKENS = [];

router.post('/register', async (req, res, next) => {
  try {
    const { username, name, password } = req.body;
    if (!username || !password || password.toString().legnth < 3) {
      res.status(400).send('username or password missing or too short');
      return;
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(409).send('user already exists');
      throw 'user already exists';
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.insertMany({ username, name, password: hashedPassword });
    res.status(201).send('Register Success');
  } catch (error) {
    res.status(500).send();
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  console.log(user);
  if (!user) {
    res.status(404).send('cannot find use');
  }
  try {
    if (await bcrypt.compare(password, user.password)) {
      const accessToken = jwt.sign(
        { name: user.username, id: user._id },
        process.env.SECRET,
        { expiresIn: '16h' }
      );
      res.send({ accessToken, username });
    } else {
      res.status(403).send('User or Password incorrect');
    }
  } catch (error) {}
});

router.get('/users', async (req, res) => {
  const rawUsers = await User.find({}).populate('posts');
  const users = rawUsers.map(({ username, name, _id, posts }) => ({
    username,
    name,
    posts,
    id: _id,
  }));
  res.send(users);
});

router.post('/logout', (req, res) => {
  const { token } = req.body;
  if (!token) {
    res.status(400).send('Refresh Token Required');
    return;
  }
  try {
    REFRESHTOKENS.splice(REFRESHTOKENS.indexOf(token), 1);
    res.send('User Logged Out Successfully');
  } catch (error) {
    res.status(400).send('Invalid Refresh Token');
  }
});

module.exports = router;

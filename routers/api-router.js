const express = require('express');
const router = express.Router();
const Blog = require('../models/blog-model');
const User = require('../models/user-model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.get('/blogs', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

router.post('/blogs', async (request, response) => {
  const { title, author, url, likes } = request.body;
  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }
  const user = await User.findById(decodedToken.id);
  if (!title || !author || !url) {
    response.status(400).send('Bad Request');
    return;
  }
  const blog = new Blog({ title, author, url, likes, user: user._id });
  const result = await blog.save();
  user.notes = user.notes.concat(result._id);
  await user.save();
  response.status(201).json(result);
});

router.post('/like/:id', async (req, res) => {
  try {
    await Blog.updateOne({ _id: req.params.id }, { $inc: { likes: +1 } });
    res.send('Post Updated');
  } catch (error) {
    res.status(404).send('Post Not Found');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Blog.deleteOne({ _id: req.params.id });
    res.send('Post Deleted');
  } catch (error) {
    res.status(404).send('Post Not Found');
  }
});

module.exports = router;

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

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
  const user = request.user;
  if (!title || !author || !url) {
    response.status(400).send('Bad Request');
    return;
  }
  const blog = new Blog({ title, author, url, likes, user: user._id });
  const result = await blog.save();
  user.posts = user.posts.concat(result._id);
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
    const post = await Blog.findById(req.params.id);
    if (!post.user || post.user.toString() !== req.user._id.toString()) {
      res.status(401).send("Can't delete post");
      return;
    }
    await Blog.deleteOne({ _id: req.params.id });
    res.send('Post Deleted');
  } catch (error) {
    res.status(404).send('Post Not Found');
  }
});

module.exports = router;

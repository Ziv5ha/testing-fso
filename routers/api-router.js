const express = require('express');
const router = express.Router();
const Blog = require('../models/blog-model');

router.get('/blogs', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

router.post('/blogs', async (request, response) => {
  const { title, author, url, likes } = request.body;
  if (!title || !author || !url) {
    response.status(400).send('Bad Request');
    return;
  }
  const blog = new Blog({ title, author, url, likes });
  const result = await blog.save();
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

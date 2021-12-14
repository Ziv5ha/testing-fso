const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog-model');

const api = supertest(app);

const initialPosts = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
];
const postToAdd = {
  title: 'The Cake is not a lie',
  author: 'GLaDOS',
  url: 'https://theportalwiki.com/wiki/GLaDOS_voice_lines',
};
beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialPosts);
});

describe('DB initialized correctly', () => {
  test('The correct number of blogs are stored', async () => {
    const res = await api.get('/api/blogs');
    expect(res.body.length).toBe(initialPosts.length);
  });

  test('Each blog post has an ID', async () => {
    const res = await api.get('/api/blogs');
    let eachPostHasId = true;
    res.body.forEach((post) => {
      if (eachPostHasId) {
        if (!post._id) {
          eachPostHasId = false;
        }
      }
    });
    expect(eachPostHasId).toBe(true);
  });
});
describe('adding a post', () => {
  test('should add a post to the DB', async () => {
    await api.post('/api/blogs').send(postToAdd);
    const res = await api.get('/api/blogs');
    expect(res.body.length).toBe(initialPosts.length + 1);
  });
  test('should a the correct post', async () => {
    await api.post('/api/blogs').send(postToAdd);
    const res = await api.get('/api/blogs');
    let postAdded = Boolean(filterpostToAdd(res.body));
    expect(postAdded).toBe(true);
  });
  test('should have 0 like if no likes were suplied', async () => {
    await api.post('/api/blogs').send(postToAdd);
    const res = await api.get('/api/blogs');
    const postAdded = filterpostToAdd(res.body);
    expect(postAdded[0].likes).toBe(0);
  });
  test('should return Bad Request if no title or url were given', async () => {
    const res = await api.post('/api/blogs').send();
    expect(res.status).toBe(400);
    expect(res.text).toBe('Bad Request');
  });
});

describe('deleting a post', () => {
  test('should delete a post', async () => {
    const allPosts = await api.get('/api/blogs');
    const id = allPosts.body[0]._id;
    await api.delete(`/api/${id}`);
    const res = await api.get('/api/blogs');
    expect(res.body.length).toBe(initialPosts.length - 1);
  });
  test('should return error with wrong id', async () => {
    const res = await api.delete(`/api/5`);
    expect(res.status).toBe(404);
    expect(res.text).toBe('Post Not Found');
  });
});

describe('liking a post', () => {
  test('should update the likes on the post', async () => {
    const allPosts = await api.get('/api/blogs');
    const id = allPosts.body[0]._id;
    await api.post(`/api/like/${id}`);
    const res = await api.get('/api/blogs');
    expect(res.body[0].likes).toBe(allPosts.body[0].likes + 1);
  });
  test('should return error with wrong id', async () => {
    const res = await api.post(`/api/like/5`);
    expect(res.status).toBe(404);
    expect(res.text).toBe('Post Not Found');
  });
});

afterAll(() => {
  mongoose.connection.close();
  app.killServer();
});

const filterpostToAdd = (blogs) => {
  return blogs.filter((post) => {
    if (
      post.author === postToAdd.author &&
      post.title === postToAdd.title &&
      post.url === postToAdd.url
    ) {
      return post;
    }
  });
};

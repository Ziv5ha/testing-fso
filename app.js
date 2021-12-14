const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const apiRouter = require('./routers/api-router');
const userRouter = require('./routers/user-router');
const { tokenExtractor, userExtractor } = require('./middlewates/auth');

mongoose.connect(process.env.DATABASE);

app.use(cors());
app.use(express.json());

app.use('/user', userRouter);
app.use(tokenExtractor);
app.use(userExtractor);
app.use('/api', apiRouter);

const PORT = 3003;

const listener = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.killServer = () => {
  listener.close();
};

module.exports = app;

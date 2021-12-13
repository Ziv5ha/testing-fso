const http = require('http');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const apiRouter = require('./routers/api-router');

mongoose.connect(process.env.DATABASE);

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

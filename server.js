const express = require('express');
const dotenv = require('dotenv');
const auth = require('./routes/auth');
const project = require('./routes/project');
const task = require('./routes/task');
const comment = require('./routes/comment');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const loggingMiddleware = require('./middleware/logging');
const path = require('path');

const app = express();

dotenv.config({ path: './config/config.env' });

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(loggingMiddleware);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/users', auth);
app.use('/api/projects', project);
app.use('/api/tasks', task);
app.use('/api/comments', comment);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log('connected');
});

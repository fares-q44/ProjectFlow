const express = require('express');
const dotenv = require('dotenv');
const auth = require('./routes/auth');
const project = require('./routes/project');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const loggingMiddleware = require('./middleware/logging');

const app = express();

dotenv.config({ path: './config/config.env' });

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(loggingMiddleware);

app.use('/api/users', auth);
app.use('/api/projects', project);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log('connected');
});

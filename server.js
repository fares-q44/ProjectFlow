const express = require('express');
const dotenv = require('dotenv');
const auth = require('./routes/auth');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');

const app = express();

dotenv.config({ path: './config/config.env' });

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(errorHandler);

app.use('/api/auth', auth);

app.listen(process.env.PORT, () => {
  console.log('connected');
});

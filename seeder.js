const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotebv = require('dotenv');
const Project = require('./models/Project');
const Task = require('./models/Task');
const Comment = require('./models/Comment');
const connectDB = require('./config/db');

dotebv.config({ path: './config/config.env' });

const projects = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/projects.json`, 'utf-8')
);
const tasks = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/tasks.json`, 'utf-8')
);
const comments = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/comments.json`, 'utf-8')
);

const importData = async () => {
  await connectDB();
  try {
    await Project.create(projects);
    await Task.create(tasks);
    await Comment.create(comments);
    console.log('Data imported'.green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const deleteData = async () => {
  await connectDB();
  try {
    await Project.deleteMany();
    await Task.deleteMany();
    await Comment.deleteMany();
    console.log('Data Destroyed'.red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}

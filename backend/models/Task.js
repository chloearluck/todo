const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;

const taskSchema = new mongoose.Schema({
  name: String,
  userId: ObjectId,
  date: Date,
  daysOverdue: Number,
  completed: Boolean
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;

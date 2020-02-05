const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;

const daySchema = new mongoose.Schema({
  date: Date,
  task_ids: [ObjectId],
  userId: ObjectId,
}, { timestamps: true });

const Day = mongoose.model('Day', daySchema);

module.exports = Day;

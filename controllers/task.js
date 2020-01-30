const async = require('async');
const moment = require('moment');
const Task = require('../models/Task');

/**
 * GET /task
 * List of user's tasks.
 */
exports.getTask = (req, res) => {
  const taskDays = [];
  const ndays = 4;
  if (!req.user) {
    return res.redirect('/login');
  }

  for (let i = 0; i < ndays; i++) {
    const date = moment().startOf('day').add(i, 'days');
    const dateString = (i === 0 ? 'Today' : (i === 1 ? 'Tomorrow' : date.format('MMM D')));
    taskDays.push({ date: date.toDate(), tasks: [], dateString: dateString });
  }

  async.each(taskDays, (day, callback) => {
    Task.find({ userId: req.user._id, date: day.date }, (err, tasks, next) => {
      if (err) { return next(err); }
      day.tasks = tasks;
      callback();
    });
  }, (err) => {
    if (err) { return err; }
    res.render('task/index', {
      title: 'My To Do List',
      taskDays
    });
  });
};

/**
 * POST /task
 * Create a new task.
 */
exports.postTask = (req, res, next) => {
  const task = new Task({ name: req.body.name, userId: req.body.userId, date: req.body.date });

  task.save((err) => {
    if (err) { return next(err); }
  });

  res.redirect('/task');
};


/**
 * POST /task/delete
 * Delete task.
 */
exports.postDeleteTask = (req, res, next) => {
  Task.deleteOne({ _id: req.body.taskid }, (err) => {
    if (err) { return next(err); }
    res.redirect('/task');
  });
};

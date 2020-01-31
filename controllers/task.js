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

// TO DO: make this a scheduled task instead of a rest call
/**
 * GET /task/refrech
 * update the date on any overdue tasks
 */
exports.getTaskRefresh = (req, res, next) => {
  const today = moment().startOf('day').toDate();
  Task.updateMany({ date: { $lt: today } },
    [{ $set: { daysOverdue: { $round: [{ $divide: [{ $subtract: [today, '$date'] }, 8.64e7] }] } } },
      { $set: { date: today } }
    ], (err, result) => {
      if (err) { return next(err); }
      console.log(result);
      res.redirect('/task');
    });
};


/**
 * POST /task
 * Create a new task.
 */
exports.postTask = (req, res, next) => {
  const task = new Task({
    name: req.body.name, userId: req.user._id, date: req.body.date, daysOverdue: 0
  });

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

const async = require('async');
const moment = require('moment');
const Task = require('../models/Task');
const Day = require('../models/Day');

/**
 * GET /task
 * List of user's tasks.
 */
exports.getTask = (req, res, next) => {
  const taskDays = [];
  const ndays = 4;
  const taskMap = new Map();
  if (!req.user) {
    return res.redirect('/login');
  }

  for (let i = 0; i < ndays; i++) {
    const date = moment().startOf('day').add(i, 'days');
    const dateString = (i === 0 ? 'Today' : (i === 1 ? 'Tomorrow' : date.format('MMM D')));
    taskDays.push({ date: date.toDate(), tasks: [], dateString: dateString });
  }

  async.parallel([(callback) => {
    Task.find({ date: { $gte: taskDays[0].date }, date: { $lte: taskDays[ndays - 1].date } },
      (err, tasks) => {
        if (err) { return next(err); }
        for (let i = 0; i < tasks.length; i++) {
          taskMap[tasks[i]._id] = tasks[i];
        }
        callback();
      });
  }, (callback) => {
    async.each(taskDays, (taskDay, callback2) => {
      Day.findOne({ date: taskDay.date }, (err, day) => {
        if (err) { return next(err); }
        if (day) {
          taskDay.task_ids = day.task_ids;
          taskDay.day_id = day._id;
          callback2();
        } else {
          Day.create({ date: taskDay.date, task_ids: [] }, (err, day) => {
            if (err) { return next(err); }
            taskDay.task_ids = day.task_ids;
            taskDay.day_id = day._id;
            callback2();
          });
        }
      });
    }, (err) => {
      if (err) { return next(err); }
      callback();
    });
  }], (err) => {
    if (err) { return next(err); }
    for (let i = 0; i < ndays; i++) {
      for (let j = 0; j < taskDays[i].task_ids.length; j++) {
        const taskId = taskDays[i].task_ids[j];
        taskDays[i].tasks.push(taskMap[taskId]);
      }
    }

    res.render('task', {
      title: 'My To Do List',
      taskDays
    });
  });
};


// TO DO: make this a scheduled task instead of a rest call
/**
 * GET /task/refresh
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

  task.save((err, createdTask) => {
    if (err) { return next(err); }
    Day.findByIdAndUpdate(req.body.dayId, { $push: { task_ids: createdTask._id } }, (err) => {
      if (err) { return next(err); }
      res.redirect('/task');
    });
  });
};

/**
 * POST /task/delete
 * Delete task.
 */
exports.postDeleteTask = (req, res, next) => {
  Task.deleteOne({ _id: req.body.taskId }, (err) => {
    if (err) { return next(err); }
    Day.findByIdAndUpdate(req.body.dayId, { $pull: { task_ids: req.body.taskId } }, (err) => {
      if (err) { return next(err); }
      res.redirect('/task');
    });
  });
};

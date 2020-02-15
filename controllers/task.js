const async = require('async');
const moment = require('moment');
const schedule = require('node-schedule');
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
    Task.find({
      date: { $gte: taskDays[0].date },
      date: { $lte: taskDays[ndays - 1].date },
      userId: req.user._id
    }, (err, tasks) => {
      if (err) { return next(err); }
      for (let i = 0; i < tasks.length; i++) {
        taskMap[tasks[i]._id] = tasks[i];
      }
      callback();
    });
  }, (callback) => {
    async.each(taskDays, (taskDay, callback2) => {
      Day.findOne({ date: taskDay.date, userId: req.user._id }, (err, day) => {
        if (err) { return next(err); }
        if (day) {
          taskDay.task_ids = day.task_ids;
          taskDay.day_id = day._id;
          callback2();
        } else {
          Day.create({ date: taskDay.date, task_ids: [], userId: req.user._id }, (err, day) => {
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


/**
 * Refresh tasks daily at midnight
 * Uncompleted tasks are moved to the next day, old days are deleted.
 */
schedule.scheduleJob('0 5 * * *', () => { //midnight est, 5am utc
  console.log('--- DAILY REFRESH IS RUNNING ---');
  const findOrCreateDay = (query, doc, callback) => {
    Day.findOne(query, (err, day) => {
      if (err) { return err; }
      if (day) {
        callback(err, day);
      } else {
        Day.create(doc, (err, day) => {
          if (err) { return err; }
          callback(err, day);
        });
      }
    });
  };

  const today = moment().startOf('day').toDate();
  const overdue = [];
  async.series([
    (callbackOverdueListPopulated) => {
      Task.find({ date: { $lt: today }, completed: false }, (err, tasks) => {
        if (err) { return err; }
        for (let i = 0; i < tasks.length; i++) {
          overdue.push(tasks[i]._id.toString());
        }
        callbackOverdueListPopulated();
      });
    },
    (callbackTasksUpdated) => {
      Task.updateMany({ date: { $lt: today }, completed: false },
        [{ $set: { daysOverdue: { $round: [{ $divide: [{ $subtract: [today, '$date'] }, 8.64e7] }] } } },
          { $set: { date: today } }
        ], (err, result) => {
          if (err) { return err; }
          console.log(result);
          callbackTasksUpdated();
        });
    },
    (callbackDaysDeleted) => {
      Day.find({ date: { $lt: today } }, (err, oldDays) => {
        async.eachSeries(oldDays, (oldDay, callbackOldDayCopied) => {
          findOrCreateDay({ date: today, userId: oldDay.userId },
            { date: today, userId: oldDay.userId, task_ids: [] },
            (err, day) => {
              if (err) { return err; }
              const toPrepend = [];
              for (let i = 0; i < oldDay.task_ids.length; i++) {
                if (overdue.includes(oldDay.task_ids[i]._id.toString())) {
                  toPrepend.push(oldDay.task_ids[i]);
                }
              }

              day.task_ids = toPrepend.concat(day.task_ids);
              day.save((err) => {
                if (err) { return err; }
                Day.findByIdAndDelete(oldDay._id, (err) => {
                  if (err) return err;
                  callbackOldDayCopied();
                });
              });
            });
        }, (err) => {
          if (err) { return err; }
          callbackDaysDeleted();
        });
      });
    }],
  (err) => {
    if (err) { return err; }
    console.log('refresh complete');
  });
});

/**
 * POST /task
 * Create a new task.
 */
exports.postTask = (req, res, next) => {
  const task = new Task({
    name: req.body.name, userId: req.user._id, date: req.body.date, daysOverdue: 0, completed: false
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

/**
 * POST /task/completion
 * Updated the completed status of a task
 */
exports.postTaskCompletion = (req, res, next) => {
  let completed;

  if (req.body.completed && req.body.completed === 'on') {
    completed = true;
  } else {
    completed = false;
  }

  Task.findByIdAndUpdate(req.body.taskId, { completed: completed }, (err) => {
    if (err) { return next(err); }
    res.redirect('/task');
  });
};

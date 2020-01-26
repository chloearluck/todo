const Task = require('../models/Task');

/**
 * GET /task
 * List of API examples.
 */
exports.getTask = (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }

  Task.find({ userId: req.user._id }, (err, tasks, next) => {
    if (err) { return next(err); }

    res.render('task/index', {
      title: 'My To Do List',
      tasks
    });
  });
};

/**
 * POST /task
 * Create a new task.
 */
exports.postTask = (req, res, next) => {
  const task = new Task({ name: req.body.name, userId: req.body.userId });

  task.save((err) => {
    if (err) { return next(err); }
  });

  res.redirect('/task');
};


/**
 * POST /task/delete
 * Delete user account.
 */
exports.postDeleteTask = (req, res, next) => {
  Task.deleteOne({ _id: req.body.taskid }, (err) => {
    if (err) { return next(err); }
    res.redirect('/task');
  });
};

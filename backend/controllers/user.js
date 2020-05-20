const passport = require('passport');
const validator = require('validator');
const User = require('../models/User');

/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' });
  if (validator.isEmpty(req.body.password)) validationErrors.push({ msg: 'Password cannot be blank.' });

  if (validationErrors.length) {
    return res.status(400).send(validationErrors);
  }
  req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });

  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      return res.status(400).send(info);
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      return res.status(200).send();
    });
  })(req, res, next);
};

/**
 * GET /logout
 * Log out.
 */
exports.logout = (req, res) => {
  req.logout();
  req.session.destroy((err) => {
    if (err) console.log('Error : Failed to destroy the session during logout.', err);
    req.user = null;
    res.status(200).send();
  });
};

/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' });
  if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' });
  if (req.body.password !== req.body.confirmPassword) validationErrors.push({ msg: 'Passwords do not match' });

  if (validationErrors.length) {
    return res.status(400).send(validationErrors);
  }
  req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });

  const user = new User({
    email: req.body.email,
    password: req.body.password,
    timezone: req.body.timezone
  });

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) { return next(err); }
    if (existingUser) {
      return res.status(400).send('Account with that email address already exists.');
    }
    user.save((err) => {
      if (err) { return next(err); }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        res.status(200).send();
      });
    });
  });
};

/**
 * GET /account
 * Profile page.
 */
exports.getAccount = (req, res) => {
  const profile = {
    email: req.user.email,
  };

  if (req.user.name) profile.name = req.user.name;
  if (req.user.timezone) profile.timezone = req.user.timezone;

  res.json(profile); // this returns 200 OK
};

/**
 * POST /account/profile
 * Update profile information.
 */
exports.postUpdateProfile = (req, res, next) => {
  if (req.body.email && !validator.isEmail(req.body.email)) {
    res.status(400).send('invalid email address');
  }

  if (req.body.email) {
    req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    if (req.body.email && req.body.email !== user.email) {
      user.emailVerified = false;
    }

    if (req.body.email) user.email = req.body.email;
    if (req.body.timezone) user.timezone = req.body.timezone;
    if (req.body.name) user.name = req.body.name;
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          return res.status(400).send('The email address you have entered is already associated with an account.');
        }
        return next(err);
      }
      res.status(200).send();
    });
  });
};

/**
 * POST /account/password
 * Update current password.
 */
exports.postUpdatePassword = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' });
  if (req.body.password !== req.body.confirmPassword) validationErrors.push({ msg: 'Passwords do not match' });

  if (validationErrors.length) {
    return res.status(400).send(validationErrors);
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.password = req.body.password;
    user.save((err) => {
      if (err) { return next(err); }
      return res.status(200).send();
    });
  });
};

/**
 * POST /account/delete
 * Delete user account.
 */
exports.postDeleteAccount = (req, res, next) => {
  User.deleteOne({ _id: req.user.id }, (err) => {
    if (err) { return next(err); }
    req.logout();
    res.status(200).send();
  });
};

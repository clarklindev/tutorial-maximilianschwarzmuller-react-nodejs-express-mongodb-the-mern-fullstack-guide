const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
  let users;
  try {
    //users = User.find({}, 'email name');    //only return 'email' and 'name'
    users = await User.find({}, '-password'); //dont return 'password'
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later',
      500
    );
    return next(error);
  }
  res.json({
    users: users.map((user) => user.toObject({ getters: true })),
  });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { name, email, password } = req.body;

  //use mongodb
  let existingUser;
  try {
    //try find if user exists (findOne uses criteria to match... here by email)
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later',
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      'user exists already, please login instead',
      422
    );
    return next(error);
  }

  const createdUser = new User({
    id: uuid(),
    name,
    email,
    password,
    image: req.file.path,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError('signing up failed, please try again', 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  //use mongodb
  let existingUser;

  //validate email
  try {
    //try find if user exists (findOne uses criteria to match... here by email)
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later',
      500
    );

    return next(error);
  }

  //check if email/password is in database and correct
  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      'Invalid credentials, could not log you in',
      401
    );
    return next(error);
  }

  res.json({
    message: 'Logged in!',
    user: existingUser.toObject({ getters: true }),
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;

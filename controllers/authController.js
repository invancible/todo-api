const jwt = require('jsonwebtoken');
const User = require('../models/user');

const catchAsync = require('../utils/catchAsync');

const HOURS = 24;
const MINUTES = 60;
const SECONDS = 60;
const MILI = 1000;

// Generate a token with expiration date
const signToken = (id) =>
  jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// Generic function for sending res with token included
const sendResponseWithToken = (user, statusCode, res) => {
  const token = signToken(user._id); // create token for the user

  const cookieOptions = {
    expires: new Date(
      Date.now() +
        process.env.JWT_COOKIE_EXPIRES_IN * HOURS * MINUTES * SECONDS * MILI
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  // Also put the token into the cookie
  res.cookie('jwt', token, cookieOptions);

  user.password = undefined; // To not include password in the data res

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  // create new user (validation happens on DB level)
  // NOTE: validation error will auto send error res due to catchAsync wrapper
  const newUser = await User.create({
    name,
    email,
    password,
    confirmPassword,
  });

  // Send response with token
  sendResponseWithToken(newUser, 201, res);
});

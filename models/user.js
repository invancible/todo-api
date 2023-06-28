const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Invalid email format'],
    },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false, // Do not include in query
    },
    confirmPassword: {
      type: String,
      required: [true, 'Confirm password is required'],
      validate: {
        validator: function (confirmPassword) {
          // Only works on CREATE and SAVE
          return confirmPassword === this.password;
        },
        message: 'Password do not match.',
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordTokenExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { timestamps: true }
);

/* DOCUMENT MIDDLEWARE */

// This will run for every req that involves password (ex. signup and change password)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12); // Hash password

  this.confirmPassword = undefined; // Don't save confirm password to DB
  next();
});

/* CUSTOM METHODS */

// Check if password given match the corresponding password
userSchema.methods.passwordMatched = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = model('User', userSchema);

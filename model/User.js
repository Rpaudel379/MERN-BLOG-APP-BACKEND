const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please enter username"],
    unique: true,
    lowercase: true,
    maxLength: [15, "max length for username is 15 characters"],
    minLength: [3, "min length for username is 3 characters"],
  },
  email: {
    type: String,
    required: [true, "please enter email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "please enter valid email address"],
    maxLength: [25, "max length for email is 25 characters"],
  },
  password: {
    type: String,
    required: [true, "please enter password"],
    minlength: [6, "minlength password length is 6 characters"],
    maxLength: [25, "max length for password is 25 characters"],
  },
});

// fire a function before doc is saved to db  //? to hash the password
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method for login user //? also to match the hashing password
userSchema.statics.login = async function (username, password) {
  const user = await this.findOne({ username });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect username");
};

const User = mongoose.model("user", userSchema);

module.exports = User;

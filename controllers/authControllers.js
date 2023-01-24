const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// error handling during signup and signin
const handleErrors = (err) => {
  //console.log(err.message, err.code, "code");
  let errors = {
    username: "",
    email: "",
    password: "",
  };

  //? signin page errors
  if (err.message === "incorrect username") {
    errors.username = "that username is not registered";
  }
  if (err.message === "incorrect email") {
    errors.username = "username and email donot match";
    errors.email = "username and email donot match";
  }
  if (err.message === "incorrect password") {
    errors.password = "that password is not correct";
  }

  //? duplicate error code  signup page errors
  if (err.code === 11000) {
    errors.username = "username or email already exists";
    return errors;
  }
  //?  signup validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

//? jwt
const maxAge = 3 * 24 * 60 * 60; //? 3 days

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: maxAge });
};

//? signup post
module.exports.signup_post = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ error: "please add all fields" });
    return;
  }

  try {
    const user = await User.create({ username, email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
      sameSite: "none",
      secure: true,
    });

    res
      .status(201)
      .json({ id: user.id, username: user.username, email: user.email });
  } catch (err) {
    const error = handleErrors(err);
    res.status(500).json(error);
  }
};

//? signin post
module.exports.login_post = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: "please add all fields" });
    return;
  }

  try {
    const user = await User.login(username, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
      sameSite: "none",
      secure: true,
    });

    res
      .status(201)
      .json({ id: user.id, username: user.username, email: user.email });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(500).json(errors);
  }
};

// logout
module.exports.logout_post = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.json({ loggedOut: true });
};

// check validity of user to access dashboard page
// check if token is valid

module.exports.checkUser_get = (req, res) => {
  res.status(200).json({ validUser: true });
};

/* module.exports.dashboard_get = (req, res) => {
  res.json({ user: res.locals.user });
}; */

module.exports.valid_get = (req, res) => {
  res.status(200).json(res.locals.user);
};

module.exports.change_info_post = async (req, res) => {
  if (res.user.id == req.body.userId) {
    if (!req.body.type || !req.body.value) {
      res.status(500).json({ error: "must have type and value" });
      return;
    }

    try {
      const changeType = req.body.type;
      const changeValue = req.body.value;
      const userId = req.body.userId;

      if (changeType === "password") {
        if (changeValue.length < 6) {
          throw new Error("please try again");
        }
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(changeValue, salt);

        await User.updateOne(
          { _id: userId },
          {
            $set: { password: passwordHash },
          }
        );
      } else {
        await User.updateOne(
          { _id: userId },
          {
            $set: {
              [changeType]: changeValue,
            },
          },
          { runValidators: true }
        );
      }

      const updatedUser = await User.findById(userId);

      res.status(200).json({
        username: updatedUser.username,
        email: updatedUser.email,
        id: updatedUser.id,
      });
    } catch (err) {
      res
        .status(400)
        .json({ error: "error please try again with different value" });
    }
  } else {
    res.status(400).json({ error: "invalid user" });
  }
};

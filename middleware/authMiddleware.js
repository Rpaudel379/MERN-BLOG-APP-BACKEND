const jwt = require("jsonwebtoken");
const User = require("../model/User");

/* const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web tokens exists and is verified or not
  if (token) {
    jwt.verify(token, "anish-dai-secret", (err, decodedToken) => {
      if (err) {
        console.log(err.message, "require auth error"); //! error
        res.json({ redirect: true });
      } else {
        next();
      }
    });
  } else {
    res.json({ redirect: true });
  }
};
 */
/* const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "anish-dai-secret", async (err, decodedToken) => {
      if (err) {
        console.log(err.message, "check user error"); //! error
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = {
          username: user.username,
          email: user.email,
        };
        next();
      }
    });
  } else {
    res.locals.user = null;
    next(); 
  }
}; */

const validToken = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (token) {
    jwt.verify(token, process.env.JWT_KEY, async (err, decodedToken) => {
      if (err) {
        console.log(err.message, "check user error"); //! error
        res.status(500).json(false);
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = {
          username: user.username,
          email: user.email,
          id: user._id,
        };
        next();
      }
    });
  } else {
    res.status(500).json(false);
  }
};

const  checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.JWT_KEY, async (err, decodedToken) => {
      if (err) {
        res.clearCookie("jwt");
        res.status(401).json({ error: "invalid token" });
      } else {
        try {
          const user = await User.findById(decodedToken.id);
          res.user = user;
          next();
        } catch (error) {
          res.status(400).json({ error: "invalid user" });
        }
      }
    });
  } else {
    res.status(404).json({ error: "no user" });
  }
};

module.exports = {
  //requireAuth,
  checkUser,
  validToken,
};

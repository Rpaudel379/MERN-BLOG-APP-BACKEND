const { Router } = require("express");
const authControllers = require("../controllers/authControllers");
const {
  requireAuth,
  validToken,
  checkUser,
} = require("../middleware/authMiddleware");
const router = Router();

router.post("/signup", authControllers.signup_post);
router.post("/login", authControllers.login_post);
router.post("/logout", authControllers.logout_post);

// only checks if a user is valid by using token and database
router.get("/checkUser", checkUser, authControllers.checkUser_get);
router.post("/change", checkUser, authControllers.change_info_post);

router.post("/valid", validToken, authControllers.valid_get);


module.exports = router;
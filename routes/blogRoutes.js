const { Router } = require("express");
const blogControllers = require("../controllers/blogControllers");
const { validToken, checkUser } = require("../middleware/authMiddleware");
const router = Router();

router.get("/getblogs", blogControllers.blog_get);
router.post("/userBlog", checkUser, blogControllers.userBlog_post);

router.post("/addblog", blogControllers.blog_post);
router.get("/singleblog", blogControllers.singleblog_get);
module.exports = router;

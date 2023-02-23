const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "please add title"],
      minlength: [3, "minlength is 3 characters"],
      maxlength: [80, "maxlength is 80 characters"],
    },
    body: {
      type: String,
      required: [true, "please add body"],
      minlength: [3, "minlength is 3 characters"],
      maxlength: [1000, "maxlength is 1000 characters"],
    },
    image: {
      type: String,
      required: [true, "please add image"],
    },
    userId: {
      type: String,
      required: [true, "required userId"],
    },
    name: {
      type: String,
      required: true,
    },
    imageID: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("blog", blogSchema);

module.exports = Blog;

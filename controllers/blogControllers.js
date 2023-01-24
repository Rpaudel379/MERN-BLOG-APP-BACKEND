const Blog = require("../model/Blog");

const { storage } = require("./firebase");
const {
  ref,
  uploadString,
  getDownloadURL,
  deleteObject,
} = require("firebase/storage");

const handleErrors = (err) => {
  //console.log(err.message, err.code, "code");
  let errors = {
    image: "",
    title: "",
    body: "",
  };

  console.log(err.message);

  if (err.message.includes("blog validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  if (err.message.includes("image must be inserted")) {
    errors.image = err.message;
  }

  return errors;
};

module.exports.blog_get = async (req, res) => {
  try {
    const blog = await Blog.find();
    res.status(200).json(blog);
  } catch (err) {
    console.log(err, "catch error");
    res.status(500).json({ error: "could not fetch blogs" });
  }
};

module.exports.blog_post = async (req, res) => {
  const { title, body, image, userId, name } = req.body;

  try {
    if (!image) {
      throw Error("image must be inserted");
    }

    const imageID = `${userId}_${Date.now()}`;

    const imageRef = ref(storage, imageID);
    await uploadString(imageRef, image, "data_url");
    const downloadURL = await getDownloadURL(imageRef);

    try {
      const newBlog = await Blog.create({
        title,
        body,
        image: downloadURL,
        userId,
        name,
        imageID,
      });

      console.log(newBlog);
      res.status(201).json({ newBlog, success: true });
    } catch (error) {
      deleteObject(imageRef)
        .then(() => console.log("image deleted"))
        .catch((err) => console.log(err));

      const errors = handleErrors(error);
      res.status(500).json(errors);
    }
  } catch (error) {
    const errors = handleErrors(error);
    res.status(500).json(errors);
  }

  /*  try {
    const upload = await cloudinary.uploader.upload(image, {
      upload_preset: "React-blog",
    });

    console.log(upload);
  } catch (error) {
    console.log(error);
  } */

  /* try {
    const upload = await cloudinary.uploader.upload(image, {
      upload_preset: "React-blog",
    });
    const imgUrl = upload.secure_url;
    const cloudinary_public_id = upload.public_id;
    await Blog.create({
      title,
      body,
      image: imgUrl,
      userId,
      name,
      cloudinary_public_id,
    });

    res.status(201).json({ ok: true });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(500).json(errors);
  } */
};

module.exports.singleblog_get = async (req, res) => {
  const id = req.headers.blogid;
  try {
    const singleBlog = await Blog.findOne({ _id: id });
    res.status(201).json(singleBlog);
  } catch (err) {
    //console.log(err);
    res.status(404).json(err);
  }
};

module.exports.userBlog_post = async (req, res) => {
  const userId = req.body.userId;
  console.log(userId);
  console.log(res.user);

  if (res.user._id == userId) {
    try {
      const userBlog = await Blog.find({ userId });
      res.status(201).json(userBlog);
    } catch (err) {
      console.log(err);
      res.status(404).json({ error: "invalid user" });
    }
  } else {
    res.status(400).json({ error: "user validation failed" });
  }
};

const express = require("express");
const auth = require("../../middleware/authenticate");
const PostSchema = require("../../schema/postSchema");
const router = express.Router();

router.post("/add_posts", auth, async (req, res) => {
  const { title, description, project_id } = req.body;

  if (!title || title.length === 0 || !project_id)
    return res.send({ error: true, msg: "Please add any title or project id" });
  req.user.password = undefined;
  req.user.selected = undefined;
  req.user.isAdmin = undefined;
  req.user.createdAt = undefined;
  req.user.updatedAt = undefined;
  req.user.__v = undefined;
  updatedAt = undefined;
  const data = new PostSchema({
    title,
    description,
    date: new Date().toUTCString(),
    postedBy: req.user,
    project_id,
  });

  await data.save((err, result) => {
    if (err) {
      return res.send({ msg: err, data: [], error: true });
    }
    return res.send({ msg: "Successful", data, error: false });
  });
});

router.post("/get_posts", auth, async (req, res) => {
  try {
    const { project_id } = req.body;
    await PostSchema.find({ project_id })
      .populate("postedBy", "name _id")
      .exec((err, result) => {
        if (err) {
          return res.send({ msg: err, data: [], error: true });
        }
        return res.send({ msg: "Successful", data: result, error: false });
      });
  } catch (error) {
    return res.send({ msg: "Some getting wrong", error: true, data: [] });
  }
});

const Posts = router;
module.exports = Posts;

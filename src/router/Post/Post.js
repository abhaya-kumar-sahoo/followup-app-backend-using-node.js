const express = require("express");
const auth = require("../../middleware/authenticate");
const PostSchema = require("../../schema/postSchema");
const router = express.Router();

router.post("/add_posts", auth, async (req, res) => {
  const { project_comments, project_id } = req.body;

  if (project_comments.length === 0 || !project_id)
    return res.send({ error: true, msg: "Please add any title or project id" });
  const today = new Date();
  var date = parseInt(
    new Date().toJSON().slice(0, 10).replace("-", "").replace("-", "")
  );
  var time = parseInt(
    `${today.getHours()}${today.getMinutes()}${today.getSeconds()}`
  );
  const isUser = await PostSchema.find({ postedBy: req.user._id });
  let newdata = {
    ...project_comments[0],
    created_date: date,
    created_time: time,
  };
  if (isUser.length === 0) {
    req.user.password = undefined;
    req.user.selected = undefined;
    req.user.isAdmin = undefined;
    req.user.createdAt = undefined;
    req.user.updatedAt = undefined;
    req.user.__v = undefined;
    req.user.updatedAt = undefined;

    const data = new PostSchema({
      project_comments: [newdata],
      postedBy: req.user,
      project_id,
      created_date: date,
      created_time: time,
    });

    await data.save((err, result) => {
      if (err) {
        return res.send({ msg: err, data: [], error: true });
      }
      return res.send({ msg: "Successful", data: result, error: false });
    });
  } else {
    PostSchema.updateOne(
      {
        postedBy: req.user._id,
      },
      { $push: { project_comments: newdata } },

      { new: true }
    ).exec((err, result) => {
      if (err) {
        return res.send({ msg: err, data: [], error: true });
      }
      return res.send({ msg: "Successful", data: result, error: false });
    });
  }
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

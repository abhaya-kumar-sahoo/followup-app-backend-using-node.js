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
    created_date: {
      year: parseInt(date.toString().slice(0, 4)),
      month: parseInt(date.toString().slice(4, 6)),
      day: parseInt(date.toString().slice(6, 8)),
    },
    created_time: {
      hr: parseInt(today.getHours()),
      min: parseInt(today.getMinutes()),
      sec: parseInt(today.getSeconds()),
    },
  };
  if (isUser.length === 0) {
    const data = new PostSchema({
      project_comments: [newdata],
      postedBy: req.user,
      project_id,
      created_date: {
        year: parseInt(date.toString().slice(0, 4)),
        month: parseInt(date.toString().slice(4, 6)),
        day: parseInt(date.toString().slice(6, 8)),
      },
      created_time: {
        hr: parseInt(today.getHours()),
        min: parseInt(today.getMinutes()),
        sec: parseInt(today.getSeconds()),
      },
    });

    await data.save((err, result) => {
      if (err) {
        return res.send({ msg: err, data: [], error: true });
      }
      return res.send({ msg: "Successful", data: result, error: false });
    });
  } else {
    PostSchema.findByIdAndUpdate(
      {
        _id: isUser[0]._id,
      },
      {
        $push: {
          project_comments: newdata,
        },
        $set: { created_date: date, created_time: time },
      },

      { new: true }
    )
      .populate("postedBy", "name _id")
      .exec((err, result) => {
        if (err) {
          return res.send({ msg: err, data: [], error: true });
        }
        return res.send({ msg: "Successful", data: result, error: false });
      });
  }
});

router.post("/get_posts", async (req, res) => {
  try {
    const { project_id, date } = req.body;

    if (!project_id) {
      return res.send({ msg: "'project_id' required", data: [], error: true });
    }

    await PostSchema.find(
      {
        $and: [
          { project_id },
          { "project_comments.created_date.year": date.year },
          { "project_comments.created_date.month": date.month },
          { "project_comments.created_date.day": date.day },
        ],
      }
      // { project_comments: { $elemMatch: { created_date: date } } }
    )
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

router.post("/update_comments", auth, async (req, res) => {
  try {
    const { comment_id, title, description, user_id } = req.body;

    if (!comment_id || !title || !user_id) {
      return res.send({
        msg: "Please check all the field *{comment_id, title, user_id}",
        data: [],
        error: true,
      });
    }
    let s = String(req.user._id).split('"');

    if (user_id !== s[0]) {
      return res.send({
        msg: "you can not update others comments",
        data: [],
        error: true,
      });
    }
    PostSchema.updateOne(
      {
        "project_comments._id": comment_id,
      },
      {
        $set: {
          "project_comments.$.description": description,
          "project_comments.$.title": title,
        },
      },

      { new: true }
    ).exec((err, result) => {
      if (err) {
        return res.send({ msg: err, data: [], error: true });
      }
      PostSchema.find({ postedBy: req.user._id })
        .populate("postedBy", "name _id")
        .exec((err, result) => {
          if (err) {
            return res.send({ msg: err, data: [], error: true });
          }
          return res.send({ msg: "Successful", data: result, error: false });
        });
    });
  } catch (error) {
    return res.send({ msg: error, error: true, data: [] });
  }
});

const Posts = router;
module.exports = Posts;

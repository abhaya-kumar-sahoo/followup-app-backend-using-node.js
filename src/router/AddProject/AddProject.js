const express = require("express");
const auth = require("../../middleware/authenticate");
const AddProjectSchema = require("../../schema/projectSchema");
const router = express.Router();

router.post("/add_project", auth, async (req, res) => {
  const { project_name, users } = req.body;

  if (!project_name || !users)
    res.send({ msg: "Project name or users have not added", error: true });

  // if (users.length === 0)
  //   res.send({ msg: "Please add at least one user", error: true });



  req.user.password = undefined;
  const today = new Date();
  var date = parseInt(
    new Date().toJSON().slice(0, 10).replace("-", "").replace("-", "")
  );
  var time = parseInt(`${today.getHours()}${today.getMinutes()}${today.getSeconds()}`);
  const newSchema = await new AddProjectSchema({
    users,
    project_name,
    created_date:date,
    created_time:time,
    postedBy: req.user,
  });

  await newSchema.save((err, result) => {
    if (err === null) return res.send({ result });
    return res.send({ error: true, errorText: err });
  });
});

router.put("/comments", auth, async (req, res) => {
  const { title, description, postId } = req.body;
  if (!title || title.length === 0)
    return res.send({ error: true, msg: "Please add any title" });

  const comment = {
    title,
    description,
    postedBy: req.user._id,
  };
  AddProjectSchema.findByIdAndUpdate(
    postId,
    {
      $push: {
        comments: comment,
      },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.json({ error: err });
      }
      return res.json(result);
    });
});

router.put("/add_member", auth, async (req, res) => {
  const { usersId, projectId } = req.body;
  const userIds = {
    postedBy: usersId,
  };
  AddProjectSchema.findByIdAndUpdate(
    projectId,
    { $push: { users:userIds } },
    { new: true }
  )
    .populate("users.postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.json({ error: err });
      }
      return res.json(result);
    });
});

const AddProject = router;

module.exports = AddProject;
const express = require("express");
const auth = require("../../middleware/authenticate");
const postSchema = require("../../schema/postSchema");
const router = express.Router();

router.post("/post", auth, async (req, res) => {
  const { title, description } = req.body;

  if (!title || title.length === 0)
    return res.send({ error: true, msg: "Please add any title" });
    req.user.password=undefined;
      const data = new postSchema({
    title,
    description,
    date: new Date().toUTCString(),
    postedBy: req.user
  });

  await data.save((err, result) => {
    return res.json({result });
  });
});

const Posts = router;
module.exports = Posts;

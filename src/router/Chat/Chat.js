const express = require("express");
const auth = require("../../middleware/authenticate");
const ChatSchema = require("../../schema/ChatSchema");
const router = express.Router();

router.post("/get_chat", auth, async (req, res) => {
  const { text, project_id } = req.body;

  const findOne = await ChatSchema.findOne({ project_id });
  return res.send({ msg: "Successful", data: findOne.chats });
});
router.post("/add_chat", auth, async (req, res) => {
  const { text, project_id } = req.body;
  const today = new Date();
  var date = parseInt(
    today.toJSON().slice(0, 10).replace("-", "").replace("-", "")
  );

  const currentDate = {
    day: parseInt(date.toString().slice(6, 8)),
    month: parseInt(date.toString().slice(4, 6)),
    year: parseInt(date.toString().slice(0, 4)),
  };
  const currentTime = {
    hr: parseInt(today.getHours()),
    min: parseInt(today.getMinutes()),
    sec: parseInt(today.getSeconds()),
  };
  const newChat = {
    text,
    created_date: currentDate,
    created_time: currentTime,
    postedBy: req.user._id,
  };
  const data = new ChatSchema({
    project_id,
    chats: newChat,
  });
  const findOne = await ChatSchema.findOne({ project_id });

  if (findOne) {
    ChatSchema.findOneAndUpdate(
      { project_id },
      { $push: { chats: newChat } },
      { new: true }
    )
      .select({ chats: 1 })
      .populate("chats.postedBy", "name _id image")
      .exec((err, result) => {
        return res.send({
          msg: "Successful",
          data: result.chats[result.chats.length - 1],
        });
      });
  } else {
    data.save(async (err, result) => {
      const r = await result.populate("chats.postedBy", "name _id image");
      return res.send({
        msg: "Successful",
        data: r.chats,
      });
    });
  }
});

const ChatRoute = router;
module.exports = ChatRoute;

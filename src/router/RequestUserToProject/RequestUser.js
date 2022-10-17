const express = require("express");
const router = express.Router();
const AddProjectSchema = require("../../schema/projectSchema");
const auth = require("../../middleware/authenticate");
const projectSchema = require("../../schema/RequestSchema");

router.post("/requests", auth, async (req, res) => {
  try {
    const data = await AddProjectSchema.find({
      users: { $elemMatch: { user: req.user._id, accepted: false } },
    }).populate("users.user", "name");
    const newSchema = await new AddProjectSchema({
      notification_data: data,
    });
    return res.send({ notifications: data, error: false });
    // newSchema.save().then(async (result, err) => {
    //   if (!err) {
    //     return res.send({
    //       notifications: result.notification_data,
    //       error: false,
    //     });
    //   }
    //   return res.send({ notifications: [], error: true });
    // });
  } catch (error) {
    return res.send({ error });
  }
});

router.put("/accept", auth, async (req, res) => {
  try {
    const { accept, id } = req.body;
    AddProjectSchema.updateOne(
      {
        "users._id": id,
      },
      { $set: { "users.$.accepted": accept } }
    ).exec((result, err) => {
      if (err) {
        return res.json({ error: err });
      }
      return res.json(result);
    });
  } catch (error) {
    res.send({ mas: "Something went wrong", error: true });
  }
});

const RequestUsers = router;

module.exports = RequestUsers;

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzRkMDMyODgwYWVmNmM1MTZkMjE1YzkiLCJpYXQiOjE2NjYwMTA5MTN9.T9fryujrvzMg7hJ4Qq3OYOcmelFalywVzT0QzYGgLG0

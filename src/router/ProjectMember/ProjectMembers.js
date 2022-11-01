const express = require("express");
const projectSchema = require("../../schema/projectSchema");
const router = express.Router();

router.post("/project_members", async (req, res) => {
  try {
    const { id } = req.body;
    const data = await projectSchema
      .findById(id)
      .populate("users.user", "_id name isAdmin image");
    res.send({ users: data.users });
  } catch (error) {
    res.send({ msg: "Something went wrong", data: [], error: true });
  }
});

const ProjectMembers = router;
module.exports = ProjectMembers;

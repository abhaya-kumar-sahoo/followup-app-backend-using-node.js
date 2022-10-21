const jwt = require("jsonwebtoken");
const User = require("../schema/schema");

const auth = async (req, res, next) => {
  try {
    const token = req.body.token;
    if (!token) return res.status(401).json({ error: "you must be logged in" });
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
      if (err) {
        return res.status(401).json({ error: "you must be logged in" });
      }
      const { _id } = payload;

      await User.findById(_id).then((userdata) => {
        req.user = userdata;
        req.user.password = undefined;
        req.user.selected = undefined;
        req.user.isAdmin = undefined;
        req.user.createdAt = undefined;
        req.user.updatedAt = undefined;
        req.user.__v = undefined;
        req.user.updatedAt = undefined;
        next();
      });
    });
  } catch (error) {
    console.log("authentication error", error);
  }
};
module.exports = auth;

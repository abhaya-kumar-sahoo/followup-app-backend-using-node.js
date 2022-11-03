const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
//https://followup-back.herokuapp.com
const User = require("../../schema/schema");
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/authenticate");

cloudinary.config({
  cloud_name: "duzs5orm9",
  api_key: "342391693671689",
  api_secret: "B3HgSe9CFw-G0On3qCPUUDV_BKY",
  secure: true,
});

router.post("/test", async (req, res) => {
  const url = req.protocol + "://" + req.get("host");
  const file = req.files?.image;
  if (file) {
    await cloudinary.uploader
      .upload(file.tempFilePath)
      .then((result) => console.log(result.secure_url))
      .catch((err) => {
        console.log("errors", err);
      });
  }

  return res.send({
    data: {
      name: req.body.name,
      image: file,
    },
    error: false,
  });
  // await data.save((err, result) => {
  //   if (err) {
  //     return res.send({ data: err, error: true });
  //   }
  //   return res.send({ data: result, error: false });
  // });
});

router.post("/registration", async (req, res) => {
  require("dotenv").config({ path: __dirname + "../../.env" });

  try {
    let url = null;
    const file = req.files?.image;
    if (file) {
      await cloudinary.uploader
        .upload(file.tempFilePath)
        .then((result) => {
          url = result.secure_url;
        })
        .catch((err) => {
          return res.send({
            msg: "Something went wrong in file upload",
            error: true,
          });
        });
    }
    const { name, password, cPassword } = req.body;

    if (!name || !password || !cPassword) {
      return res.send({
        msg: "Please fill all field",
        error: true,
      });
    }

    const user = await User.findOne({ name });
    if (user) {
      return res.send({ msg: "User Already Exist", error: true });
    }

    if (password.length < 6) {
      return res.send({
        msg: "Password length most be greater then 6",
        error: true,
      });
    }
    if (password !== cPassword) {
      return res.send({
        msg: "Password is not matching",
        error: true,
      });
    }
    const hashPsw = await bcrypt.hash(password, 10);

    const today = new Date();
    var date = parseInt(
      new Date().toJSON().slice(0, 10).replace("-", "").replace("-", "")
    );
    var time = parseInt(
      `${today.getHours()}${today.getMinutes()}${today.getSeconds()}`
    );

    const data = await new User({
      name,
      image: url,

      password: hashPsw,
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
      return res.send({ data: result, error: false });
    });
  } catch (error) {
    console.log(error);
    return res.send({ msg: "try again", error: true });
  }
});

router.post("/login", async (req, res) => {
  const { name, password } = req.body;
  let jwtSecretKey = process.env.JWT_SECRET_KEY;

  const data = await User.findOne({ name });
  if (!data) return res.send({ msg: "Invalid credential", error: true });

  const checkPsw = await bcrypt.compare(password, data.password);
  if (checkPsw) {
    const token = await jwt.sign({ _id: data._id }, jwtSecretKey);

    return res.send({ msg: "Login Successful", token, data, error: false });
  }
  return res.send({ msg: "Invalid credential", error: true });
});

router.post("/user_exist", async (req, res) => {
  try {
    const { name } = req.body;

    const data = await User.findOne({ name });
    if (data)
      return res.send({
        msg: "This username is taken, Try another",
        error: true,
      });
    return res.send({ msg: "Username available", error: false });
  } catch (error) {
    console.log("error", error);
    res.send({ msg: error, error: true });
  }
});

router.post("/all_members", auth, async (req, res) => {
  try {
    const { users, text } = req.body;
    const test = text.replace('"', "/");
    const data = await User.find({
      $and: [
        { _id: { $nin: users } },
        { name: { $regex: test, $options: "i" } },
      ],
    }).select({
      name: 1,
      selected: 1,
      isAdmin: 1,
      image: 1,
    });
    if (data)
      return res.send({
        msg: "Success",
        error: true,
        data,
      });
    return res.send({ msg: "Something went wrong", error: true, data: [] });
  } catch (error) {
    console.log("error", error);
    res.send({ msg: error, error: true });
  }
});

router.post("/all_users", auth, async (req, res) => {
  try {
    const { text } = req.body;
    const test = text.replace('"', "/");

    const data = await User.find({
      $and: [
        { _id: { $ne: req.user._id } },
        { name: { $regex: test, $options: "i" } },
      ],
    }).select({
      name: 1,
      selected: 1,
      isAdmin: 1,
      image: 1,
    });
    if (data)
      return res.send({
        msg: "Success",
        error: true,
        data,
      });
    return res.send({ msg: "Something went wrong", error: true, data: [] });
  } catch (error) {
    console.log("error", error);
    res.send({ msg: error, error: true });
  }
});

router.post("/get_user", auth, async (req, res) => {
  return res.send({
    msg: "Successful",
    data: req.user,
    error: false,
  });
});

const loginRoute = router;
module.exports = loginRoute;

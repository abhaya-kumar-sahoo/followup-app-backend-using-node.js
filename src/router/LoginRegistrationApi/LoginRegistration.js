const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const validator = require("email-validator");

const User = require("../../schema/schema");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const auth = require("../../middleware/authenticate");
const otp = Math.floor(Math.random() * 10000);
router.post("/registration", async (req, res) => {
  require("dotenv").config({ path: __dirname + "../../.env" });

  // var transporter = nodemailer.createTransport({
  //   service: "gmail",
  //   auth: {
  //     user: process.env.EMAIL_NAME,
  //     pass: process.env.EMAIL_PASS,
  //   },
  // });

  // var mailOptions = {
  //   from: "abhayasahoolk@gmail.com",
  //   to: "abhayasahooab1234@gmail.com",
  //   subject: "Follow Up App Email Verification",
  //   text: `This is the unique code that is required during registration process \n\n Verification code: ${otp} `,
  // };

  // transporter.sendMail(mailOptions, function (error, info) {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log("Email sent: " + info.response);
  //   }
  // });

  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  try {
    const { name, password, cPassword } = req.body;
    // const isEmail = await validator.validate(email);

    // if (!isEmail) return res.send({ msg: "Invalid email id" });

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

    const data = await new User({
      name,
      password: hashPsw,
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
    const { name, password } = req.body;

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
    const { users } = req.body;
    const data = await User.find({
      _id: { $nin: users },
    }).select({
      name: 1,
      selected: 1,
      isAdmin: 1,
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
    const data = await User.find({ _id: { $ne: req.user._id } }).select({
      name: 1,
      selected: 1,
      isAdmin: 1,
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

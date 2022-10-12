const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const validator = require("email-validator");

const User = require("../../schema/schema");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
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
    return res.send({ msg: error, error: true });
  }
});

router.post("/login", async (req, res) => {
  const { name, password } = req.body;
  let jwtSecretKey = process.env.JWT_SECRET_KEY;

  const data = await User.findOne({ name });
  if (!data)
    return res.send({ msg: "No user with this credential", error: true });

  const checkPsw = await bcrypt.compare(password, data.password);
  if (checkPsw) {
    const token = await jwt.sign({ _id: data._id }, jwtSecretKey);

    return res.send({ msg: "Login Successful", token, data, error: false });
  }
  return res.send({ msg: "Login credential are not matching", error: true });
});

const loginRoute = router;
module.exports = loginRoute;

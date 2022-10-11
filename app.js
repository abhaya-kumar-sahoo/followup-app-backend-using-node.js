const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const dotenv = require("dotenv");

const loginRoute=require('./src/router/LoginRegistrationApi/LoginRegistration');
const AddProject=require('./src/router/AddProject/AddProject');
const Reports = require("./src/router/Reports/Reports");
const Posts = require("./src/router/Post/Post");
const MyProjects = require("./src/router/MyProjects/MyProjects");

dotenv.config();

const PORT = process.env.PORT;
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

//Database Connection
require("./src/db/connections");

//Routes
app.use('',loginRoute)

app.use('',AddProject)

app.use('',MyProjects)

app.use('',Reports)

app.use('',Posts)


app.get("/", (req, res) => {
  return res.send({ msg: "Home Page of Followup App"});
});



app.listen(PORT, () => {
  console.log(`Server Started on Port ${PORT}`.bgMagenta.bold);
});

// const Vonage = require("@vonage/server-sdk");

// const vonage = new Vonage({
//   apiKey: "3cef59be",
//   apiSecret: "lqx5x4rEnk5t1WM8",
// });
// app.post("/request", (req, res) => {

//   vonage.verify.request(
//     {
//       number: +919348557381,
//       brand: "Memofac",
//     },
//     (err, result) => {
//       if (err) {
//         console.error(err);
//       } else {
//         const verifyRequestId = result.request_id;
//         console.log("request_id", verifyRequestId);
//         return res.send({ id: verifyRequestId });
//       }
//     }
//   );
// });

// app.post("/verify",async(req,res)=>{
//   const {CODE,REQUEST_ID,number}=req.body;
//   const data = await new User({
//     number
//   });
//   vonage.verify.check({
//     request_id: REQUEST_ID,
//     code: CODE
//   }, async(err, result) => {
//     if (err) {
//       console.error(err);
//     } else {
//       res.send({message:result})
//       await data.save((err, result) => {
//         return res.send({ msg: "Saved Data",Result:result })
//       })
//     }
//   });

// })

// app.post("/entry", async (req, res) => {
//   try {
//     const { id, activities } = req.body;
//     // const { entry, imp, like, date ,time} = activities;

//     if (!activities || !id) {
//       return res.status(400).send({ msg: "Please fill all the field" });
//     }

//     User.findByIdAndUpdate(
//       id,
//       {
//         activities,
//       },
//       (error, result) => {
//         if (error) {
//           console.log(error);
//         } else {
//           return res.status(201).json({ msg: "Data Stored Successful" });
//         }
//       }
//     );
//   } catch (error) {
//     console.log(error);
//   }
// });

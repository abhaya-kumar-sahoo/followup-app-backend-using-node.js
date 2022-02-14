const express = require("express");
const app = express();
const mongoose = require("mongoose");
var colors = require("colors");
const bodyParser = require("body-parser");
const Nexmo = require("nexmo");
const User = require("./schema/schema");
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

require("./db/connections");

const Vonage = require("@vonage/server-sdk");
const vonage = new Vonage({
  apiKey: "3cef59be",
  apiSecret: "lqx5x4rEnk5t1WM8",
});
app.get("/", (req, res) => {
  return res.send({ msg: "Home page", page: "page-1" });
});

// app.post("/login", async (req, res) => {
//   const { number } = req.body;
//   // const user=await User.findOne({number})
//   // if(user){
//   //   return res.send({error:"User Already Exist"})
//   // }
//   const data = await new User({
//     number,
//   });

//   await data.save((err, result) => {
//     return res.send({ id: result._id });
//   });
// });

app.post("/registration", async (req, res) => {
  try {
    const { name, dob, img, gender, number } = req.body;

    if (!name || !dob || !gender) {
      return res.send({ msg: "Please fill all field" });
    }
    if (!dob.length === 4) {
      return res.send({ msg: "Please put valid Date of birth" });
    }
    const data = await new User({
      name,
      dob,
      img,
      gender,
      number,
    });

    await data.save((err, result) => {
      return res.send({ id: result._id ,number:result.number});
    });

    // User.findByIdAndUpdate(
    //   id,
    //   {
    //     name,
    //     img,
    //     dob,
    //     gender,
    //   },
    //   (error, result) => {
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       return res.status(201).json({ msg: "Data Stored Successful" });
    //     }
    //   }
    // );
  } catch (error) {
    console.log(error);
  }
});

app.post("/entry", async (req, res) => {
  const { productId, date, time, entry, like, imp, number } = req.body;

  try {
    let cart = await User.findOne({ number });

    if (cart) {
      //cart exists for user
      let itemIndex = cart.activities.findIndex(
        (p) => p.productId == productId
      );

      if (itemIndex > -1) {
        //product exists in the cart, update the quantity
        let productItem = cart.activities[itemIndex];
        // productItem.quantity = quantity;
        cart.activities[itemIndex] = productItem;
      } else {
        //product does not exists in cart, add new item
        cart.activities.push({ productId, date, time, entry, like, imp });
      }
      cart = await cart.save();
      return res.status(201).send(cart.activities);
    } else {
      //no cart for user, create new cart
      const newCart = await User.create({
        userId,
        activities: [{ productId, date, time, entry, like, imp }],
      });

      return res.status(201).send(newCart.activities);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
});

app.listen(PORT, () => {
  console.log(`Server Started on Port ${PORT}`.bgMagenta.bold);
});

// app.post("/request", (req, res) => {
//   // We verify that the client has included the `number` property in their JSON body
//   if (!req.body.number) {
//     res.status(400).send({
//       message: "You must supply a `number` prop to send the request to",
//     });
//     return;
//   }
//   // Send the request to Vonage's servers
//   vonage.verify.request({
//     number: req.body.number,
//     brand: "Memofac",
//   }, (err, result) => {
//     if (err) {
//       console.error(err);
//     } else {
//       const verifyRequestId = result.request_id;
//       console.log('request_id', verifyRequestId);
//       return res.send({id:verifyRequestId})
//     }
//   });

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

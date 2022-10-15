const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const dotenv = require("dotenv");

const loginRoute = require("./src/router/LoginRegistrationApi/LoginRegistration");
const AddProject = require("./src/router/AddProject/AddProject");
const Reports = require("./src/router/Reports/Reports");
const Posts = require("./src/router/Post/Post");
const MyProjects = require("./src/router/MyProjects/MyProjects");
const ProjectMembers = require("./src/router/ProjectMemober/ProjectMemobers");

dotenv.config();

const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

//Database Connection
require("./src/db/connections");

//Routes
app.use("", loginRoute);

app.use("", AddProject);

app.use("", MyProjects);

app.use("", Reports);

app.use("", Posts);

app.use("", ProjectMembers);

app.get("/", (req, res) => {
  return res.send({ msg: "Home Page of Followup App" });
});

app.listen(PORT, () => {
  console.log(`Server Started on Port ${PORT}`.bgMagenta.bold);
});

require("dotenv").config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

connect_url = "mongodb://localhost:27017/secretsDB";

mongoose.connect(connect_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password),
  });
  newUser.save((err) => {
    if (err) console.log(err);
    else res.render("secrets");
  });
});

app.post("/login", (req, res) => {
  User.findOne({ email: req.body.username }, (err, foundUser) => {
    if (err) console.log(err);
    else {
      if (foundUser && foundUser.password === md5(req.body.password))
        res.render("secrets");
    }
  });
});

app.listen(3000, () => {
  console.log("Listening on port 3000 zzzzZZZZZZZZ 🤓");
});

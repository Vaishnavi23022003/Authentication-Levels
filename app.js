require("dotenv").config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const saltRounds = 10;

app.set("view engine", "ejs");
mongoose.set("useCreateIndex", true);

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    secret: "our little secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());

app.use(passport.session());

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

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/secrets", (req, res) => {
  if (req.isAuthenticated()) res.render("secrets");
  else res.redirect("login");
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.post("/register", (req, res) => {
  User.register(
    { username: req.body.username },
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, () => {
          res.redirect("/secrets");
        });
      }
    }
  );
});

app.post("/login", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, (err) => {
    if (err) console.log(err);
    else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/secrets");
      });
    }
  });
});

app.listen(3000, () => {
  console.log("Listening on port 3000 zzzzZZZZZZZZ 🤓");
});

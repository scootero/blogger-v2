const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const passport = require("passport");
const localStrategy = require("passport-local");

const articlesRoute = require("./routes/articles");
const authRoute = require("./routes/auth");
const User = require("./models/user");

dotenv.config();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false })); // can i use this instead of that ^ ???
// app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
const sessionConfig = {
  secret: "secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/public", express.static("public"));
app.set("view engine", "ejs");
app.use((req, res, next) => {
  // console.log(req.session);
  res.locals.user = req.user;
  // console.log(res.locals.user);
  next();
});

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Connected to mongoose"))
  .catch((err) => {
    console.log("Mongoose error:", err);
  });

app.use("/", articlesRoute);
app.use("/auth", authRoute);

const PORT = 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const sequelize = require("./config/db");
const session = require("express-session");
const passport = require("./config/passport");
var authRouter = require("./routes/auth.routes");
var studentRouter = require("./routes/student.routes");
var issueRouter = require("./routes/issue.routes");

// Import models
require("./models/user.model");
require("./models/book.model");
require("./models/student.model");
require("./models/issuedBook.model");

var indexRouter = require("./routes/index");
var bookRouter = require("./routes/book.routes");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // to parse the incoming form data
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  // makes user available in all views automatically without passing it manually from every controller.
  res.locals.user = req.user || null;
  next();
});

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/books", bookRouter);
app.use("/students", studentRouter);
app.use("/issues", issueRouter);

// Sync database
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database synced successfully");
  })
  .catch((err) => {
    console.error("Database sync failed:", err.message);
  });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

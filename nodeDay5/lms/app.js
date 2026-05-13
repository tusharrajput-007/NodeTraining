var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const sequelize = require("./config/db");

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
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/books", bookRouter);

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

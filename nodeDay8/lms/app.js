require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
const sequelize = require("./config/db");
const session = require("express-session");
const passport = require("./config/passport");
var authRouter = require("./routes/auth.routes");
var studentRouter = require("./routes/student.routes");
var issueRouter = require("./routes/issue.routes");
const expressLayouts = require("express-ejs-layouts");
var logger = require("morgan");
const appLogger = require("./config/logger");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp"); // HTTP Parameter Pollution prevention

// Handle uncaught exceptions gracefully
process.on("uncaughtException", (err) => {
  appLogger.error("Uncaught Exception: " + err.message);
  process.exit(1); // exit to avoid unknown state
});

// Import models
require("./models/user.model");
require("./models/book.model");
require("./models/student.model");
require("./models/issuedBook.model");

var indexRouter = require("./routes/index");
var bookRouter = require("./routes/book.routes");

var app = express();

// Security headers - protects against XSS, clickjacking, MIME sniffing etc.
app.use(
  helmet({
    contentSecurityPolicy: false, // disabled because DataTables uses eval()
  }),
);

// Prevent HTTP Parameter Pollution - stops duplicate query params attack
app.use(hpp());

// Rate limiter for login route - max 5 attempts per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts. Please try again after 15 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layout");

app.use(
  logger("dev", {
    skip: (req) => req.url.startsWith("/assets"),
  }),
);
appLogger.info("Server started successfully");

// Request size limits - prevents large payload attacks
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));

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
  res.locals.user = req.user || null;
  next();
});

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/books", bookRouter);
app.use("/students", studentRouter);
app.use("/issues", issueRouter);

// Apply rate limiter to login route
app.use("/login", loginLimiter);

// Sync database
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database synced successfully");
  })
  .catch((err) => {
    console.error("Database sync failed:", err.message);
  });

// 404 handler
app.use((req, res, next) => {
  res.status(404).render("error", {
    status: 404,
    message: "Page not found",
    layout: false,
  });
});

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).render("error", {
    status: err.status || 500,
    message: err.message || "Something went wrong",
    layout: false,
  });
});

module.exports = app;

const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const logger = require("../config/logger");

const getLoginPage = (req, res) => {
  res.render("login", { error: null, layout: false });
};

const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      logger.warn("Failed login attempt - user not found: " + email);
      return res.render("login", {
        error: "Invalid email or password",
        layout: false,
      });
    }

    if (user.password === "google-auth") {
      logger.warn(
        "Failed login attempt - Google auth user tried normal login: " + email,
      );
      return res.render("login", {
        error: "This account uses Google login. Please use the Google button.",
        layout: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn("Failed login attempt - wrong password: " + email);
      return res.render("login", {
        error: "Invalid email or password",
        layout: false,
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    logger.info("User logged in successfully: " + email);
    res.redirect("/books");
  } catch (err) {
    logger.error("Login error: " + err.message);
    res.render("login", { error: "Something went wrong", layout: false });
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  logger.info("User logged out: " + (req.user ? req.user.email : "unknown"));
  res.redirect("/login");
};

module.exports = { getLoginPage, postLogin, logout };

const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const getLoginPage = (req, res) => {
  res.render("login", { error: null, layout: false });
};

const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.render("login", {
        error: "Invalid email or password",
        layout: false,
      });
    }

    // Check if user is a Google OAuth user
    if (user.password === "google-auth") {
      return res.render("login", {
        error: "This account uses Google login. Please use the Google button.",
        layout: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("login", {
        error: "Invalid email or password",
        layout: false,
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
      // { expiresIn: "1m" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      // maxAge: 60 * 1000,
    });

    res.redirect("/books");
  } catch (err) {
    console.error(err);
    res.render("login", { error: "Something went wrong", layout: false });
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
};

module.exports = { getLoginPage, postLogin, logout };

var express = require("express");
var router = express.Router();
var passport = require("../config/passport");
var jwt = require("jsonwebtoken");

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // JWT token for Google user
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email },
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
  },
);

module.exports = router;

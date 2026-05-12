const User = require("../models/user.model");

const getLoginPage = (req, res) => {
  res.render("login", { error: null });
};

const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.render("login", { error: "Invalid email or password" });
    }

    if (user.password !== password) {
      return res.render("login", { error: "Invalid email or password" });
    }

    res.redirect("/books");
  } catch (err) {
    console.error(err);
    res.render("login", { error: "Something went wrong" });
  }
};

module.exports = { getLoginPage, postLogin };

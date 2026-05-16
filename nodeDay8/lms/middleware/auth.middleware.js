const jwt = require("jsonwebtoken");
const logger = require("../config/logger");

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    logger.warn(
      "Unauthorized access attempt - no token - URL: " + req.originalUrl,
    );
    return res.redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    logger.warn(
      "Invalid or expired token - URL: " +
        req.originalUrl +
        " Error: " +
        err.message,
    );
    return res.redirect("/login");
  }
};

module.exports = verifyToken;

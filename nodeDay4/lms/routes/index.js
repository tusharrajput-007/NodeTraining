var express = require("express");
var router = express.Router();
var authController = require("../controllers/auth.controller");

router.get("/", authController.getLoginPage);
router.get("/login", authController.getLoginPage);
router.post("/login", authController.postLogin);

module.exports = router;

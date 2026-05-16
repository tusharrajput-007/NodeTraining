var express = require("express");
var router = express.Router();
var studentController = require("../controllers/student.controller");
var verifyToken = require("../middleware/auth.middleware");

router.get("/", verifyToken, studentController.getAllStudents);
router.get("/add", verifyToken, studentController.getAddStudent);
router.post("/add", verifyToken, studentController.postAddStudent);
router.get("/delete/:id", verifyToken, studentController.deleteStudent);

module.exports = router;

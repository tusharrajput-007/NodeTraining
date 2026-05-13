var express = require("express");
var router = express.Router();
var studentController = require("../controllers/student.controller");

router.get("/", studentController.getAllStudents);
router.get("/add", studentController.getAddStudent);
router.post("/add", studentController.postAddStudent);
router.get("/delete/:id", studentController.deleteStudent);

module.exports = router;

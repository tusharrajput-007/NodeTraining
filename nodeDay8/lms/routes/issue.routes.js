var express = require("express");
var router = express.Router();
var issueController = require("../controllers/issue.controller");
var verifyToken = require("../middleware/auth.middleware");

router.get("/", verifyToken, issueController.getAllIssues);
router.get("/add", verifyToken, issueController.getIssueBook);
router.post("/add", verifyToken, issueController.postIssueBook);
router.get("/return/:id", verifyToken, issueController.returnBook);

module.exports = router;

var express = require("express");
var router = express.Router();
var issueController = require("../controllers/issue.controller");

router.get("/", issueController.getAllIssues);
router.get("/add", issueController.getIssueBook);
router.post("/add", issueController.postIssueBook);
router.get("/return/:id", issueController.returnBook);

module.exports = router;

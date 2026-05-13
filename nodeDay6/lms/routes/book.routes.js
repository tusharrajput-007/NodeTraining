var express = require("express");
var router = express.Router();
var bookController = require("../controllers/book.controller");

router.get("/", bookController.getAllBooks);
router.get("/add", bookController.getAddBook);
router.post("/add", bookController.postAddBook);
router.get("/edit/:id", bookController.getEditBook);
router.post("/edit/:id", bookController.postEditBook);
router.get("/delete/:id", bookController.deleteBook);

module.exports = router;

var express = require("express");
var router = express.Router();
var bookController = require("../controllers/book.controller");
var upload = require("../config/multer");

router.get("/", bookController.getAllBooks);
router.get("/add", bookController.getAddBook);
router.post("/add", upload.single("file"), bookController.postAddBook);
router.get("/edit/:id", bookController.getEditBook);
router.post("/edit/:id", upload.single("file"), bookController.postEditBook);
router.get("/delete/:id", bookController.deleteBook);
router.get("/download/:id", bookController.downloadBookImage);

module.exports = router;

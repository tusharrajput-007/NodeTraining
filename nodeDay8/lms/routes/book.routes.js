var express = require("express");
var router = express.Router();
var bookController = require("../controllers/book.controller");
var upload = require("../config/multer");
var verifyToken = require("../middleware/auth.middleware");

router.get("/", verifyToken, bookController.getAllBooks);
router.get("/add", verifyToken, bookController.getAddBook);
router.post(
  "/add",
  verifyToken,
  upload.single("file"),
  bookController.postAddBook,
);
router.get("/edit/:id", verifyToken, bookController.getEditBook);
router.post(
  "/edit/:id",
  verifyToken,
  upload.single("file"),
  bookController.postEditBook,
);
router.get("/delete/:id", verifyToken, bookController.deleteBook);
router.get("/download/:id", verifyToken, bookController.downloadBookImage);

module.exports = router;

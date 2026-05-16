var express = require("express");
var router = express.Router();
var bookController = require("../controllers/book.controller");
var upload = require("../config/multer");
var verifyToken = require("../middleware/auth.middleware");

// Multer error handler middleware
const handleMulterError = (err, req, res, next) => {
  if (err && err.code === "LIMIT_FILE_SIZE") {
    return res.json({
      success: false,
      message: "File size must be less than 2MB",
    });
  }
  if (err && err.code === "LIMIT_UNEXPECTED_FILE") {
    return res.json({ success: false, message: "Unexpected file upload" });
  }
  next(err);
};

router.get("/", verifyToken, bookController.getAllBooks);
router.get("/add", verifyToken, bookController.getAddBook);
router.post(
  "/add",
  verifyToken,
  (req, res, next) => {
    res.locals.layout = false;
    next();
  },
  upload.single("file"),
  handleMulterError,
  bookController.postAddBook,
);
router.get("/edit/:id", verifyToken, bookController.getEditBook);
router.post(
  "/edit/:id",
  verifyToken,
  (req, res, next) => {
    res.locals.layout = false;
    next();
  },
  upload.single("file"),
  handleMulterError,
  bookController.postEditBook,
);
router.get("/delete/:id", verifyToken, bookController.deleteBook);
router.get("/download/:id", verifyToken, bookController.downloadBookImage);

module.exports = router;

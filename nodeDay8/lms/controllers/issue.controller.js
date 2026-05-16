const IssuedBook = require("../models/issuedBook.model");
const Book = require("../models/book.model");
const Student = require("../models/student.model");
const logger = require("../config/logger");

// GET /issues
const getAllIssues = async (req, res) => {
  try {
    const issues = await IssuedBook.findAll({
      include: [Book, Student],
    });
    const success = req.query.success || null;
    res.render("issue-list", { issues, success });
  } catch (err) {
    logger.error("Error fetching issues: " + err.message);
    res.status(500).send("Something went wrong");
  }
};

// GET /issues/add
const getIssueBook = async (req, res) => {
  try {
    const books = await Book.findAll({ where: { is_deleted: false } });
    const students = await Student.findAll();
    res.render("issue-book", { books, students, error: null });
  } catch (err) {
    logger.error("Error fetching issue book form data: " + err.message);
    res.redirect("/issues");
  }
};

// POST /issues/add
const postIssueBook = async (req, res) => {
  try {
    const { book_id, student_id } = req.body;

    // Server side validation
    if (!book_id || book_id === "") {
      return res.json({ success: false, message: "Please select a book" });
    }
    if (!student_id || student_id === "") {
      return res.json({ success: false, message: "Please select a student" });
    }

    // Check if book is already issued
    const existing = await IssuedBook.findOne({
      where: { book_id, status: "issued" },
    });

    if (existing) {
      logger.warn("Book already issued - book_id: " + book_id);
      return res.json({ success: false, message: "Book is already issued" });
    }

    await IssuedBook.create({ book_id, student_id });
    logger.info(
      "Book issued - book_id: " + book_id + " student_id: " + student_id,
    );
    res.json({ success: true, message: "Book issued successfully" });
  } catch (err) {
    logger.error("Error issuing book: " + err.message);
    res.json({ success: false, message: "Something went wrong" });
  }
};

// GET /issues/return/:id
const returnBook = async (req, res) => {
  try {
    await IssuedBook.update(
      { status: "returned", return_date: new Date() },
      { where: { id: req.params.id } },
    );
    logger.info("Book returned - issue_id: " + req.params.id);
    res.redirect("/issues?success=Book returned successfully");
  } catch (err) {
    logger.error("Error returning book: " + err.message);
    res.redirect("/issues");
  }
};

module.exports = { getAllIssues, getIssueBook, postIssueBook, returnBook };

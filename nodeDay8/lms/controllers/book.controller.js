const Book = require("../models/book.model");
const upload = require("../config/multer");
const path = require("path");
const transporter = require("../config/mailer");
const logger = require("../config/logger");

// GET /books
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll({ where: { is_deleted: false } });
    const success = req.query.success || null;
    res.render("book-list", { books, success });
  } catch (err) {
    logger.error("Error fetching books: " + err.message);
    res.status(500).send("Something went wrong");
  }
};

// GET /books/add
const getAddBook = (req, res) => {
  res.render("add-book", { error: null });
};

// POST /books/add
const postAddBook = async (req, res) => {
  try {
    console.log(req.body);
    const { book_name, author_name, isbn } = req.body;
    const file = req.file ? req.file.filename : null;

    // Server side validation
    if (!book_name || book_name.trim() === "") {
      return res.json({ success: false, message: "Book name is required" });
    }
    if (!author_name || author_name.trim() === "") {
      return res.json({ success: false, message: "Author name is required" });
    }
    if (!isbn || isbn.trim() === "") {
      return res.json({ success: false, message: "ISBN is required" });
    }

    // Check duplicate ISBN
    const existing = await Book.findOne({ where: { isbn } });
    if (existing) {
      logger.warn("Duplicate ISBN attempt: " + isbn);
      return res.json({ success: false, message: "ISBN already exists" });
    }

    await Book.create({
      book_name: book_name.trim(),
      author_name: author_name.trim(),
      isbn: isbn.trim(),
      file,
    });
    logger.info("Book added: " + book_name + " ISBN: " + isbn);

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: "New Book Added - " + book_name,
      html: `
        <h2>New Book Added</h2>
        <p><strong>Book Name:</strong> ${book_name}</p>
        <p><strong>Author Name:</strong> ${author_name}</p>
        <p><strong>ISBN:</strong> ${isbn}</p>
      `,
      attachments: file
        ? [
            {
              filename: file,
              path: path.join(__dirname, "../public/uploads/", file),
            },
          ]
        : [],
    };

    await transporter.sendMail(mailOptions);
    logger.info("Email sent for book: " + book_name);

    res.json({ success: true, message: "Book added successfully" });
  } catch (err) {
    logger.error("Error adding book: " + err.message);
    res.json({ success: false, message: "Something went wrong" });
  }
};

// GET /books/edit/:id
const getEditBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.redirect("/books");
    res.render("edit-book", { book, error: null });
  } catch (err) {
    logger.error("Error fetching book for edit: " + err.message);
    res.redirect("/books");
  }
};

// POST /books/edit/:id
const postEditBook = async (req, res) => {
  try {
    const { book_name, author_name, isbn } = req.body;
    const { id } = req.params;
    const file = req.file ? req.file.filename : null;

    // Server side validation
    if (!book_name || book_name.trim() === "") {
      return res.json({ success: false, message: "Book name is required" });
    }
    if (!author_name || author_name.trim() === "") {
      return res.json({ success: false, message: "Author name is required" });
    }
    if (!isbn || isbn.trim() === "") {
      return res.json({ success: false, message: "ISBN is required" });
    }

    // Check duplicate ISBN excluding current book
    const existing = await Book.findOne({ where: { isbn } });
    if (existing && existing.id != id) {
      logger.warn("Duplicate ISBN on edit attempt: " + isbn);
      return res.json({ success: false, message: "ISBN already exists" });
    }

    const updateData = {
      book_name: book_name.trim(),
      author_name: author_name.trim(),
      isbn: isbn.trim(),
    };
    if (file) updateData.file = file;

    await Book.update(updateData, { where: { id } });
    logger.info("Book updated: " + book_name + " ID: " + id);

    res.json({ success: true, message: "Book updated successfully" });
  } catch (err) {
    logger.error("Error updating book: " + err.message);
    res.json({ success: false, message: "Something went wrong" });
  }
};

// GET /books/delete/:id
const deleteBook = async (req, res) => {
  try {
    await Book.update(
      { is_deleted: true, deleted_at: new Date() },
      { where: { id: req.params.id } },
    );
    logger.info("Book soft deleted: ID " + req.params.id);
    res.redirect("/books?success=Book deleted successfully");
  } catch (err) {
    logger.error("Error deleting book: " + err.message);
    res.redirect("/books");
  }
};

// GET /books/download/:id
const downloadBookImage = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book || !book.file) {
      return res.redirect("/books");
    }
    const filePath = path.join(__dirname, "../public/uploads/", book.file);
    logger.info("Book image downloaded: " + book.file);
    res.download(filePath);
  } catch (err) {
    logger.error("Error downloading book image: " + err.message);
    res.redirect("/books");
  }
};

module.exports = {
  getAllBooks,
  getAddBook,
  postAddBook,
  getEditBook,
  postEditBook,
  deleteBook,
  downloadBookImage,
};

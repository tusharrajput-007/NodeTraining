const Book = require("../models/book.model");
const upload = require("../config/multer");
const path = require("path");
const transporter = require("../config/mailer");

// GET /books
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.render("book-list", { books });
  } catch (err) {
    console.error(err);
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
    const { book_name, author_name, isbn } = req.body;
    const file = req.file ? req.file.filename : null;

    // Check duplicate ISBN
    const existing = await Book.findOne({ where: { isbn } });
    if (existing) {
      return res.json({ success: false, message: "ISBN already exists" });
    }

    await Book.create({ book_name, author_name, isbn, file });

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

    res.json({ success: true, message: "Book added successfully" });
  } catch (err) {
    console.error(err);
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
    console.error(err);
    res.redirect("/books");
  }
};

// POST /books/edit/:id
const postEditBook = async (req, res) => {
  try {
    const { book_name, author_name, isbn } = req.body;
    const { id } = req.params;
    const file = req.file ? req.file.filename : null;

    // Check duplicate ISBN excluding current book
    const existing = await Book.findOne({ where: { isbn } });
    if (existing && existing.id != id) {
      return res.json({ success: false, message: "ISBN already exists" });
    }

    // Only update file if new one uploaded
    const updateData = { book_name, author_name, isbn };
    if (file) updateData.file = file;

    await Book.update(updateData, { where: { id } });
    res.json({ success: true, message: "Book updated successfully" });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Something went wrong" });
  }
};

// GET /books/delete/:id
const deleteBook = async (req, res) => {
  try {
    // Check if book is currently issued
    const issued = await IssuedBook.findOne({
      where: { book_id: req.params.id, status: "issued" },
    });

    if (issued) {
      return res.redirect("/books?error=Book is currently issued");
    }

    await Book.destroy({ where: { id: req.params.id } });
    res.redirect("/books");
  } catch (err) {
    console.error(err);
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
    res.download(filePath);
  } catch (err) {
    console.error(err);
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

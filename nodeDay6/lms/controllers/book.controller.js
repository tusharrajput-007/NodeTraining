const Book = require("../models/book.model");

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

    // Check duplicate ISBN
    const existing = await Book.findOne({ where: { isbn } });
    if (existing) {
      return res.render("add-book", { error: "ISBN already exists" });
    }

    await Book.create({ book_name, author_name, isbn });
    res.redirect("/books");
  } catch (err) {
    console.error(err);
    res.render("add-book", { error: "Something went wrong" });
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

    // Checking duplicate ISBN excluding current book
    const existing = await Book.findOne({ where: { isbn } });
    if (existing && existing.id != id) {
      const book = await Book.findByPk(id);
      return res.render("edit-book", { book, error: "ISBN already exists" });
    }

    await Book.update({ book_name, author_name, isbn }, { where: { id } });
    res.redirect("/books");
  } catch (err) {
    console.error(err);
    res.redirect("/books");
  }
};

// GET /books/delete/:id
const deleteBook = async (req, res) => {
  try {
    await Book.destroy({ where: { id: req.params.id } });
    res.redirect("/books");
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
};

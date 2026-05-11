const books = require("../models/book.model");

const getAllBooks = (req, res) => {
  res.json(books);
};

const getOneBook = (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find((b) => b.BookId === id);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  res.json(book);
};

const createBook = (req, res) => {
  const newBook = {
    BookId: books.length + 1,
    BookName: req.body.BookName,
    Author: req.body.Author,
    Price: req.body.Price,
    Pages: req.body.Pages,
  };
  books.push(newBook);
  res.status(201).json(newBook);
};

const updateBook = (req, res) => {
  const id = parseInt(req.params.id);
  const index = books.findIndex((b) => b.BookId === id);
  if (index === -1) {
    return res.status(404).json({ message: "Book not found" });
  }
  books[index] = { ...books[index], ...req.body };
  res.json(books[index]);
};

const deleteBook = (req, res) => {
  const id = parseInt(req.params.id);
  const index = books.findIndex((b) => b.BookId === id);
  if (index === -1) {
    return res.status(404).json({ message: "Book not found" });
  }
  const deleted = books.splice(index, 1);
  res.json({ message: "Book deleted", book: deleted[0] });
};

module.exports = {
  getAllBooks,
  getOneBook,
  createBook,
  updateBook,
  deleteBook,
};

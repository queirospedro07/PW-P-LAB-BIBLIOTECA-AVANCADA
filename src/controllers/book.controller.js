const bookService = require("../services/book.service");

const getAllBooks = async (req, res, next) => {
  try { res.status(200).json(await bookService.getAllBooks(req.query)); } catch (e) { next(e); }
};

const getBookById = async (req, res, next) => {
  try { res.status(200).json(await bookService.getBookById(req.params.id)); } catch (e) { next(e); }
};

const createBook = async (req, res, next) => {
  try { res.status(201).json(await bookService.createBook(req.body)); } catch (e) { next(e); }
};

const updateBook = async (req, res, next) => {
  try { res.status(200).json(await bookService.updateBook(req.params.id, req.body)); } catch (e) { next(e); }
};

const deleteBook = async (req, res, next) => {
  try { await bookService.deleteBook(req.params.id); res.status(204).send(); } catch (e) { next(e); }
};

const searchBooksByTitle = async (req, res, next) => {
  try {
    const { title } = req.query;
    if (!title) return res.status(400).json({ message: "O parâmetro 'title' é obrigatório" });
    res.status(200).json(await bookService.searchBooksByTitle(title));
  } catch (e) { next(e); }
};

module.exports = { getAllBooks, getBookById, createBook, updateBook, deleteBook, searchBooksByTitle };

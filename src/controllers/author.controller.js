const authorService = require("../services/author.service");

const getAllAuthors = async (req, res, next) => {
  try { res.status(200).json(await authorService.getAllAuthors()); } catch (e) { next(e); }
};

const getAuthorById = async (req, res, next) => {
  try { res.status(200).json(await authorService.getAuthorById(req.params.id)); } catch (e) { next(e); }
};

const createAuthor = async (req, res, next) => {
  try { res.status(201).json(await authorService.createAuthor(req.body)); } catch (e) { next(e); }
};

const updateAuthor = async (req, res, next) => {
  try { res.status(200).json(await authorService.updateAuthor(req.params.id, req.body)); } catch (e) { next(e); }
};

const deleteAuthor = async (req, res, next) => {
  try { await authorService.deleteAuthor(req.params.id); res.status(204).send(); } catch (e) { next(e); }
};

const getBooksByAuthorId = async (req, res, next) => {
  try { res.status(200).json(await authorService.getBooksByAuthorId(req.params.id)); } catch (e) { next(e); }
};

const getTopAuthors = async (req, res, next) => {
  try { res.status(200).json(await authorService.getTopAuthors()); } catch (e) { next(e); }
};

module.exports = { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor, getBooksByAuthorId, getTopAuthors };

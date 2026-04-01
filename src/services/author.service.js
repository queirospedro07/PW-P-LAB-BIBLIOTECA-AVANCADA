const prisma = require("../prisma/prismaClient");

const getAllAuthors = async () =>
  prisma.author.findMany({ orderBy: { name: "asc" } });

const getAuthorById = async (id) => {
  const author = await prisma.author.findUnique({ where: { id }, include: { books: true } });
  if (!author) { const e = new Error("Autor não encontrado"); e.statusCode = 404; throw e; }
  return author;
};

const createAuthor = async (data) => {
  const { name, nationality, birthYear } = data;
  if (!name) { const e = new Error("O campo 'name' é obrigatório"); e.statusCode = 400; throw e; }
  return prisma.author.create({ data: { name, nationality, birthYear } });
};

const updateAuthor = async (id, data) => {
  const { name, nationality, birthYear } = data;
  const existing = await prisma.author.findUnique({ where: { id } });
  if (!existing) { const e = new Error("Autor não encontrado"); e.statusCode = 404; throw e; }
  if (!name) { const e = new Error("O campo 'name' é obrigatório"); e.statusCode = 400; throw e; }
  return prisma.author.update({ where: { id }, data: { name, nationality, birthYear } });
};

const deleteAuthor = async (id) => {
  const existing = await prisma.author.findUnique({ where: { id }, include: { books: true } });
  if (!existing) { const e = new Error("Autor não encontrado"); e.statusCode = 404; throw e; }
  if (existing.books.length > 0) { const e = new Error("Não é possível apagar um autor com livros associados"); e.statusCode = 409; throw e; }
  await prisma.author.delete({ where: { id } });
};

const getBooksByAuthorId = async (id) => {
  const author = await prisma.author.findUnique({ where: { id } });
  if (!author) { const e = new Error("Autor não encontrado"); e.statusCode = 404; throw e; }
  return prisma.book.findMany({ where: { authorId: id }, orderBy: { title: "asc" } });
};

const getTopAuthors = async () => {
  const authors = await prisma.author.findMany({ include: { books: true } });
  return authors
    .map((a) => ({ id: a.id, name: a.name, totalBooks: a.books.length }))
    .sort((a, b) => b.totalBooks - a.totalBooks);
};

module.exports = { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor, getBooksByAuthorId, getTopAuthors };

const prisma = require("../prisma/prismaClient");

const getAllBooks = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const allowedSort = ["title", "year"];
  const orderBy = allowedSort.includes(query.sort) ? { [query.sort]: "asc" } : { title: "asc" };
  const skip = (page - 1) * limit;

  const [books, total] = await Promise.all([
    prisma.book.findMany({ skip, take: limit, orderBy, include: { author: true } }),
    prisma.book.count(),
  ]);

  return { page, limit, total, totalPages: Math.ceil(total / limit), data: books };
};

const getBookById = async (id) => {
  const book = await prisma.book.findUnique({ where: { id }, include: { author: true } });
  if (!book) { const e = new Error("Livro não encontrado"); e.statusCode = 404; throw e; }
  return book;
};

const createBook = async (data) => {
  const { title, year, genre, available, authorId } = data;
  if (!title || !year || !genre || !authorId) { const e = new Error("Campos obrigatórios em falta"); e.statusCode = 400; throw e; }
  if (isNaN(year)) { const e = new Error("O campo 'year' deve ser numérico"); e.statusCode = 400; throw e; }
  const author = await prisma.author.findUnique({ where: { id: authorId } });
  if (!author) { const e = new Error("O autor indicado não existe"); e.statusCode = 400; throw e; }
  return prisma.book.create({ data: { title, year: Number(year), genre, available: available ?? true, authorId }, include: { author: true } });
};

const updateBook = async (id, data) => {
  const { title, year, genre, available, authorId } = data;
  const existing = await prisma.book.findUnique({ where: { id } });
  if (!existing) { const e = new Error("Livro não encontrado"); e.statusCode = 404; throw e; }
  if (!title || !year || !genre || !authorId) { const e = new Error("Campos obrigatórios em falta"); e.statusCode = 400; throw e; }
  if (isNaN(year)) { const e = new Error("O campo 'year' deve ser numérico"); e.statusCode = 400; throw e; }
  const author = await prisma.author.findUnique({ where: { id: authorId } });
  if (!author) { const e = new Error("O autor indicado não existe"); e.statusCode = 400; throw e; }
  return prisma.book.update({ where: { id }, data: { title, year: Number(year), genre, available, authorId }, include: { author: true } });
};

const deleteBook = async (id) => {
  const existing = await prisma.book.findUnique({ where: { id } });
  if (!existing) { const e = new Error("Livro não encontrado"); e.statusCode = 404; throw e; }
  await prisma.book.delete({ where: { id } });
};

const searchBooksByTitle = async (title) =>
  prisma.book.findMany({
    where: { title: { contains: title, mode: "insensitive" } },
    include: { author: true },
    orderBy: { title: "asc" },
  });

module.exports = { getAllBooks, getBookById, createBook, updateBook, deleteBook, searchBooksByTitle };

const prisma = require("../prisma/prismaClient");

const getStats = async () => {
  const [totalBooks, totalAuthors, availableBooks, borrowedBooks] = await Promise.all([
    prisma.book.count(),
    prisma.author.count(),
    prisma.book.count({ where: { available: true } }),
    prisma.book.count({ where: { available: false } }),
  ]);
  return { totalBooks, totalAuthors, availableBooks, borrowedBooks };
};

const getGenresStats = async () => {
  const books = await prisma.book.findMany();
  return books.reduce((acc, book) => {
    acc[book.genre] = (acc[book.genre] || 0) + 1;
    return acc;
  }, {});
};

module.exports = { getStats, getGenresStats };

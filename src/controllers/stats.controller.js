const statsService = require("../services/stats.service");

const getStats = async (req, res, next) => {
  try { res.status(200).json(await statsService.getStats()); } catch (e) { next(e); }
};

const getGenresStats = async (req, res, next) => {
  try { res.status(200).json(await statsService.getGenresStats()); } catch (e) { next(e); }
};

module.exports = { getStats, getGenresStats };

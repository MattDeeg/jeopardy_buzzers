const { join } = require("path");

const GAMES_PATH = join(__dirname, "..", "functions", "data", "games");
const CATEGORIES_PATH = join(__dirname, "..", "functions", "data", "categories");
const CATEGORIES_MAP = join(__dirname, "..", "functions", "data", "categories.json");

module.exports = {
  GAMES_PATH,
  CATEGORIES_PATH,
  CATEGORIES_MAP,
};

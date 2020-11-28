const { writeFile, readdir, readFile } = require("fs");
const { promisify } = require("util");
const { join } = require("path");
const slug = require("unique-slug");
const { getDebouncer } = require("./debouncer");
const { GAMES_PATH, CATEGORIES_PATH, CATEGORIES_MAP } = require("./paths");

const writeFileP = promisify(writeFile);
const readFilep = promisify(readFile);
const readdirp = promisify(readdir);
const debouncer = getDebouncer(30);

const processGameData = async () => {
  const files = (await readdirp(GAMES_PATH)).filter((f) => f.endsWith(".json"));
  const categoryMap = new Map();
  await files.reduce(
    (acc, file) => acc.then(() => processFile(file, categoryMap)),
    Promise.resolve()
  );

  const categories = Array.from(categoryMap.values())
    .map(processCategory)
    .filter(Boolean);
  await Promise.all(categories.map(outputCategoryClues));
  await outputCategoryData(categories);
};

const processFile = async (file, categoryMap) => {
  const fullPath = join(GAMES_PATH, file);
  const { date, categories, clues } = JSON.parse(
    String(await readFilep(fullPath))
  );

  const dateTs = new Date(date).getTime();

  categories.forEach((category) => {
    if (!categoryMap.has(category.name)) {
      categoryMap.set(category.name, {
        ...category,
        minDate: dateTs,
        maxDate: dateTs,
        clues: [],
      });
    }
  });

  const categoryHasClue = new Set();
  clues.forEach(({ category: cIdx, clue, question, value }) => {
    const category = categoryMap.get(categories[cIdx].name);
    categoryHasClue.add(category);
    category.clues.push({ clue, question, value, date });
  });

  Array.from(categoryHasClue).forEach((category) => {
    category.minDate = Math.min(category.minDate, dateTs);
    category.maxDate = Math.max(category.maxDate, dateTs);
  });
};

const processCategory = (category) => {
  const values = category.clues.reduce(
    (acc, clue) => (acc.add(clue.value), acc),
    new Set()
  );
  if (values.size < 5) {
    return null;
  }

  return {
    ...category,
    slug: slug(category.name),
  };
};

const outputCategoryClues = async (category) => {
  const done = await debouncer();
  const outputPath = join(CATEGORIES_PATH, `${category.slug}.json`);
  await writeFileP(outputPath, JSON.stringify(category.clues));
  done();
};

const toDateStr = (ts) => {
  const date = new Date(ts);
  const pad = (str) => `0${str}`.substr(-2);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`;
};

const outputCategoryData = async (categories) => {
  const done = await debouncer();
  const outputPath = CATEGORIES_MAP;
  const noClues = categories.map(({ clues, ...rest }) => {
    rest.minDate = toDateStr(rest.minDate);
    rest.maxDate = toDateStr(rest.maxDate);
    return rest;
  });
  await writeFileP(outputPath, JSON.stringify(noClues));
  done();
};

module.exports = { processGameData };

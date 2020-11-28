const { scrapeSeasons } = require("./scrape");
const { processGameData } = require("./process");

Promise.resolve()
  // .then(scrapeSeasons)
  .then(processGameData)
  .catch(console.error)

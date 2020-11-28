const puppeteer = require("puppeteer");
const { writeFile } = require("fs");
const { promisify } = require("util");
const { join } = require("path");
const { getDebouncer } = require("./debouncer");
const { GAMES_PATH } = require("./paths");

const writeFileP = promisify(writeFile);
const debouncer = getDebouncer(30);

let browser;
const start = async function () {
  if (!browser) {
    browser = await puppeteer.launch();
  }
};

const scrapePage = async (url, fn) => {
  const done = await debouncer();
  const page = await browser.newPage();
  await page.goto(url);

  return new Promise(async (resolve, reject) => {
    try {
      const result = await page.evaluate(fn);
      resolve(result);
    } catch (ex) {
      reject(ex);
    }
    await page.close();
    done();
  });
};

const scrapeSeasons = function (min, max) {
  return scrapePage("http://www.j-archive.com/listseasons.php", () =>
    Array.from(document.querySelectorAll("#content a"))
      .map((a) => a.href)
      .filter((url) => url.includes("showseason.php"))
      .filter((url) => /=\d+$/.test(url))
  ).then((links) =>
    links
      .filter((link) => {
        const season = parseInt(link.split("=")[1], 10);
        if (min && season < min) {
          return false;
        }
        if (max && season > max) {
          return false;
        }
        return true;
      })
      .reduce(
        (acc, link) =>
          acc.then(() => {
            const start = Date.now();
            const season = link.split("=")[1];
            process.stdout.write(`scraping season ${season}`);
            return scrapeSeason(link).then(() => {
              const duration = Math.floor((Date.now() - start) / 1000);
              console.log(`...${duration}s`);
            });
          }),
        Promise.resolve()
      )
  );
};

const scrapeSeason = (seasonUrl) =>
  scrapePage(seasonUrl, () =>
    Array.from(document.querySelectorAll("#content a"))
      .map((a) => a.href)
      .filter((url) => url.includes("game_id"))
  ).then((gameUrls) => Promise.all(gameUrls.map(scrapeGame)));

const scrapeGame = (gameUrl) =>
  scrapePage(gameUrl, () => {
    const date = document.title.split(" aired ")[1];

    const game = { date, categories: [], clues: [] };

    ["jeopardy_round", "double_jeopardy_round"]
      .map((nodeId) => document.getElementById(nodeId))
      .filter(Boolean)
      .forEach((board) => {
        const [categoryRow, ...clues] = Array.from(
          board.querySelectorAll(".round > tbody > tr")
        );

        const parseCategoryComment = (cell) => {
          const comment = cell.querySelector(".category_comment");
          const text = comment && comment.innerText;
          if (!text) {
            return;
          }
          const fullLength = text.length;
          const prefix = "(Alex: ".length;
          const suffix = ")".length;
          return prefix.substring(prefix, fullLength - suffix);
        };

        const categories = Array.from(
          categoryRow.querySelectorAll(".category")
        ).map((e) => ({
          name: e.querySelector(".category_name").innerText,
          comment: parseCategoryComment(e),
        }));

        game.categories.push(...categories);

        clues.forEach((clueRow, y) => {
          const value = 200 * (y + 1);
          Array.from(clueRow.querySelectorAll(".clue")).forEach((clue, x) => {
            const category = categories[x];
            const catIdx = game.categories.indexOf(category);
            if (clue.querySelector(".clue_text a")) {
              // media questions are damn near always broken
              return;
            }
            const clueTextEl = clue.querySelector(".clue_text");
            if (!clueTextEl) {
              // unasked clue
              return;
            }

            const clueText = clueTextEl.innerText;
            clue.querySelector(".clue_header").parentNode.onmouseover();
            const questionText = clue.querySelector(
              ".clue_text .correct_response"
            ).innerText;
            game.clues.push({
              category: catIdx,
              clue: clueText,
              question: questionText,
              value,
            });
          });
        });
      });

    return game;
  })
    .then((data) => {
      const gameId = gameUrl.split("=")[1];
      return writeFileP(
        join(GAMES_PATH, `${gameId}.json`),
        JSON.stringify(data)
      );
    })
    .catch((ex) => {
      console.error(`Error processing ${gameUrl}: ${ex}`);
    });

const stop = async function () {
  await browser.close();
};

module.exports = {
  scrapeSeasons: async (...args) => {
    await start();
    await scrapeSeasons(...args);
    await stop();
  },
};

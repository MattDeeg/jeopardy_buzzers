import {
  auth,
  database,
  BOARD_REF,
  CATEGORY_REF,
  CLUE_REF,
  PLAYER_REF,
} from "../shared/firebase";
import creds from "./credentials";
import { writable } from "svelte/store";

export const currentCategory = writable({ name: "...", values: [] });
export const currentClues = writable([]);
export const selectedClue = writable(null);

const loadJson = (r) => r.json();

const loadCategories = (() => {
  let ran = null;
  return () => {
    if (!ran) {
      ran = fetch("./data/categories.json").then(loadJson);
    }
    return fetch("./data/categories.json").then(loadJson);
  };
})();

const categoryClues = new Map();
const loadCategoryClues = (categoryId) => {
  if (!categoryClues.has(categoryId)) {
    const load = fetch(`./data/categories/${categoryId}.json`)
      .then(loadJson)
      .then((allClues) =>
        allClues.reduce((acc, clue) => {
          if (!acc.has(clue.value)) {
            acc.set(clue.value, [clue]);
          } else {
            acc.get(clue.value).push(clue);
          }
          return acc;
        }, new Map())
      );
    categoryClues.set(categoryId, load);
  }
  return categoryClues.get(categoryId);
};

const selectClues = (cluesByValue) => {
  return Array.from({ length: 5 }, (_, i) => {
    const value = 200 * (i + 1);
    const clues = cluesByValue.get(value);
    return clues[Math.floor(Math.random() * clues.length)];
  });
};

const login = () =>
  auth
    .signInWithEmailAndPassword(creds.username, creds.password)
    .catch(console.error);

export const init = () => {
  return login().then(() => {
    BOARD_REF.on("value", (snapshot) => {
      if (snapshot && snapshot.val()) {
        currentClues.set(snapshot.val());
      }
    });
    CATEGORY_REF.on("value", (snapshot) => {
      if (snapshot && snapshot.val()) {
        currentCategory.set(snapshot.val());
      } else {
        setRandomCategory();
      }
    });
    CLUE_REF.on("value", (snapshot) => {
      if (snapshot) {
        selectedClue.set(snapshot.val());
      }
    });
  });
};

export const setRandomCategory = async () => {
  const categories = await loadCategories();
  const idx = Math.floor(Math.random() * categories.length);
  const category = categories[idx];
  const clues = await loadCategoryClues(category.slug);
  CLUE_REF.remove();
  CATEGORY_REF.set({
    name: category.name,
    values: [200, 400, 600, 800, 1000],
  });
  return BOARD_REF.set(selectClues(clues));
};

export const setSelectedClue = async (clue) => {
  return CLUE_REF.set({
    value: clue.value,
    clue: clue.clue,
    allowBuzz: false,
  });
};

export const clearSelectedClue = async (value) => {
  clearBuzzers();
  CLUE_REF.remove();
  CATEGORY_REF.once("value").then((snapshot) => {
    const category = (snapshot && snapshot.val()) || { values: [] };
    const newValues = category.values.map((v) => {
      if (v !== value) {
        return v;
      }
      return false;
    });
    CATEGORY_REF.update({ values: newValues });
  });
};

export const allowBuzz = () => {
  CLUE_REF.update({ allowBuzz: true });
};

export const clearBuzzers = () => {
  PLAYER_REF.once("value").then((snapshot) => {
    const players = (snapshot && snapshot.val()) || {};
    Object.keys(players).forEach((key) => {
      const { buzzedAt, ...rest } = players[key];
      players[key] = rest;
    });

    PLAYER_REF.set(players);
  });
};

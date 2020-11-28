import { SERVER_TIME, CATEGORY_REF, CLUE_REF, USER_REF } from "../shared/firebase";
import { writable } from "svelte/store";

export const currentCategory = writable(null);
export const selectedClue = writable(null);
const storedUsername = localStorage.getItem("buzzer-username");
export const username = writable(storedUsername);

const fonts = [
  "Amatic SC",
  "Architects Daughter",
  "Caveat",
  "Dancing Script",
  "Indie Flower",
  "Pacifico",
  "Patrick Hand",
  "Permanent Marker",
  "Shadows Into Light",
  "Yellowtail",
];

const getStoredFont = () => {
  const stored = localStorage.getItem("buzzer-font");
  if (stored && fonts.includes(stored)) {
    return stored;
  }
  return fonts[Math.floor(Math.random() * fonts.length)];
};

export const setUsername = (value) => {
  const font = getStoredFont();
  username.set(value);
  localStorage.setItem("buzzer-username", value);
  localStorage.setItem("buzzer-font", font);
  USER_REF(value).set({
    name: value,
    lastSeen: SERVER_TIME,
    font,
  });
};

if (storedUsername) {
  setUsername(storedUsername);
}

export const init = () => {
  CATEGORY_REF.on("value", (snapshot) => {
    if (snapshot) {
      currentCategory.set(snapshot.val());
    }
  });
  CLUE_REF.on("value", (snapshot) => {
    if (snapshot) {
      selectedClue.set(snapshot.val());
    }
  });
};

export const buzz = () => {
  const user = localStorage.getItem("buzzer-username");
  USER_REF(user).update({
    buzzedAt: SERVER_TIME,
  }).catch(() => {});
};

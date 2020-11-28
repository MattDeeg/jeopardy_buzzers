import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

import firebaseConfig from "./firebaseConfig";
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const database = firebase.database();
if (location.hostname === "localhost") {
  database.useEmulator("localhost", 5001);
}

const escapeRef = str => str.replace(/\//g, '');

export const BOARD_REF = database.ref("board");
export const CATEGORY_REF = database.ref("category");
export const CLUE_REF = database.ref("clue");
export const PLAYER_REF = database.ref('players');
export const USER_REF = (name) => database.ref(`players/${escapeRef(name)}`);
export const SERVER_TIME = firebase.database.ServerValue.TIMESTAMP;
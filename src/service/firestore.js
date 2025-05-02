import { getFirestore } from "firebase/firestore";
import {
  getDoc,
  getDocs,
  collection,
  query,
  where,
  setDoc,
  updateDoc,
  onSnapshot,
  doc,
  arrayUnion,
  arrayRemove,
  deleteField,
} from "firebase/firestore";

import { app } from "./firebase";

export const firestore = getFirestore(app, "agentic-repo");
export {
  getDoc,
  getDocs,
  collection,
  query,
  where,
  setDoc,
  updateDoc,
  onSnapshot,
  doc,
  arrayUnion,
  arrayRemove,
  deleteField,
};

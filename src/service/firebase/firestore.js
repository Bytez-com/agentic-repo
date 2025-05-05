import { getFirestore } from "firebase/firestore";
import {
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  doc,
  collection,
  getDocs,
  query,
  where,
  arrayUnion,
  deleteField,
} from "firebase/firestore";

import { app } from ".";

export const firestore = getFirestore(app, "agentic-repo");
export const get = (path) => getDoc(getDocument(path));
export const set = (path, data) => setDoc(getDocument(path), data);
export const update = (path, data) => updateDoc(getDocument(path), data);
export const listen = (path, callback) =>
  onSnapshot(getDocument(path), callback);

// TODO need to be abstracted like the above
export { deleteField, collection, getDocs, query, where, arrayUnion };

function getDocument(path) {
  const segments = path.split("/");
  const docId = segments.pop();
  const collection = segments.join("/");

  return doc(firestore, collection, docId);
}

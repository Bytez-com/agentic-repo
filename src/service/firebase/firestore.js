import { getFirestore } from "firebase/firestore";
import { getDoc, setDoc, onSnapshot, doc } from "firebase/firestore";

import { app } from ".";

export const firestore = getFirestore(app, "agentic-repo");
export const get = (path) => getDoc(getDocument(path));
export const set = (path, data) => setDoc(getDocument(path), data);
export const listen = (path, callback) =>
  onSnapshot(getDocument(path), callback);

function getDocument(path) {
  const segments = path.split("/");
  const docId = segments.pop();
  const collection = segments.join("/");

  return doc(firestore, collection, docId);
}

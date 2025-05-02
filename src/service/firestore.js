import { getFirestore } from "firebase/firestore";
import { getDoc, setDoc, onSnapshot, doc } from "firebase/firestore";

import { app } from "./firebase";

export const firestore = getFirestore(app, "agentic-repo");
export { getDoc, setDoc, onSnapshot, doc };

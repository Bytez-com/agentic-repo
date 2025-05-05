import admin from "firebase-admin";
import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import path from "path";

let [app] = getApps();

app ??= initializeApp({
  credential:
    process.env.NODE_ENV === "production"
      ? undefined
      : admin.credential.cert(
          path.resolve(process.cwd(), "service-account.json")
        ),
});

export const firestore = getFirestore(app, "agentic-repo");

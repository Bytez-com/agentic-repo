import { cookies } from "next/headers";
import { Octokit } from "@octokit/rest";

import { firestore } from "@/service/firebase/admin";

export default async function getSession(getFirestore = true) {
  const cookieStore = await cookies();
  var { uid, accessToken } = JSON.parse(cookieStore.get("session").value);

  if (getFirestore) {
    var { repo, owner } = await getFirestoreData(uid);
  }

  return {
    uid,
    repo,
    owner,
    octokit: new Octokit({ auth: accessToken }),
  };
}

export async function getFirestoreData(uid) {
  const userDoc = await firestore.collection("users").doc(uid).get();
  const data = userDoc.data();
  const url = data.repo.split("/") ?? [];
  const repo = url.at(-1);
  const owner = url.at(-2);

  return { repo, owner, accessToken: data.accessToken };
}

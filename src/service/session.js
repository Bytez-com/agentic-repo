import { cookies } from "next/headers";

import { firestore } from "@/service/firebase/admin";

export default async function getSession(getFirestore = true) {
  const cookieStore = await cookies();
  const { uid, accessToken } = JSON.parse(cookieStore.get("session").value);

  if (getFirestore) {
    const userDoc = await firestore.collection("users").doc(uid).get();
    var data = userDoc.data();
  }

  return { uid, accessToken, data };
}

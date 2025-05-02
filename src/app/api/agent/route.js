import { cookies } from "next/headers";

import { firestore } from "@/service/firebase/admin";
import generateChangelog from "@/tools/changelog";

export async function GET() {
  try {
    const {
      accessToken,
      data: { repo },
    } = await getSession();
    const changeLog = await generateChangelog(repo, accessToken);

    // return Response.json(changeLog);
    return new Response(changeLog, {
      headers: { "content-type": "text/markdown" },
    });
  } catch (error) {
    console.error(error);

    return Response.json({ error: error.message ?? error }, { status: 500 });
  }
}
async function getSession(getFirestore = true) {
  const cookieStore = await cookies();
  const { uid, accessToken } = JSON.parse(cookieStore.get("session").value);

  if (getFirestore) {
    const userDoc = await firestore.collection("users").doc(uid).get();
    var data = userDoc.data();
  }

  return { uid, accessToken, data };
}

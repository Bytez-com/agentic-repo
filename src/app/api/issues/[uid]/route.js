import { getFirestoreData } from "@/service/session";

export async function POST(req, { params }) {
  try {
    const [{ uid }, { action, issue, repository, sender }] = await Promise.all([
      params,
      req.json(),
    ]);
    const { accessToken } = await getFirestoreData(uid);

    console.log({ uid, action, issue, repository, sender, accessToken });

    return new Response(undefined, { status: 204 });
  } catch (error) {
    console.error(error);

    return Response.json({ error: error.message ?? error }, { status: 500 });
  }
}

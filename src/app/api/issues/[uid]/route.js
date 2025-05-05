import issueTool from "@/tools/issues";

export async function POST(req, { params }) {
  try {
    const [{ uid }, { action, issue, repository, sender }] = await Promise.all([
      params,
      req.json(),
    ]);

    if (action === "created") {
      await issueTool(uid, issue, repository, sender);
    }

    return new Response(undefined, { status: 204 });
  } catch (error) {
    console.error(error);

    return Response.json({ error: error.message ?? error }, { status: 500 });
  }
}

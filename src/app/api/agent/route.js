import generateChangelog from "@/tools/changelog";

export async function GET() {
  try {
    const [, owner, repo] = new URL(
      "https://github.com/mui/material-ui"
    ).pathname.split("/");

    const changeLog = await generateChangelog(owner, repo);

    return new Response(changeLog, {
      headers: { "content-type": "text/markdown" },
    });
  } catch (error) {
    console.error(error);

    return Response.json({ error: error.message ?? error }, { status: 500 });
  }
}

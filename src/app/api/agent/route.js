// import generateChangelog from "@/tools/changelog";
import { cookies } from "next/headers";

export async function GET(req) {
  try {
    console.log(await cookies());
    // const [, owner, repo] = new URL(
    //   "https://github.com/mui/material-ui"
    // ).pathname.split("/");

    // const changeLog = await generateChangelog(owner, repo);
    const changeLog = "markdown";
    return new Response(changeLog, {
      headers: { "content-type": "text/markdown" },
    });
  } catch (error) {
    console.error(error);

    return Response.json({ error: error.message ?? error }, { status: 500 });
  }
}

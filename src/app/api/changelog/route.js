import generateChangelog from "@/tools/changelog";
import getSession from "@/service/session";

export async function GET() {
  try {
    const { owner, repo, octokit } = await getSession();
    const images = await generateChangelog(owner, repo, octokit);

    return Response.json(images);
  } catch (error) {
    console.error(error);

    return Response.json({ error: error.message ?? error }, { status: 500 });
  }
}

import { Octokit } from "@octokit/rest";

import getSession from "@/service/session";

export async function GET() {
  try {
    const { accessToken } = await getSession(false);
    const octokit = new Octokit({ auth: accessToken });
    // one page (up to 100 repos)
    const { data } = await octokit.rest.repos.listForAuthenticatedUser({
      visibility: "all", // public | private | all   (default: all)
      affiliation: "owner,collaborator,organization_member",
      per_page: 100, // max allowed per page
    });
    const repos = [];

    for (const { html_url } of data) {
      repos.push(html_url);
    }

    return Response.json(repos);
  } catch (error) {
    console.error(error);

    return Response.json({ error: error.message ?? error }, { status: 500 });
  }
}

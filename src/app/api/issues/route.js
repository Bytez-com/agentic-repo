import getSession from "@/service/session";

export async function GET() {
  try {
    const { owner, repo, octokit, uid } = await getSession();
    const installed = await hasWebhook(owner, repo, octokit, uid);

    return Response.json({ installed });
  } catch (error) {
    console.error(error);

    return Response.json({ error: error.message ?? error }, { status: 500 });
  }
}
export async function POST() {
  try {
    const { owner, repo, octokit, uid } = await getSession();

    await installWebHook(owner, repo, octokit, uid);

    return new Response(undefined, { status: 204 });
  } catch (error) {
    console.error(error);

    return Response.json({ error: error.message ?? error }, { status: 500 });
  }
}

async function hasWebhook(owner, repo, octokit, uid) {
  const webhookUrl = `https://agentic-repo--agentic-repo.us-central1.hosted.app/api/issues/${uid}`;
  const hooks = await octokit.paginate(octokit.rest.repos.listWebhooks, {
    owner,
    repo,
    per_page: 100,
  });

  for (const hook of hooks) {
    if (hook.config?.url?.toLowerCase() === webhookUrl) {
      return true;
    }
  }

  return false;
}
async function installWebHook(owner, repo, octokit, uid) {
  const webhookUrl = `https://agentic-repo--agentic-repo.us-central1.hosted.app/api/issues/${uid}`;
  const installed = await hasWebhook(owner, repo, octokit);

  if (installed === false) {
    await octokit.rest.repos.createWebhook({
      owner,
      repo,
      active: true,
      events: ["issues"],
      config: { content_type: "json", url: webhookUrl },
    });
  }
}

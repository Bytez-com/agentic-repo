import { Octokit } from "@octokit/rest";
import { createOAuthAppAuth } from "@octokit/auth-oauth-app";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    if (!code) {
      return Response.json(
        { error: "Missing ?code in query." },
        { status: 400 }
      );
    }

    // Exchange the code for an access token
    const auth = createOAuthAppAuth({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    });

    const { token } = await auth({ type: "token", code });

    // Create an authenticated Octokit instance
    const octokit = new Octokit({ auth: token });

    return Response.json({ token });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message ?? error }, { status: 500 });
  }
}

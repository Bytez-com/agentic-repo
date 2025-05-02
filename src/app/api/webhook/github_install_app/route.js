import { firestore, doc, updateDoc } from "@/service/firestore";

// Redirect users to GitHub's authorization page to begin the app installation flow
export async function GET(req) {
  const url = new URL(req.url);
  const uid = url.searchParams.get("uid");

  const githubAuthUrl = new URL(
    `https://github.com/apps/${process.env.GITHUB_APP_NAME}/installations/new`
  );

  const githubAppInstallState = crypto.randomUUID();

  await updateDoc(doc(firestore, "users", uid), { githubAppInstallState });

  githubAuthUrl.searchParams.append("state", githubAppInstallState);

  // Redirect to GitHub
  return Response.redirect(githubAuthUrl.toString());
}

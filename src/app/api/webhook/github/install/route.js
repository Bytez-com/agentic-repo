import { firestore } from "@/service/firebase/admin";

// Redirect users to GitHub's authorization page to begin the app installation flow
export async function GET(req) {
  const githubAppInstallState = crypto.randomUUID();

  await firestore
    .collection("users")
    .doc(new URL(req.url).searchParams.get("uid"))
    .update({ githubAppInstallState });

  // Redirect to GitHub
  return Response.redirect(
    `https://github.com/apps/${process.env.GITHUB_APP_NAME}/installations/new?state=${githubAppInstallState}`
  );
}

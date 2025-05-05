import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
import {
  firestore,
  collection,
  getDocs,
  query,
  where,
  update,
  arrayUnion,
} from "@/service/firebase/admin";

export async function POST(req) {
  try {
    const body = await req.json();

    if (body.action === "created" || body.action === "deleted") {
      return new Response("success");
    }

    const {
      action,
      installation,
      issue,
      repository: { full_name },
    } = body;

    if (action === "opened" || action === "deleted") {
      const { docs } = await firestore
        .collection("users")
        .where("installation_id", "==", installation.id)
        .get();
      const users = [];

      docs.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });

      const [user] = users;

      const { html_url: url, title, body, number: issueNumber } = issue;

      if (action === "opened") {
        // INSERT MODEL THAT FINDS PROBLEMS AND TAGS AN APPROPRIATE MAINTAINER HERE

        const response = "We're on it, @inf3rnus check this out 👀";

        // Add comment on GitHub
        const octokit = new Octokit({
          authStrategy: createAppAuth,
          auth: {
            appId: process.env.GITHUB_APP_ID,
            privateKey: process.env.GITHUB_APP_PRIVATE_KEY.replace(
              /\\n/g,
              "\n"
            ),
            installationId: installation.id,
          },
        });

        await octokit.issues.createComment({
          owner: full_name.split("/")[0],
          repo: full_name.split("/")[1],
          issue_number: issueNumber,
          body: response,
        });

        const updatedIssue = { url, title, body, response };

        await update(`users/${user.id}`, { issues: arrayUnion(updatedIssue) });
      } else {
        const newIssues = user.issues.filter((issue) => issue.url !== url);

        await update(`users/${user.id}`, { issues: newIssues });
      }
    }

    return new Response("success");
  } catch (error) {
    console.error(error);

    return new Response("failed", { status: 500 });
  }
}

import { Octokit } from "@octokit/rest";
import Bytez from "bytez.js";

import { getFirestoreData } from "@/service/session";

const sdk = new Bytez(
  process.env.BYTEZ_API_KEY,
  process.env.NODE_ENV === "development"
);

const model = sdk.model("openai/gpt-4o-mini", process.env.OPENAI_API_KEY);

export default async function issueTool(uid, issue, repository, sender) {
  try {
    const response = await generateResponse(issue, sender);

    await replyToIssue(uid, repository, issue, response);
  } catch (error) {
    console.error(error);
  }
}

async function generateResponse({ title, body }, sender) {
  const { output, error } = await model.run([
    {
      role: "system",
      content: `
        You're a github bot that replies to issues in a repo when they're opened.

        When a new issue is opened, you greet the opener with "Huzzah!" and their user name, and then you reply to what they wrote and then you at @inf3rnus, asking him to take a look.
      `,
    },
    {
      role: "user",
      content: `
        ## Sender:
        ${JSON.stringify(sender)}

        ## Issue title:
        ${title}

        ## Issued text:
        ${body}
      `,
    },
  ]);

  if (error) {
    throw new Error(error);
  }

  return output.content;
}

async function replyToIssue(uid, { owner, name }, issue, response) {
  const { accessToken } = await getFirestoreData(uid);
  const octokit = new Octokit({ auth: accessToken });

  await octokit.rest.issues.createComment({
    owner: owner.login,
    repo: name,
    issue_number: issue.number,
    body: response,
  });
}

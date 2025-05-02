import { Octokit } from "@octokit/rest";
import Bytez from "bytez.js";

const sdk = new Bytez(process.env.BYTEZ_KEY);

export default async function changeLogTool(repoUrl, accessToken) {
  const newCommits = await getNewCommits(repoUrl, accessToken);
  const changeLog = await generateChangelog(newCommits);

  await addImages(changeLog);

  return changeLog;
}
// get commits
async function getNewCommits(repoUrl, accessToken) {
  const octokit = new Octokit({ auth: accessToken }); // optionally { auth: process.env.GITHUB_TOKEN }
  const url = repoUrl.split("/");
  const owner = url.at(-2);
  const repo = url.at(-1).trim();
  const commits = await fetchCommits(octokit, owner, repo);
  const changelogContent = await fetchChangelog(owner, repo);
  const existingSHAs = changelogContent.match(/[0-9a-f]{7}/g) || []; // Find all 7-character SHAs
  const newCommits = commits.filter(
    (commit) => !existingSHAs.includes(commit.sha)
  );

  if (newCommits.length === 0) {
    return console.log("No new commits to include in the changelog.");
  }

  const commitMessages = newCommits
    .map((commit) => `- ${commit.message} (${commit.sha})`)
    .join("\n");

  return commitMessages;
}
async function fetchCommits(octokit, owner, repo) {
  const {
    data: { default_branch },
  } = await octokit.repos.get({ owner, repo });
  const commits = [];

  for (let page = 0, data; data?.length !== 0; page++) {
    ({ data = [] } = await octokit.repos.listCommits({
      owner,
      repo,
      sha: default_branch,
      per_page: 100,
      page,
    }));

    for (const { sha, commit } of data) {
      commits.push({
        sha: sha.slice(0, 7),
        author: commit.author.name,
        message: commit.message.split("\n")[0],
        date: commit.author.date,
      });
    }
  }

  return commits;
}
async function fetchChangelog(octokit, owner, repo) {
  try {
    const response = await octokit.repos.getContent({
      owner,
      repo,
      path: "CHANGELOG.md",
    });
    const content = Buffer.from(response.data.content, "base64").toString();

    return content;
  } catch {
    console.warn("No existing CHANGELOG.md found.");

    return "";
  }
}
// generate changelog
async function generateChangelog(newCommits) {
  const model = sdk.model("openai/gpt-4o-mini", process.env.OPENAI_API_KEY);
  const { output, error, provider } = await model.run([
    {
      role: "system",
      content: `You are a professional release manager.

        Your job is to write a clean, readable changelog for a new software release based on commit messages.
      `,
    },
    {
      role: "user",
      content: `
        Here are the new commit messages:

        ${newCommits}

        Please generate a structured changelog, grouping features, fixes, chores, and docs separately.`,
    },
  ]);

  console.log({ output, error, provider });

  return output.content;
}
// add images
async function addImages(changeLog) {
  const model = sdk.model(
    "nitrosocke/Ghibli-Diffusion",
    process.env.OPENAI_API_KEY
  );

  // await model.create({ capacity: { min: 3, max: 3  } });
}

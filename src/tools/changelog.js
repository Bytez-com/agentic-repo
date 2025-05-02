import { Octokit } from "@octokit/rest";
import { ChatOpenAI } from "@langchain/openai";
// import Bytez from 'bytez.js'
// import { ChatPromptTemplate } from "@langchain/core/prompts";

// 1. Setup Octokit (GitHub API Client)
const octokit = new Octokit(); // optionally { auth: process.env.GITHUB_TOKEN }

// 2. Setup ChatOpenAI (LangChain)
const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.2,
});

// 3. Fetch commits from GitHub
async function fetchCommits(owner, repo) {
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

// 4. Read the current CHANGELOG.md from GitHub
async function fetchChangelog(owner, repo) {
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

// 5. Main function to generate new changelog
export default async function generateChangelog(owner, repo) {
  const commits = await fetchCommits(owner, repo);
  const changelogContent = await fetchChangelog(owner, repo);
  const existingSHAs = changelogContent.match(/[0-9a-f]{7}/g) || []; // Find all 7-character SHAs
  const newCommits = commits.filter(
    (commit) => !existingSHAs.includes(commit.sha)
  );

  if (newCommits.length === 0) {
    console.log("No new commits to include in the changelog.");

    return "No new commits to add.";
  }

  const commitMessages = newCommits
    .map((c) => `- ${c.message} (${c.sha})`)
    .join("\n");

  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are a professional release manager. Your job is to write a clean, readable changelog for a new software release based on commit messages.",
    ],
    [
      "user",
      `Here are the new commit messages:\n\n${commitMessages}\n\nPlease generate a structured changelog, grouping features, fixes, chores, and docs separately.`,
    ],
  ]);

  const chain = prompt.pipe(model);
  const { content } = await chain.invoke();

  return content;
}

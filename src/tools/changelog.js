import { sdk } from "@/service/bytez";

import("colors");

export default async function changeLogTool(owner, repo, octokit) {
  // step 1 - find new commits
  const newCommits = await getNewCommits(owner, repo, octokit);
  // step 2 - generate a changelog based on new commits
  const changeLog = await generateChangelog(newCommits);
  // step 3 - add an image to our changelog
  const { finalChangeLog, images } = await addImages(changeLog);
  // step 4 - save to repo

  await saveChangeLog(owner, repo, octokit, finalChangeLog);

  return images;
}
// get commits
async function getNewCommits(owner, repo, octokit) {
  const commits = await fetchCommits(octokit, owner, repo);
  const changelogContent = await fetchChangelog(owner, repo);
  const existingSHAs = changelogContent.match(/[0-9a-f]{7}/g) || []; // Find all 7-character SHAs
  const newCommits = commits.filter(
    (commit) => !existingSHAs.includes(commit.sha)
  );

  if (newCommits.length === 0) {
    return;
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
    return "";
  }
}
// generate changelog
async function generateChangelog(newCommits) {
  const model = sdk.model("openai/gpt-4o-mini", process.env.OPENAI_API_KEY);

  log("generating changelog from fresh commits");

  const { output, error, provider } = await model.run([
    {
      role: "system",
      content: `You are a professional release manager.

        Your job is to write a clean, readable changelog for a new software release based on commit messages.

        When replying, you only return markdown, and nothing else.
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
  /*
    Image generators
  */
  const stableDiffusion = sdk.model("stabilityai/stable-diffusion-xl-base-1.0");
  const ghibli = sdk.model("nitrosocke/Ghibli-Diffusion");
  const midJourney = sdk.model("prompthero/openjourney-v4");
  const allInOne = sdk.model("PublicPrompts/All-In-One-Pixel-Model");
  const pixelArt = sdk.model("kohbanye/pixel-art-style");
  const dreamShaper = sdk.model("Lykon/dreamshaper-8");
  /*
    Claude
  */
  const claude = sdk.model(
    "anthropic/claude-3-7-sonnet-20250219",
    process.env.CLAUDE_API_KEY
  );

  log("Generating image prompt + creating models");

  const [claudeResponse] = await Promise.all([
    // ask claude to generate a text-to-image prompt
    claude.run([
      {
        role: "system",
        content: "You create text-to-image prompts",
      },
      {
        role: "user",
        content: `
          Take the GitHub changelog, and use its content to generate a cyberpunk themed image prompt.

          Prompt should create 16-bit pixel art.

          Changelog:
          ${changeLog}

          Prompt:
        `,
      },
    ]),
    // meanwhile, we create our text-to-image models
    ghibli.create(),
    midJourney.create(),
    pixelArt.create(),
    allInOne.create(),
    dreamShaper.create(),
    // want to run models quantized?
    stableDiffusion.create({
      config: {
        variant: "fp16",
        torch_dtype: "float16",
      },
    }),
  ]);
  /*
      Let's generate those images!
  */
  log("Generating images...");

  const imagePrompt = `16bitscene pixelart: ${claudeResponse.output.content}`;
  const results = await Promise.all([
    // popular models
    stableDiffusion.run(imagePrompt),
    midJourney.run(imagePrompt),
    // fine tuned models
    ghibli.run(imagePrompt),
    allInOne.run(imagePrompt),
    pixelArt.run(imagePrompt),
    dreamShaper.run(imagePrompt),
  ]);

  /*
    Let's ask a reasoning LLM to judge which image is best for our changelog
  */
  log("Selecting the best image");

  const o4 = sdk.model("openai/o4-mini", process.env.OPENAI_API_KEY);
  const {
    output: { content: selectedImage },
  } = await o4.run([
    {
      role: "system",
      content: "When replying, you only return one image URL and nothing else",
    },
    {
      role: "user",
      content: `
        Select the best looking image that visually fits the content of the provided changelog.

        **Analysis Guidance:**
        1.  Review the changelog content to understand the main themes (e.g., software development, coding, features, fixes, Firebase, cookies, tools).
        2.  Examine each image URL provided below one by one.
        3.  For each image, assess how well its *visual content* represents the themes identified in the changelog.
        4.  Compare the images based on relevance and visual appeal.
        5.  **Crucially**: Identify the *specific URL* associated with the image you determine to be the best fit based on its visuals.
        6. After selecting the image, do one final double check that indeed its the best, by reviewing the images one final time. If you need to change your choice, then update your choice.

        Return *only* the single URL of your final choice.

        **Changelog:**
        \`\`\`changelog.md
        ${changeLog}
        \`\`\`

        **Images:**
        ${results
          .map(({ output: imageUrl }, index) => `${index + 1}- ${imageUrl}`)
          .join("\n")}

        Which single image URL from the list above is the best fit?
      `,
    },
  ]);

  /*
    Google Gemini 2.5 Pro is great for code generation
  */
  log("Adding image to changelog");

  const geminiPro = sdk.model(
    "google/gemini-2.5-pro-preview-03-25",
    process.env.GEMINI_API_KEY
  );
  const {
    output: { content: finalChangeLog },
  } = await geminiPro.run([
    {
      role: "system",
      content: "You only reply with pure markdown and no other text",
    },
    {
      role: "user",
      content: `
        Please add this image (${selectedImage}) atop this changelog so my change log looks pretty.

        Return me only markdown so I can save it as a file

        \`\`\`changelog.md
        ${changeLog}
        \`\`\

      `,
    },
  ]);

  // return pure markdown
  return {
    images: results
      .filter(({ output }) => output)
      .map(({ output }) => ({ url: output })),
    finalChangeLog: finalChangeLog
      .replace(/^```(?:markdown)?\n/, "")
      .replace(/\n```$/, ""),
  };
}

async function saveChangeLog(owner, repo, octokit, finalChangeLog) {
  log("saving changelog");

  const {
    data: { default_branch: branch },
  } = await octokit.rest.repos.get({ owner, repo });
  const path = "CHANGELOG.md";

  try {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
    });
    // required when *updating* a file
    var sha = data.sha ?? undefined;
  } catch {
    // ignore if there is no change log
  }

  await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    branch,
    sha,
    content: Buffer.from(finalChangeLog).toString("base64"),
    message: sha
      ? "chore: update CHANGELOG [skip ci]"
      : "chore: add initial CHANGELOG",
  });
}

const log = (text) => console.log(text.bgBlue.white);

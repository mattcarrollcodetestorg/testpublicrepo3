import { Octokit } from "@octokit/rest";
import fetch from "node-fetch";

// Helper function to delay execution
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function lockDiscussions() {
    const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
    request: { fetch }
  });
  const owner = process.env.GITHUB_REPOSITORY_OWNER;
  const repo = process.env.GITHUB_REPOSITORY.split('/')[1];

  try {
    // Fetch all discussions in the organization
    const discussions = await octokit.rest.teams.listDiscussionsInOrg({
      org: owner,
      team_slug: repo, // Use the repository name as the team slug
    });

    for (const discussion of discussions.data) {
      // Check if the discussion belongs to the specified repository
      if (discussion.repository.name !== repo) {
        continue;
      }

      // Check if the discussion is already locked
      if (discussion.locked) {
        console.log(`Discussion #${discussion.number} is already locked.`);
        continue;
      }

      // Lock the discussion
      await octokit.rest.teams.lockDiscussionInOrg({
        org: owner,
        team_slug: repo,
        discussion_number: discussion.number,
      });
      console.log(`Locked discussion #${discussion.number}`);

      // Delay to respect rate limits
      await delay(1000); // Delay for 1 second between requests
    }
  } catch (error) {
    console.error(`Error locking discussions: ${error.message}`);
  }
}

lockDiscussions();

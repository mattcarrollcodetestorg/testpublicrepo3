import { graphql } from "@octokit/graphql";
import fetch from "node-fetch";

// Helper function to delay execution
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function lockDiscussions() {
  const graphqlWithAuth = graphql.defaults({
    headers: {
      authorization: `token ${process.env.GITHUB_TOKEN}`,
    },
    request: { fetch },
  });

  const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');

  try {
    // Fetch all discussions in the repository
    const { repository } = await graphqlWithAuth(`
      query($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
          discussions(first: 100) {
            nodes {
              id
              number
              locked
            }
          }
        }
      }
    `, {
      owner,
      repo,
    });

    for (const discussion of repository.discussions.nodes) {
      // Check if the discussion is already locked
      if (discussion.locked) {
        console.log(`Discussion #${discussion.number} is already locked.`);
        continue;
      }

      // Lock the discussion
      await graphqlWithAuth(`
        mutation($id: ID!) {
          lockLockable(input: { lockableId: $id }) {
            clientMutationId
          }
        }
      `, {
        id: discussion.id,
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

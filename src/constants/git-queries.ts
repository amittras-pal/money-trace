import { getEnv } from "../env/config";

// GQL query to retrieve latest releases.
export const releasesQuery = () => {
  const { GIT_REPO_NAME, GIT_REPO_OWNER } = getEnv();
  return `
query {
  repository(owner:"${GIT_REPO_OWNER}", name:"${GIT_REPO_NAME}") {
    releases(last:50){
      nodes{
        name,
        publishedAt,
        isLatest,
        isPrerelease,
        isDraft,
        tagName,
        description,
        author {
          name,
          avatarUrl,
        },
      }
    }
  }
}
`;
};

// GQL query to retrieve user info.
export const userQuery = (username: string) => `
query {
  user(login:"${username}") {
    name,
    avatarUrl,
    bio,
    createdAt,
    company,
    location,
    socialAccounts(last:5){
      nodes {
        displayName,
        provider
      }
    },
    url,
  }
}`;

export type ReleaseInfo = {
  name: string;
  publishedAt: string;
  isLatest: boolean;
  isPrerelease: boolean;
  isDraft: boolean;
  tagName: string;
  description: string;
  author: {
    name: string;
    avatarUrl: string;
  };
};

export type ReleaseResponse = {
  repository: {
    releases: {
      nodes: ReleaseInfo[];
    };
  };
};

export type ContributorInfo = {
  data: {
    user: {
      name: string;
      avatarUrl: string;
      bio: string;
      createdAt: string;
      company: string;
      location: string;
      socialAccounts: {
        nodes: {
          displayName: string;
          provider: string;
        }[];
      };
      url: string;
    };
  };
};

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

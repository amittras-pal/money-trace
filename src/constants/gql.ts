export const releasesQuery = `
query {
  repository(owner:"amittras-pal", name:"expensary") {
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

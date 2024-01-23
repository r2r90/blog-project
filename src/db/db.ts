export type DBType = {
  blogsDb: BlogsDbType;
};

export type BlogsDbType = BlogType[];

export type BlogType = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
};

export const db: DBType = {
  blogsDb: [
    /*{
      id: "1",
      name: "firstBlog",
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit," and it continues for several paragraphs.',
      websiteUrl:
        "https://Y5Bq7PSGISmFU8n9qqN4ERMtgDenu8peSP6Ao6wN0fnGYDb6ZDnrxt.pTth7TsCyG7BPecXY6LReqDhpt6Bjc2VAy_Lp",
    },
    {
      id: "2",
      name: "secondBlog",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris",
      websiteUrl:
        "https://Y5Bq7PSGISmFU8n9qqN4ERMtgDenu8peSP6Ao6wN0fnGYDb6ZDnrxt.pTth7TsCyG7BPecXY6LReqDhpt6Bjc2VAy_Lp",
    },*/
  ],
};

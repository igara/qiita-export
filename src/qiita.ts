import * as fs from "fs";
import * as fetchImport from "isomorphic-unfetch";
import * as request from "request-promise";

const fetch = (fetchImport.default || fetchImport) as typeof fetchImport.default;

type User = {
  description: string;
  facebook_id: string;
  followees_count: number;
  followers_count: number;
  github_login_name: string;
  id: string;
  items_count: number;
  linkedin_id: string;
  location: string;
  name: string;
  organization: string;
  permanent_id: number;
  profile_image_url: string;
  team_only: boolean;
  twitter_screen_name: string;
  website_url: string;
};

type Tag = {
  name: string;
  versions: string[];
};

export type UserItem = {
  rendered_body: string;
  body: string;
  coediting: false;
  comments_count: number;
  created_at: string;
  group?: string;
  id: string;
  likes_count: number;
  private: boolean;
  reactions_count: number;
  tags: Tag[];
  title: string;
  updated_at: string;
  url: string;
  user: User;
  page_views_count?: number;
};

export const user = async (userName: string, token: string): Promise<User> => {
  const res = await fetch(`https://qiita.com/api/v2/users/${userName}`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
    method: "GET",
  });
  return await res.json();
};

const addZero = (num: number) => ("0" + num).slice(-2);

export const userItems = async (userName: string, token: string, page: number): Promise<UserItem[]> => {
  const res = await fetch(`https://qiita.com/api/v2/users/${userName}/items?page=${page}&per_page=100`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
    method: "GET",
  });
  const json = await res.json();
  return json.map((item) => {
    const createAt = item.created_at;
    const date = new Date(createAt);

    return {
      ...item,
      // eslint-disable-next-line @typescript-eslint/camelcase
      created_at: `${date.getFullYear()}-${addZero(date.getMonth() + 1)}-${addZero(date.getDate())} ${addZero(
        date.getHours(),
      )}-${addZero(date.getMinutes())}-${addZero(date.getSeconds())}`,
    };
  });
};

const directoryName = (item: UserItem) => `${item.user.id}/${item.created_at} ${item.title.replace(/\//g, "／")}`;

export const mkdir = (item: UserItem) => {
  fs.mkdirSync(`./data/${directoryName(item)}`, { recursive: true });
};

export const parseImageMarkdown = async (item: UserItem) => {
  // eslint-disable-next-line no-useless-escape
  const imageMarkdowns = item.body.match(/(?:!\[(.*?)\]\((.*?)\))/g);
  if (!imageMarkdowns) return;

  const dirName = directoryName(item);

  const parsedImageMarkdownMaps = await Promise.all(
    imageMarkdowns.map((imageMarkdown, index) => {
      const markdown = imageMarkdown.match(/(\[.*\]|\(.*\))/g);
      const imageTitle = markdown[0].replace(/(\[|\])/g, "");
      const imageUrl = markdown[1].replace(/(\(|\))/g, "");
      const imageExtension = imageUrl.split(".").pop().replace(/\?.*/, "");
      const imageFileName = `${index}-md.${imageExtension}`;

      request({
        url: imageUrl,
        method: "GET",
        encoding: null,
      }).then((image) => {
        fs.writeFileSync(`./data/${dirName}/${imageFileName}`, image, "binary");
      });

      return [imageMarkdown, `![${imageTitle}](${imageFileName})`];
    }),
  );

  parsedImageMarkdownMaps.forEach((imageMarkdownMap) => {
    item.body = item.body.replace(imageMarkdownMap[0], imageMarkdownMap[1]);
  });
};

export const parseImageTag = async (item: UserItem) => {
  const imageTags = item.body.match(/<img .*>/g);
  if (!imageTags) return;

  const dirName = directoryName(item);

  const parsedImageTagMaps = await Promise.all(
    imageTags.map((imageTag, index) => {
      const imageUrl = imageTag.match(/src="\S*\.\S*"/)[0].replace(/(src="|")/g, "");
      const imageExtension = imageUrl.split(".").pop().replace(/\?.*/, "");
      const imageFileName = `${index}-img-tag.${imageExtension}`;

      request({
        url: imageUrl,
        method: "GET",
        encoding: null,
      }).then((image) => {
        fs.writeFileSync(`./data/${dirName}/${imageFileName}`, image, "binary");
      });

      return [imageTag, imageTag.replace(/src="\S*"/, `src="${imageFileName}"`)];
    }),
  );

  parsedImageTagMaps.forEach((imageTagMap) => {
    item.body = item.body.replace(imageTagMap[0], imageTagMap[1]);
  });
};

export const createMarkdown = (item: UserItem) => {
  const dirName = directoryName(item);
  fs.writeFileSync(`./data/${dirName}/README.md`, item.body);
};

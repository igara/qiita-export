import * as qiita from "@src/qiita";

export const exec = async (userName: string, token: string) => {
  const user = await qiita.user(userName, token);
  const pageCount = Math.floor(user.items_count / 100) + 1;

  let userItems: qiita.UserItem[] = [];
  for (let page = 1; page <= pageCount; page++) {
    const items = await qiita.userItems(userName, token, page);
    userItems = [...userItems, ...items];
  }

  await Promise.all(
    userItems.map(async (item) => {
      console.info(item.title);
      qiita.mkdir(item);
      await qiita.parseImageMarkdown(item);
      await qiita.parseImageTag(item);
      await qiita.createMarkdown(item);
    }),
  );

  console.info(" \u001b[32m Success");
};

const userKeyValue = process.argv.join().match(/user=\S*/);
const tokenKeyValue = process.argv.join().match(/token=\S*/);
if (userKeyValue && userKeyValue.length === 1 && tokenKeyValue && tokenKeyValue.length) {
  const userName = userKeyValue[0].replace("user=", "").replace(/,\S*/, "");
  const token = tokenKeyValue[0].replace("token=", "");

  console.info(` export userName:${userName}`);
  exec(userName, token);
} else {
  console.error(' \u001b[31m please "npm run export user=igara token=xxxxxx"');
}

import * as childProcess from "child_process";
import * as fs from "fs";
import * as marked from "marked";

const exec = () => {
  const gitUrl = childProcess.execSync("git config --get remote.origin.url").toString();
  const repositoryName = gitUrl.replace(/(https:\/\/github.com\/|git@github.com:|.git)/g, "");
  console.log(repositoryName);
  const qiitaIDDirectoryNames = fs.readdirSync("data");
  qiitaIDDirectoryNames.forEach((qiitaIDDirectoryName) => {
    const qiitaItemDirectoryNames = fs.readdirSync(`data/${qiitaIDDirectoryName}`);
    qiitaItemDirectoryNames.forEach((qiitaItemDirectoryName) => {
      if (/^\./.test(qiitaItemDirectoryName)) return;

      const markdown = fs.readFileSync(`data/${qiitaIDDirectoryName}/${qiitaItemDirectoryName}/README.md`).toString();
      let html = marked(markdown, {
        // baseUrl: ``,
        // baseUrl: "",
        gfm: false,
      });
      html = html.replace(
        /src="/g,
        `src="https://raw.githubusercontent.com/${repositoryName}/master/data/${qiitaIDDirectoryName}/${qiitaItemDirectoryName}/`,
      );
      fs.writeFileSync(`data/${qiitaIDDirectoryName}/${qiitaItemDirectoryName}/README.html`, html);
    });
  });
};

exec();

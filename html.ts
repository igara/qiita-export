import * as childProcess from "child_process";
import * as fs from "fs";
import * as highlight from "highlight.js";
import * as marked from "marked";

const highlightStyle = fs.readFileSync("./node_modules/highlight.js/styles/railscasts.css", "utf8");
const markdownStyle = fs.readFileSync("./node_modules/github-markdown-css/github-markdown.css", "utf8");
const styleTag = `<style>
${highlightStyle}
${markdownStyle}
</style>`;

const exec = () => {
  const gitUrl = childProcess.execSync("git config --get remote.origin.url").toString();
  const repositoryName = gitUrl.replace(/(https:\/\/github.com\/|git@github.com:|.git)/g, "");

  const qiitaIDDirectoryNames = fs.readdirSync("data");
  qiitaIDDirectoryNames.forEach((qiitaIDDirectoryName) => {
    const qiitaItemDirectoryNames = fs.readdirSync(`data/${qiitaIDDirectoryName}`);
    qiitaItemDirectoryNames.forEach((qiitaItemDirectoryName) => {
      if (/^\./.test(qiitaItemDirectoryName)) return;

      const markdown = fs.readFileSync(`data/${qiitaIDDirectoryName}/${qiitaItemDirectoryName}/README.md`).toString();
      let body = marked(markdown, {
        gfm: true,
        highlight: (code) => {
          return highlight.highlightAuto(code).value;
        },
      });
      body = body.replace(
        /src="/g,
        `src="https://raw.githubusercontent.com/${repositoryName}/master/data/${qiitaIDDirectoryName}/${qiitaItemDirectoryName}/`,
      );

      body = `<div class="markdown-body">
  ${body}
</div>`;

      fs.writeFileSync(`data/${qiitaIDDirectoryName}/${qiitaItemDirectoryName}/README.html`, styleTag + body);
    });
  });
};

exec();

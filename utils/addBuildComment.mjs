import { readFile, writeFile } from "fs/promises";
const pkg = JSON.parse(await readFile("./package.json", "utf-8"));
const build = await readFile(pkg.main, "utf-8");
const buildCommentStripped =
  build.slice(0, 2) === "//" ? build.slice(build.indexOf("\n") + 1) : build;
await writeFile(
  pkg.main,
  `// p-dash v${
    pkg.version
  } ${new Date().toDateString()}\n${buildCommentStripped}`
);

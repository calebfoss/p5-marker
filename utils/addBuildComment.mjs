import { readFile, writeFile } from "fs/promises";
const pkg = JSON.parse(await readFile("./package.json", "utf-8"));
[pkg.main, pkg.min].forEach(async (fileName) => {
  const build = await readFile(fileName, "utf-8");
  const buildCommentStripped =
    build.slice(0, 2) === "//" ? build.slice(build.indexOf("\n") + 1) : build;
  await writeFile(
    fileName,
    `// ${pkg.name} v${pkg.version} ${new Date().toDateString()} ${
      pkg.repository.url
    }\n${buildCommentStripped} `
  );
});

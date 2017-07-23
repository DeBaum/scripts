const path = require("path");
const fs = require("fs");
const pug = require("pug");
const {forEach} = require("lodash");

const templateFile = path.join(__dirname, "post-entry.pug");
const outputDir = path.join(__dirname, "..", "data", "output");
const postEntry = pug.compileFile(templateFile, {pretty: true});

module.exports = function (data) {
  try {
    fs.mkdirSync(outputDir);
  } catch (ignored) {}

  forEach(data, generatePage);
};

/** @param {PostData} row */
function generatePage(row) {
  const fileName = `${row.start.format("YYYY-MM-DD")} - ${row.title.substr(0, 7)}.html`;
  fs.writeFileSync(path.join(outputDir, fileName), postEntry(row));
}
const path = require("path");
const parser = require("./src/parser");
const generator = require("./src/generator");

parser(path.join(__dirname, "data", "events.csv"), function (data) {
  generator(data);
});
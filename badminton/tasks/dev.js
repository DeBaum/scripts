const livereload = require("livereload");
const path = require("path");

const server = livereload.createServer({
  port: 35729,
  exts: "php,css".split(",")
});

const watchPath = path.resolve(__dirname, "..", "src");

server.watch(watchPath);

console.log(`Livereload running, watching ${watchPath}`);
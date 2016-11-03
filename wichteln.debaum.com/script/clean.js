var rmdir = require("rmdir");

module.exports = function (cb) {
  rmdir("data", function () {
    rmdir("dist", cb);
  });
};
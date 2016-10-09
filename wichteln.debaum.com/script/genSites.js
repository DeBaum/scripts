var fs = require("fs");
var jade = require("jade");
var _ = require("lodash");

exports.generate = function () {
  var userTokens = require("../data/userTokens.json");
  var users = require("../data/userList.json");

  var i, shuffledUsers, invalid = true;
  checkValid: do {
    shuffledUsers = _.shuffle(users);
    for (i = 0; i < users.length; i++) {
      if (users[i] === shuffledUsers[i]) {
        continue checkValid;
      }
    }
    invalid = false;
  } while (invalid);

  var template = jade.compileFile("template/page.jade");
  for (i = 0; i < userTokens.length; i++) {
    savePage(userTokens[i].token, template({
      userName: userTokens[i].name,
      partner: shuffledUsers[i]
    }));
  }
  copyRewriteRules();
};

function savePage(name, str) {
  try { fs.mkdirSync("dist"); } catch (ex) {}
  try { fs.mkdirSync("dist/page"); } catch (ex) {}
  
  var fd = fs.openSync("dist/page/" + name + ".html", "w");
  fs.writeSync(fd, str);
  fs.closeSync(fd);
}

function copyRewriteRules() {
  var readStream = fs.createReadStream('template/.htaccess');
  var writeStream = fs.createWriteStream('dist/page/.htaccess');
  readStream.pipe(writeStream);
}
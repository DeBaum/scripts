var fs = require("fs");
var jade = require("jade");
var mailTemplate = jade.compileFile("template/mail.jade", null);

exports.generate = function () {
  var userTokens = require("../data/userTokens.json");

  for (var i = 0; i < userTokens.length; i++) {
    var user = userTokens[i];
    saveMail(user.name, mailTemplate(user));
  }
};

function saveMail(name, str) {
  try { fs.mkdirSync("dist"); } catch (ex) {}
  try { fs.mkdirSync("dist/mail"); } catch (ex) {}
  
  var fd = fs.openSync("dist/mail/" + name + ".html", "w");
  fs.writeSync(fd, str);
  fs.closeSync(fd);
}
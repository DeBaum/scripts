var fs = require("fs");
var names = require("./names.json");

exports.generate = function () {
  var list = [];

  for (var i = 0; i < names.length; i++) {
    list.push({
      name: names[i],
      token: genToken()
    });
  }

  try { fs.mkdirSync("data"); } catch (ex) {}
  
  var fd = fs.openSync("data/userTokens.json", "w");
  fs.writeSync(fd, JSON.stringify(list));
  fs.closeSync(fd);

  fd = fs.openSync("data/userList.json", "w");
  fs.writeSync(fd, JSON.stringify(names));
  fs.closeSync(fd);
};

function genToken() {
  var str = "";
  var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  for (var i = 0; i < 6; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return str;
}
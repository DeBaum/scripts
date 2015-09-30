var fs = require('fs');
var jade = require('jade');
var mailTemplate = jade.compileFile('template/mail.jade');
var users = require('../data/userTokens.json');

exports.generate = function () {
    for (var i = 0; i < users.length; i++) {
        var user = users[i];
        saveMail(user.name, mailTemplate(user));
    }
};

function saveMail(name, str) {
    var fd = fs.openSync('dist/mail/' + name + '.html', 'w');
    fs.writeSync(fd, str);
    fs.closeSync(fd);
}
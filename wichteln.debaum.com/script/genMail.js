var fs = require('fs');
var jade = require('jade');
var mailTemplate = jade.compileFile('template/mail.jade');

exports.generate = function () {
    var userTokens = require('../data/userTokens.json');

    for (var i = 0; i < userTokens.length; i++) {
        var user = userTokens[i];
        saveMail(user.name, mailTemplate(user));
    }
};

function saveMail(name, str) {
    var fd = fs.openSync('dist/mail/' + name + '.html', 'w');
    fs.writeSync(fd, str);
    fs.closeSync(fd);
}
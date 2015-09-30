var fs = require('fs');
var jade = require('jade');
var _ = require('lodash');

exports.generate = function () {
    var userTokens = require('../data/userTokens.json');
    var users = require('../data/userList.json');

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

    var template = jade.compileFile('template/page.jade');
    for (i = 0; i < userTokens.length; i++) {
        savePage(userTokens[i].token, template({
            userName: userTokens[i].name,
            partner: shuffledUsers[i]
        }));
    }
};

function savePage(name, str) {
    var fd = fs.openSync('dist/page/' + name + '.html', 'w');
    fs.writeSync(fd, str);
    fs.closeSync(fd);
}
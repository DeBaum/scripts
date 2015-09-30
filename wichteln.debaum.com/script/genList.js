var fs = require('fs');
var names = 'Ludwig, Claudia, Dustin, Eileen, Madlen, Maria, Reyna, Martin, Lisa, Rebecca, Tristan'.split(', ');

exports.generate = function () {
    var list = [];

    for (var i = 0; i < names.length; i++) {
        list.push({
            name: names[i],
            token: genToken()
        });
    }

    var fd = fs.openSync('data/userTokens.json', 'w');
    fs.writeSync(fd, JSON.stringify(list));
    fs.closeSync(fd);

    fd = fs.openSync('data/userList.json', 'w');
    fs.writeSync(fd, JSON.stringify(names));
    fs.closeSync(fd);
};

function genToken() {
    var str = '';
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    for (var i = 0; i < 6; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return str;
}
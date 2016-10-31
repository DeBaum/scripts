const Dictionary  = require("./Dictionary");
const Generator = require("./Generator");

let gerDict = new Dictionary("German");

let generator = new Generator(gerDict);

for (var i = 0; i < 20; i++) {
  console.log("New Password:", generator.generatePassword());
}

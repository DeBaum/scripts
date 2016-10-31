"use strict";
const Dictionary_1 = require("./Dictionary");
const Generator_1 = require("./Generator");
let gerDict = new Dictionary_1.default("German");
let generator = new Generator_1.default(gerDict);
generator.capitalisation = Generator_1.Capitalisation.CAMEL_CASE;
for (var i = 0; i < 20; i++) {
    console.log("New Password:", generator.generatePassword());
}

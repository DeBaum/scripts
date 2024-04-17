const { WordList } = require("./WordList");
const {Generator, Capitalisation} = require("./Generator");

let deList = new WordList("top10000de.txt", 8);
let enList = new WordList("top10000en.txt", 8);

let generator = new Generator(deList, enList);
generator.capitalisation = Capitalisation.CAMEL_CASE;
generator.wordCount = 4;

console.debug("");
const passwordCount = 100;
for (var i = 0; i < passwordCount; i++) {
    console.log(i + 1, generator.generatePassword());
}

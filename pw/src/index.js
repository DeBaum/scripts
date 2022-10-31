const {Dictionary} = require("./Dictionary");
const {Generator, Capitalisation} = require("./Generator");

let gerDict = new Dictionary("German_de_DE", 8);
let engDict = new Dictionary("English (American)", 8);

let generator = new Generator(gerDict, engDict);
generator.capitalisation = Capitalisation.CAMEL_CASE;
generator.wordCount = 4;

const keySpace = Math.pow(generator.dictionaryLength, generator.wordCount);
const crackingSpeed = Math.pow(10, 12); // 1 billion / sec
console.debug(generator.dictionaryLength, "dictionary entries ^", generator.wordCount, "words =", keySpace.toExponential(3), "possibilities");
const crackingDurationYears = Math.round(keySpace / crackingSpeed / 60 / 60 / 24 / 365 * 100) / 200; // additional division by 2: average seached keyspace
console.debug("brute force duration:", crackingDurationYears, "years @", crackingSpeed.toExponential(), "tries per second")

const passwordCount = 40;
console.debug("generating", passwordCount, "passwords:\n");
for (var i = 0; i < passwordCount; i++) {
    console.log(i, generator.generatePassword());
}

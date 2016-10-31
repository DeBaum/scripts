"use strict";
(function (Capitalisation) {
    Capitalisation[Capitalisation["NATURAL_CASE"] = 0] = "NATURAL_CASE";
    Capitalisation[Capitalisation["UPPER_CASE"] = 1] = "UPPER_CASE";
    Capitalisation[Capitalisation["LOWER_CASE"] = 2] = "LOWER_CASE";
    Capitalisation[Capitalisation["CAMEL_CASE"] = 3] = "CAMEL_CASE";
    Capitalisation[Capitalisation["SNAKE_CASE"] = 4] = "SNAKE_CASE";
    Capitalisation[Capitalisation["KEBAB_CASE"] = 5] = "KEBAB_CASE";
})(exports.Capitalisation || (exports.Capitalisation = {}));
var Capitalisation = exports.Capitalisation;
class Generator {
    constructor(...dictionaries) {
        this.dictionaries = dictionaries;
        this.options = {
            length: 4,
            capitalisation: Capitalisation.NATURAL_CASE
        };
    }
    static random(maxExclusive) {
        return Math.floor(Math.random() * maxExclusive);
    }
    set length(value) {
        this.options.length = value;
    }
    get length() {
        return this.options.length;
    }
    set capitalisation(value) {
        if (value >= 0 && value <= 5)
            this.options.capitalisation = value;
    }
    get capitalisation() {
        return this.options.capitalisation;
    }
    generatePassword() {
        let pw = [], dictIndex, wordIndex, dictionary;
        for (let i = 0; i < this.options.length; i++) {
            dictIndex = Generator.random(this.dictionaries.length);
            dictionary = this.dictionaries[dictIndex];
            wordIndex = Generator.random(dictionary.length);
            pw.push(dictionary.getWord(wordIndex));
        }
        return this.formatPassword(pw);
    }
    formatPassword(words) {
        switch (this.options.capitalisation) {
            case Capitalisation.NATURAL_CASE:
                return words.join("");
            case Capitalisation.UPPER_CASE:
                return words.join("").toUpperCase();
            case Capitalisation.LOWER_CASE:
                return words.join("").toLowerCase();
            case Capitalisation.CAMEL_CASE:
                return words.map((w) => w.replace(/^./, (m) => m.toUpperCase())).join("");
            case Capitalisation.SNAKE_CASE:
                return words.join("_");
            case Capitalisation.KEBAB_CASE:
                return words.join("-");
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Generator;

module.exports = {
    Capitalisation: {
        NATURAL_CASE: 0,
        UPPER_CASE: 1,
        LOWER_CASE: 2,
        CAMEL_CASE: 3,
        SNAKE_CASE: 4,
        KEBAB_CASE: 5,
    },
    Generator: class Generator {
        constructor(...dictionaries) {
            this.dictionaries = dictionaries;
            this.options = {
                wordCount: 4,
                capitalisation: module.exports.Capitalisation.NATURAL_CASE
            };
        }

        static random(maxExclusive) {
            return Math.floor(Math.random() * maxExclusive);
        }

        set wordCount(value) {
            this.options.wordCount = value;
        }
        get wordCount() {
            return this.options.wordCount;
        }

        get dictionaryLength() {
            return this.dictionaries.reduce((sum, d) => sum + d.length, 0);
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
            for (let i = 0; i < this.options.wordCount; i++) {
                dictIndex = Generator.random(this.dictionaries.length);
                dictionary = this.dictionaries[dictIndex];
                wordIndex = Generator.random(dictionary.length);
                pw.push(dictionary.getWord(wordIndex));
            }
            return this.formatPassword(pw);
        }

        formatPassword(words) {
            switch (this.options.capitalisation) {
                case module.exports.Capitalisation.NATURAL_CASE:
                    return words.join("");
                case module.exports.Capitalisation.UPPER_CASE:
                    return words.join("").toUpperCase();
                case module.exports.Capitalisation.LOWER_CASE:
                    return words.join("").toLowerCase();
                case module.exports.Capitalisation.CAMEL_CASE:
                    return words.map((w) => w.replace(/^./, (m) => m.toUpperCase())).join("");
                case module.exports.Capitalisation.SNAKE_CASE:
                    return words.join("_");
                case module.exports.Capitalisation.KEBAB_CASE:
                    return words.join("-");
            }
        }
    }
};

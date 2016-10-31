class Generator {
  static random(maxExclusive) {
    return Math.floor(Math.random() * maxExclusive);
  }

  static get Capitalisation() {
    return {
      NATURAL_CASE: 0,
      UPPER_CASE: 1,
      LOWER_CASE: 2,
      CAMEL_CASE: 3,
      SNAKE_CASE: 4,
      KEBAB_CASE: 5,
    }
  }

  constructor(...dictionaries) {
    this.dictionaries = dictionaries;
    this.options = {
      length: 4,
      capitalisation: Generator.Capitalisation.NATURAL_CASE
    }
  }

  //<editor-fold desc="Generator-Options getter & setter">
  set length(value) {
    this.options.length = value;
  }

  get length() {
    return this.options.length;
  }

  set capitalisation(value) {
    if (value >= 0 && value <= 5) this.options.capitalisation = value;
  }

  get capitalisation() {
    return this.options.capitalisation
  }
  //</editor-fold>

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
      case Generator.Capitalisation.NATURAL_CASE:
        return words.join("");
      case Generator.Capitalisation.UPPER_CASE:
        return words.join("").toUpperCase();
      case Generator.Capitalisation.LOWER_CASE:
        return words.join("").toLowerCase();
      case Generator.Capitalisation.CAMEL_CASE:
        return words.map((w) => w.replace(/^./, (m) => m.toUpperCase())).join("");
      case Generator.Capitalisation.SNAKE_CASE:
        return words.join("_");
      case Generator.Capitalisation.KEBAB_CASE:
        return words.join("-");
    }
  }
}

module.exports = Generator;

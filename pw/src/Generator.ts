import Dictionary from "./Dictionary";

export enum Capitalisation {
  NATURAL_CASE = 0,
  UPPER_CASE = 1,
  LOWER_CASE = 2,
  CAMEL_CASE = 3,
  SNAKE_CASE = 4,
  KEBAB_CASE = 5,
}

export default class Generator {
  static random(maxExclusive: number): number {
    return Math.floor(Math.random() * maxExclusive);
  }

  dictionaries: Dictionary[];
  options: {
    length: number,
    capitalisation: Capitalisation
  };

  constructor(...dictionaries: Dictionary[]) {
    this.dictionaries = dictionaries;
    this.options = {
      length: 4,
      capitalisation: Capitalisation.NATURAL_CASE
    }
  }

  //<editor-fold desc="Generator-Options getter & setter">
  set length(value: number) {
    this.options.length = value;
  }

  get length(): number {
    return this.options.length;
  }

  set capitalisation(value: Capitalisation) {
    if (value >= 0 && value <= 5) this.options.capitalisation = value;
  }

  get capitalisation(): Capitalisation {
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

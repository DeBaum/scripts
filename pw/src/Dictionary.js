const fs = require("fs");

class Dictionary {
  constructor(dictName) {
    this.words = [];
    this.dictName = dictName;
    this.loadWords()
  }
  loadWords() {
    const fileContent = fs.readFileSync(`node_modules/dictionaries/${this.dictName}.dic`);
    this.words = fileContent.toString().split("\r\n");

    let startIndex = 1;
    while (this.words[startIndex].startsWith("#") || this.words[startIndex] == "") {
      startIndex++;
    }
    this.words = this.words.slice(startIndex);

    for (let i = 0; i < this.words.length; i++) {
      this.words[i] = this.words[i].replace(/\/.*$/, "");
    }
  }

  get length() {
    return this.words.length;
  }

  getWord(index) {
    return this.words[index];
  }

}

module.exports = Dictionary;

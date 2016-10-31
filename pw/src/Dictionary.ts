import fs = require("fs");

export default class Dictionary {
  words = [];
  dictName: string;

  constructor(dictName) {
    this.dictName = dictName;
    this.loadWords();
    console.log("Dictionary");
  }

  loadWords(): void {
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

  getWord(index: number): string {
    return this.words[index];
  }

}

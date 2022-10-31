const fs = require("fs");

module.exports = {
    Dictionary: class Dictionary {
        constructor(dictName, maxLength = 99) {
            this.dictName = dictName;
            this.maxLength = maxLength;
            this.words = [];
            this.loadWords();
            
            const charCountMessage = this.maxLength == 99 ? "" : "(max " + maxLength + " characters)"
            console.debug("loaded dictionary", this.dictName, "with", this.words.length, "words", charCountMessage);
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
                if (this.words[i].length > this.maxLength)  this.words[i] = "";
            }

            this.words = this.words.filter(w => w.length > 0);
        }

        get length() {
            return this.words.length;
        }

        getWord(index) {
            return this.words[index];
        }
    }
}

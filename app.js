'use strict'

const readline = require('readline'),
  fs = require('fs'),
  dataFile = './data.dat'; // Todo: pass as argument

class parser {
  constructor() {
    this.o = {};
    this.parseDataFile()
      .then(results => {
        console.log(results);
      })
  }

  /**
   * Parse a single line from the Assembla data file and convert to JSON properties
   * @param {string} line 
   */
  processLine(line) {
    let self=this;
    line = this.cleanString(line);
    let tokenPattern = /^(..\w*)(:?)(\w*),(.*)$/gm;
    let tokenObj = tokenPattern.exec(line);
    if (tokenObj[2] !== ':') {
      // Regular line
      let row = JSON.parse((tokenObj[4]));
      self.o[tokenObj[1]].data.push(row);
    } else {
      // Header line
      self.o[tokenObj[1]] = {
        header: JSON.parse(tokenObj[4]), data: []
      };
    }
  }

  /**
   * Wraps readLine around the Assembla data file and calls this.processLine for each line read
   */
  parseDataFile() {
    let self = this;
    return new Promise(function (resolve, reject) {
      const rl = readline.createInterface({
        input: fs.createReadStream(dataFile)
      });

      rl.on('line', (line) => {
        self.processLine(line);
      });

      rl.on('close', () => {
        resolve(self.o);
      });
    });
  }

  /**
   * Our file contains some funky hi-order characters we don't need to preserve so we brute force them to lo-order
   * @param {string} input 
   */
  cleanString(input) {
    var output = "";
    for (var i = 0; i < input.length; i++) {
      if (input.charCodeAt(i) <= 127) {
        output += input.charAt(i);
      }
    }
    return output;
  }
}

(function () {
  new parser();
})();

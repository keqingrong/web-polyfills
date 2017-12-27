/**
 * Modify version
 */
const fs = require('fs');
const POLYFILLS_VERSION = require('./package.json').version;
const filePath = [
  './lib/js/polyfills.js'
];

function defineVar(filePath, callback) {
  fs.stat(filePath, (err, stats) => {
    if (err) {
      console.error('Need to run "npm run build"');
      throw err;
    }
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        throw err;
      }
      const result = data
        .replace(/POLYFILLS_VERSION/g, JSON.stringify(POLYFILLS_VERSION));
      fs.writeFile(filePath, result, 'utf8', (err) => {
        if (err) {
          throw err;
        }
        callback();
      });
    });
  });
}

const promises = [];
filePath.forEach(function (item) {
  promises.push(new Promise((resolve, reject) => {
    defineVar(item, function () {
      resolve();
    });
  }));
});

Promise.all(promises).then(function () {
  console.log('Update web-polyfills\'s version successfully!\n');
  console.log('Now you can run "npm publish" to publish web-polyfills to NPM repository.\n');
  process.exit();
});

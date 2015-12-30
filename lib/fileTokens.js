const fs = require('fs');
const es = require('event-stream');
const stripComments = require('./helpers/stripComments');

module.exports = function(file, language) {
  return new Promise((resolve, reject) => {
    let langData = require('./../language_data/' + language + '.json');
    let keywords = new Map();
    let identifiers = new Set();
    let langKeywords = new Set();
    let langIdentifiers = new RegExp(langData.identifier, 'gm');
    langData.keywords.forEach(keyword => {
      langKeywords.add(keyword);
      keywords.set(keyword,0);
    });

    fs.createReadStream(file, {encoding: 'utf8'})
      .on('error', function(err) {
        reject(err);
      })
      .pipe(stripComments[langData.comments.multi]())
      .pipe(stripComments[langData.comments.single]())
      .pipe(es.split(/\s+/))
      .pipe(es.through(function(data) {
        let matches = null;
        if(langKeywords.has(data)) {
          keywords.set(data, keywords.get(data) + 1);
        } else if((matches = data.match(langIdentifiers)) !== null) {

          matches.forEach(match => {

            if(!langKeywords.has(match)) {
              identifiers.add(match);
            }
            else keywords.set(match, keywords.get(match) + 1);
          });
        }
      }))
      .on('end', function() {
        resolve({keywords, identifiers});
      });

  });
};

'use strict';
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const writeFile = require('write-file-atomic').sync;

const alphabet = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ];

function getUrl(letter) {
    return `http://www.cornishdictionary.org.uk/cornish/alpha/${letter}/?items_per_page=All`
}

let dictionary = [];

const requests = alphabet.map((letter, i) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            fetch(getUrl(letter))
                .then(res => res.text())
                .then(body => {
                    const $ = cheerio.load(body);
                    const $td = $('.view-content td');
                    $td.each((i, el) => {
                        const $el = cheerio(el);
                        const cornish = $el.find('.views-field-title').text().trim();
                        const english = $el.find('.views-field-field-english1').text().trim();
                        const entry = {
                            cornish: cornish,
                            english: english || cornish,
                        };
                        if (entry.cornish.length && entry.english.length) {
                            dictionary.push(entry);
                        }
                    });
                })
                .then(() => {
                    console.log(letter, 'done')
                    res();
                })
                .catch(err => console.log('error ', err));
        }, 1000 * i);
    });
});

Promise.all(requests).then(() => {
    let text = 'module.exports = ' + JSON.stringify(dictionary);
    writeFile('index.js', text, function (err) {
        if (err) throw err;
        console.log('It\'s saved!');
    });
});

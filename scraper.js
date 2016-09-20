'use strict';
const Ora = require('ora');
const fetch = require('node-fetch');
const queue = require('async/queue');
const cheerio = require('cheerio');
const sortby = require('lodash.sortby');
const writeFile = require('write-file-atomic').sync;

const baseurl = 'http://www.cornishdictionary.org.uk';
const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
let dictionary = [];

function getUrl(letter, page) {
    page = page || 0;
    return `${baseurl}/cornish/alpha/${letter}/?items_per_page=128&page=${page}`
}

const spinner = new Ora('Starting...').start();

const q = queue(function processURL (url, done) {
    spinner.text = `Fetching ${url.match(/alpha\/([a-z])/)[1]} page ${url.match(/page=([0-9]+)$/)[1]}`;
    fetch(url, { timeout: 0 })
        .then(res => res.text())
        .then(body => {
            const $ = cheerio.load(body);
            const $td = $('.view-content td');
            try {
                const $next = $('.pager-next a');
                if ($next.length) {
                    q.push(`${baseurl}${$next.attr('href')}`);
                }
            } catch (e) {}
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
            return done();
        })
        .catch((err) => {
            spinner.color = 'red';
            spinner.stopAndPersist('✖');
            console.log(url, err);
        })
}, 1);

q.drain = function done () {
    dictionary = sortby(dictionary, ['cornish', 'english']);
    let text = 'module.exports = ' + JSON.stringify(dictionary);
    writeFile('index.js', text);
    spinner.text = 'File written';
    spinner.succeed();
};

alphabet.forEach(letter => q.push(getUrl(letter)));

q.process();



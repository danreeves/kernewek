import test from 'ava';
import kernowek from './index.js';

const alphaNoQ = 'abcdefghijklmnoprstuvwxyz'.split('');

test('dictionary is alphabetic in cornish', t => {
    t.is(kernowek[0].cornish[0].toLowerCase(), 'a');
    t.is(kernowek[kernowek.length - 1].cornish[0].toLowerCase(), 'z');
});

// Apparently there are no cornish words starting with Q
test('dictionary contains every letter (except q)', t => {
    alphaNoQ.forEach(letter => {
        const filtered = kernowek.filter(word => word.cornish.toLowerCase().indexOf(letter) === 0);
        t.true(filtered.length > 0);
    });
});

test('dictionary is array', t => {
    t.true(Array.isArray(kernowek));
});

test('every word has both cornish and english', t => {
    kernowek.forEach(word => {
        t.true('cornish' in word);
        t.true('english' in word);
        t.true(word.cornish.length > 0);
        t.true(word.english.length > 0);
    });
});

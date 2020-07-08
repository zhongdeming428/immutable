const { Suite } = require('benchmark');
const TrieList = require('../dist/index').TrieList;

const suite1 = new Suite();

suite1
  .add(`create trie list`, () => {
    const list = new TrieList();
  })
  .add(`create array`, () => {
    const arr = [];
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', () => {
    console.log('Fastest is ' + suite1.filter('fastest').map('name'));
  })
  .run({ 'async': false }); // run async

const suite2 = new Suite();
let a = [],
  b = new TrieList();
suite2
  .add(`trie list push`, () => {
    b = b.pushBack(1);
    b = b.removeBack();
  })
  .add(`array push`, () => {
    a.push(1);
    a.pop();
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', () => {
    console.log('Fastest is ' + suite2.filter('fastest').map('name'));
  })
  .run({ 'async': false }); // run async
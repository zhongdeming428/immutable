const { Suite } = require('benchmark');
const TrieList = require('../dist/index').TrieList;

const suite1 = new Suite();

const trieList = new TrieList(null, 2 ** 32 - 1);

suite1
  .add(`set 10`, () => {
    trieList.set(10, 1);
  })
  .add(`set 100`, () => {
    trieList.set(100, 1);
  })
  .add(`set 1000`, () => {
    trieList.set(1000, 1);
  })
  .add(`set 10000`, () => {
    trieList.set(10000, 1);
  })
  .add(`set 100000`, () => {
    trieList.set(100000, 1);
  })
  .add(`set 1000000`, () => {
    trieList.set(1000000, 1);
  })
  .add(`set 10000000`, () => {
    trieList.set(100000, 1);
  })
  .add(`set 100000000`, () => {
    trieList.set(1000000, 1);
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
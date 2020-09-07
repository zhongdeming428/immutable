const { Suite } = require('benchmark');
const { List } = require('immutable');

const suite1 = new Suite();

const list = new List();

suite1
  .add(`set 10`, () => {
    list.set(10, 1);
  })
  .add(`set 100`, () => {
    list.set(100, 1);
  })
  .add(`set 1000`, () => {
    list.set(1000, 1);
  })
  .add(`set 10000`, () => {
    list.set(10000, 1);
  })
  .add(`set 100000`, () => {
    list.set(100000, 1);
  })
  .add(`set 1000000`, () => {
    list.set(1000000, 1);
  })
  .add(`set 10000000`, () => {
    list.set(100000, 1);
  })
  .add(`set 100000000`, () => {
    list.set(1000000, 1);
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', () => {
    console.log('Fastest is ' + suite1.filter('fastest').map('name'));
  })
  .run({ 'async': false }); // run async
import { TrieList } from "../index";

describe(`run`, () => {
  const list = new TrieList();

  it(`can pushBack`, () => {
    const newList1 = list.pushBack(123);
    expect(list).toBeTruthy();
    expect(newList1.length).toBe(1);
    const newList2 = newList1.pushBack(321);
    expect(newList2.length).toBe(2);
    const newList3 = newList1.pushBack(333);
    expect(newList3.length).toBe(2);
    const newList4 = list.pushBack(1, 2, 3);
    expect(newList4.get(0)).toEqual(1);
    expect(newList4.get(1)).toEqual(2);
    expect(newList4.get(2)).toEqual(3);
  });
  it(`can get`, () => {
    let newList = list.pushBack("123").pushBack(321);
    const item0 = newList.get(0);
    const item1 = newList.get(1);
    expect(item0).toEqual("123");
    expect(item1).toEqual(321);
    newList = newList.pushBack(456);
    const item2 = newList.get(2);
    expect(item2).toEqual(456);
    expect(newList.length).toEqual(3);
  });
  it(`can set`, () => {
    const newList = list.pushBack("123").pushBack("333");
    expect(newList.length).toEqual(2);
    expect(newList.get(0)).toEqual("123");
    expect(newList.get(0)).not.toEqual(123);
    const newList1 = newList.set(1, "321");
    expect(newList1.length).toStrictEqual(2);
    expect(newList1.get(1)).toEqual("321");
    expect(newList1.get(1)).not.toEqual(321);
  });
  it(`can iterate`, () => {
    const res = [];
    const newList = list.pushBack(1).pushBack(2).pushBack(3);
    newList.forEach((val) => {
      res.push(val);
    });
    expect(res).toEqual([1, 2, 3]);
    expect(res.length === 3);
  });
  it(`can removeBack`, () => {
    const newList = list.pushBack(1).pushBack(2).removeBack();
    expect(newList.length === 1).toBeTruthy();
    expect(newList.get(0) === 1).toBeTruthy();
    let newList1 = list.pushBack(1 ,2 ,3);
    newList1 = newList1.removeBack();
    expect(newList1.length === 2 && newList1.get(1) === 2).toBeTruthy();
    newList1 = newList1.removeBack();
    expect(newList1.length === 1 && newList1.get(0) === 1).toBeTruthy();
  });
  it(`can persist`, () => {
    const obj1 = {};
    const obj2 = [];
    const obj3 = new Date();
    const newList1 = list.pushBack(obj1, obj2, obj3);
    const newList2 = newList1.set(1, [1]);
    expect(newList1.get(0) === newList2.get(0)).toBeTruthy();
    expect(newList1.get(2) === newList2.get(2)).toBeTruthy();
    expect(newList2.get(1) === newList1.get(1)).toBeFalsy();
    expect(newList1.get(1)).toEqual([]);
    expect(newList2.get(1)).toEqual([1]);
  });
  it(`test large data`, () => {
    let newList = new TrieList<number>();
    for (let i = 0; i < 10000; i++) {
      newList = newList.pushBack(i);
    }
    expect(newList.length).toEqual(10000);
    for (let i = 0; i < 10000; i++) {
      expect(newList.get(i)).toEqual(i);
    }
    expect(newList.get(9999) === 9999).toBeTruthy();
    expect(newList.set(9999, 1).get(9999)).toEqual(1);

    let newList2 = new TrieList<number>();
    const arr = [];
    for (let i = 0; i < 10000; i++) {
      const num = Math.random();
      arr.push(num);
      newList2 = newList2.pushBack(num);
    }
    console.log(JSON.stringify(newList2))
    for (let i = 0; i < 10000; i++) {
      expect(arr[i] === newList2.get(i)).toBeTruthy();
    }
  });
});

import { NODE_SIZE, SHIFT } from './utils/constants';
import { setNodeInTrie, getNodeInTrie, makeList } from './utils/index';

/**
 * TODO:
 * -  splice
 * -  slice
 * -  shift/unshift
 * -  reduce
 * -  tail 优化
 * -  transients 优化
 */
export class TrieNode<T = unknown> {
  private nodeArr: Array<T | TrieNode<T>>;
  constructor(arr?: Array<T | TrieNode<T>>) {
    if (arr) {
      this.nodeArr = [...arr];
    } else {
      this.nodeArr = new Array(NODE_SIZE);
    }
  }

  clone(): TrieNode<T> {
    return new TrieNode(this.nodeArr);
  }

  set(idx: number, value: T | TrieNode<T>) {
    this.nodeArr[idx] = value;
  }

  get(idx: number): T | undefined | TrieNode<T> {
    return this.nodeArr[idx];
  }
}

export class TrieList<T = any> {
  private head = {
    level: SHIFT,
    len: 0,
    root: new TrieNode<T>(),
    maxSize: 1 << (SHIFT * SHIFT)
  };

  constructor(root?: TrieNode<T>, len?: number) {
    if (root)
      this.head.root = root;
    if (len)
      this.head.len = len;
  }

  public get length(): number {
    return this.head.len;
  }

  public get level(): number {
    return this.head.level;
  }

  public get root() {
    return this.head.root;
  }

  get(idx: number): T | undefined {
    if (idx > this.head.len - 1 || idx < 0) return;
    return getNodeInTrie<T>(this.root, idx, this.level) as (T | undefined);
  }

  set(idx: number, value: T): TrieList<T> {
    if (idx < 0 || idx > this.length) return;
    const newRoot = setNodeInTrie<T>(this.root, idx, this.level, value);
    const newList = makeList(newRoot, idx === this.length ? this.length + 1 : this.length);
    return newList;
  }

  pushBack(value: T): TrieList<T> {
    if (this.head.len > this.head.maxSize) 
      throw new Error('Exceeded the max size of list!');
    const idx = this.length;
    return this.set(idx, value);
  }

  removeBack(): TrieList<T> {
    // TODO:
    const idx = this.length;
    const newList = this.set(idx - 1, undefined);
    newList.head.len -= 1;
    return newList;
  }

  forEach(callback: (value: T, idx: number, list: TrieList) => void, ctx?: {}) {
    const len = this.head.len;
    for (let i = 0; i < len; i++) {
      callback.call(ctx, this.get(i), i, this);
    }
  }

  map<K>(callback: (value: T, idx: number, list: TrieList) => K, ctx?: {}): Array<K> {
    const result = [];
    this.forEach((value, idx, list) => {
      const res = callback.call(ctx, value, idx, list);
      result.push(res);
    });
    return result;
  }

  toArray(): Array<T> {
    return this.map(v => v);
  }
}

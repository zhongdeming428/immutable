import { NODE_SIZE, SHIFT } from './utils/constants';
import { setNodeInTrie, getNodeInTrie, makeList, getTailOffset } from './utils/index';

/**
 * TODO:
 * -  TrieNode 长度控制
 * -  tail 优化
 * -  transients 优化
 */
export class TrieNode<T = unknown> {
  private nodeArr: Array<T | TrieNode<T>>;
  constructor(arr?: Array<T | TrieNode<T>>) {
    if (arr) {
      this.nodeArr = [...arr.slice(0, NODE_SIZE)];
    } else {
      this.nodeArr = [];
    }
  }

  public get length() {
    return this.nodeArr.length;
  }

  clone(): TrieNode<T> {
    return new TrieNode(this.nodeArr);
  }

  set(idx: number, value: T | TrieNode<T>) {
    if (idx > NODE_SIZE - 1) return;
    if (idx === this.length && value === undefined) 
      this.nodeArr.length -= 1;
    this.nodeArr[idx] = value;
  }

  get(idx: number): T | undefined | TrieNode<T> {
    return this.nodeArr[idx];
  }

  toArray(): Array<T> {
    return this.nodeArr as Array<T>;
  }
}

export class TrieList<T = any> {
  static readonly maxSize = 1 << (SHIFT * SHIFT);
  private head = {
    level: SHIFT,
    len: 0,
    root: new TrieNode<T>(),
    tail: null as TrieNode<T>
  };

  constructor(root?: TrieNode<T>, len?: number) {
    root && (this.head.root = root);
    len && (this.head.len = len);
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
    if (idx > this.length - 1 || idx < 0) return;
    const tailOffset = getTailOffset(this.length);
    if (idx < tailOffset) {
      return getNodeInTrie<T>(this.root, idx, this.level) as (T | undefined);
    } else {
      return this.head.tail.get(idx - tailOffset) as (T | undefined);
    }
  }

  set(idx: number, value: T): TrieList<T> {
    if (idx < 0 || idx > this.length) return;
    const tailOffset = getTailOffset(this.length);
    const newLength = idx === this.length ? this.length + 1 : this.length;
    if (idx < tailOffset) {
      const newRoot = setNodeInTrie<T>(this.root, idx, this.level, value);
      const newList = makeList(newRoot, newLength);
      return newList;
    } else {
      if ((this.head.tail?.length ?? 0) < NODE_SIZE) {
        const newTail = this.head.tail?.clone() ?? new TrieNode();
        newTail.set(idx - tailOffset, value);
        const newList = makeList(this.root, newLength);
        newList.head.tail = newTail;
        return newList;
      } else {
        const newRoot = setNodeInTrie<T>(this.root, tailOffset, this.level, this.head.tail, 1);
        const newList = makeList(newRoot, newLength);
        return newList.set(idx, value);
      }
    }
  }
  pushBack(this: TrieList<T>, ...values: Array<T>): TrieList<T> {
    if (this.length > TrieList.maxSize) 
      throw new Error('Exceeded the max size of list!');

    let newList = this;

    for (let idx = 0; idx < values.length; idx++) {
      const offset = idx + this.length;
      newList = newList.set(offset, values[idx]);
    }
    return newList;
  }

  removeBack(): TrieList<T> {
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
    const result: Array<K> = [];
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

import { NODE_SIZE, SHIFT } from './utils/constants';
import { setNodeInTrie, getNodeInTrie, makeList, getTailOffset, OwnerID } from './utils/index';

/**
 * TODO:
 * -  transients 优化: 在每个 trienode 上加 ownerID
 */
export class TrieNode<T = unknown> {
  private nodeArr: Array<T | TrieNode<T>>;
  public ownerID: OwnerID;
  constructor(arr?: Array<T | TrieNode<T>>) {
    if (arr) {
      this.nodeArr = arr.slice(0, NODE_SIZE);
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
    if (idx === this.length && value === undefined) {
      this.nodeArr.length > 0 && (this.nodeArr.length -= 1);
      return;
    }
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
  public __ownerID: OwnerID;
  public __altered = false;
  public length = 0;
  public level = SHIFT;
  public root = new TrieNode<T>();
  public tail = null as TrieNode<T>;

  private get tailOffset() {
    return getTailOffset(this.length);
  }

  get(idx: number): T | undefined {
    if (idx > this.length - 1 || idx < 0) return;
    if (idx < this.tailOffset) {
      return getNodeInTrie<T>(this.root, idx, this.level) as (T | undefined);
    } else {
      return this.tail.get(idx - this.tailOffset) as (T | undefined);
    }
  }

  set(idx: number, value: T): TrieList<T> {
    if (idx < 0 || idx > this.length) return;
    const newLength = idx === this.length ? this.length + 1 : this.length;
    if (idx < this.tailOffset) {
      const newRoot = setNodeInTrie<T>(this.root, idx, this.level, value);
      const newList = makeList(newRoot, newLength, this.tail);
      return newList;
    } else {
      if ((this.tail?.length ?? 0) < NODE_SIZE) {
        const newTail = this.tail?.clone() ?? new TrieNode();
        newTail.set(idx - this.tailOffset, value);
        const newList = makeList(this.root, newLength, newTail);
        return newList;
      } else {
        const newRoot = setNodeInTrie<T>(this.root, this.tailOffset, this.level, this.tail, 1);
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
    newList.length -= 1;
    return newList;
  }

  forEach(callback: (value: T, idx: number, list: TrieList) => void, ctx?: {}) {
    const len = this.length;
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

  asMutable() {
    return this.__ownerID ? this : makeList(this.root, this.length, this.tail, new OwnerID());
  }

  withMutations(fn: (list: TrieList) => TrieList) {
    const mutable = this.asMutable();
    fn(mutable);
    if (!mutable.__altered) {
      return this;
    }
    if (!this.__ownerID) {
      mutable.__altered = false;
      mutable.__ownerID = this.__ownerID;
      return mutable;
    }
    return mutable.__ownerID === this.__ownerID ?
      mutable :
      makeList(this.root, this.length, this.tail);
  }
}

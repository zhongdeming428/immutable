import { SHIFT, MASK, NODE_SIZE } from './constants';
import { TrieNode, TrieList } from '../index';

/**
 * 针对 idx 索引，获取其路径上某个 level 的 node
 * @param node 
 * @param idx 
 * @param curLevel 
 */
export function getNodeInTrie<T>(node: TrieNode, idx: number, curLevel: number): TrieNode<T> | T | undefined {
  let level = curLevel - 1,
    curIdx = ((idx >> (level * SHIFT)) & MASK),
    curNode = node;

  if (level === 0) {
    return curNode.get(curIdx) as T;
  } else {
    if (curNode.get(curIdx) === void 0) return;
    return getNodeInTrie(curNode.get(curIdx) as TrieNode<T>, idx, level);
  }
}

/**
 * 
 * @param node 
 * @param idx 
 * @param curLevel 
 * @param targetLevel 决定到哪个 level 停止
 */
export function setNodeInTrie<T>(node: TrieNode<T>, idx: number, curLevel: number, value: T | TrieNode<T>, targetLevel = 0, ownerID = new OwnerID()): TrieNode<T> {
  let level = curLevel - 1,
    curIdx = (idx >> (level * SHIFT)) & MASK,
    curNode = !node ? new TrieNode<T>([], ownerID) : node.makeEditable(ownerID);

  if (level === targetLevel) {
    curNode.set(curIdx, value);
  } else {
    curNode.set(curIdx, curNode.get(curIdx) ?? new TrieNode<T>([], ownerID));
    const newNode = setNodeInTrie(curNode.get(curIdx) as TrieNode<T>, idx, level, value, targetLevel, ownerID);
    curNode.set(curIdx, newNode as TrieNode<T>);
  }
  return curNode;
}

export function makeList<T>(root: TrieNode<T>, len: number, tail?: TrieNode<T>, ownerID?: OwnerID, list?: TrieList<T>) {
  const altered = !(list && ownerID && list.__ownerID === ownerID);
  const newList = !altered ? list : new TrieList<T>();
  newList.root = root;
  newList.tail = tail;
  newList.length = len;
  newList.__ownerID = ownerID;
  newList.__altered = altered;
  return newList;
}

/**
 * 获取当前 len 对应的 tail 开始索引
 * @param len 
 */
export function getTailOffset(len: number) {
  return len < NODE_SIZE ? 0 : ((len - 1) >>> SHIFT) << SHIFT;
}

/**generate owner id */
export class OwnerID {}
import { SHIFT, MASK } from './constants';
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
    if (!curNode.get(curIdx)) return;
    return getNodeInTrie(curNode.get(curIdx) as TrieNode<T>, idx, level);
  }
}

/**
 * 
 * @param node 
 * @param idx 
 * @param curLevel 
 */
export function setNodeInTrie<T>(node: TrieNode<T>, idx: number, curLevel: number, value: T): TrieNode<T> {
  let level = curLevel - 1,
    curIdx = ((idx >> (level * SHIFT)) & MASK),
    curNode = !node ? new TrieNode<T>() : node.clone();

  if (level === 0) {
    curNode.set(curIdx, value);
  } else {
    curNode.set(curIdx, curNode.get(curIdx));
    const newNode = setNodeInTrie(curNode.get(curIdx) as TrieNode<T>, idx, level, value);
    curNode.set(curIdx, newNode as TrieNode<T>);
  }
  return curNode;
}

export function makeList<T>(root: TrieNode<T>, len: number) {
  return new TrieList<T>(root, len);
}
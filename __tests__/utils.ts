import { TrieList } from "../index"
import { getNodeInTrie } from '../utils/index'

describe(`test utils`, () => {
  const list = new TrieList()
  it(`test getNodeInTrie`, () => {
    const newList = list.pushBack(1)
    expect(getNodeInTrie(newList.root, 0, newList.level)).toStrictEqual(1)
  })
})
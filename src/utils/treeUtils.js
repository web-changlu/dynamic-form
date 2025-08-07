/**
 * 树形结构工具函数
 */

/**
 * 构建树形结构
 * @param {Array} list 扁平数组
 * @returns {Array} 树形结构
 */
export function buildTree(list = []) {
  const root = []
  const map = {}

  list.forEach((item) => {
    map[item.id] = { ...item, children: [] }
  })

  list.forEach((item) => {
    if (item.parentId === null || item.parentId === undefined) {
      root.push(map[item.id])
    } else {
      if (map[item.parentId]) {
        map[item.parentId].children.push(map[item.id])
      }
    }
  })

  // 递归排序每个节点的子节点
  const sortChildren = (node) => {
    if (node.children && node.children.length > 0) {
      // 对子节点按照rank属性进行排序
      node.children.sort((a, b) => (a.rank || 0) - (b.rank || 0))
      // 递归对所有子节点执行相同的排序操作
      node.children.forEach((child) => sortChildren(child))
    }
  }

  // 对根节点进行排序
  root.sort((a, b) => (a.rank || 0) - (b.rank || 0))
  // 对根节点的每个子节点递归进行排序
  root.forEach((node) => sortChildren(node))

  return root
}

/**
 * 添加序号
 * @param {Array} tree 树形结构
 * @param {String} parentSequence 父节点序号
 * @param {Number} level 层级
 */
export function addSequence(tree, parentSequence = '', level = 1) {
  tree.forEach((node, index) => {
    let sequence
    if (level === 3) {
      sequence = `${parentSequence}.${index + 1}`
    } else if (level === 4) {
      sequence = `${index + 1}、`
    } else {
      sequence = `${index + 1}`
    }
    node.sequence = sequence
    if (node.children && node.children.length > 0) {
      addSequence(node.children, sequence, level + 1)
    }
  })
}

/**
 * 扁平化树形结构
 * @param {Array} tree 树形结构
 * @param {Array} result 结果数组
 * @returns {Array} 扁平化后的数组
 */
export function flattenTree(tree, result = []) {
  tree.forEach((node) => {
    const { children, ...rest } = node
    result.push(rest)
    if (children && children.length > 0) {
      flattenTree(children, result)
    }
  })
  return result
}

/**
 * 按树形结构拆分数组
 * @param {Array} list 扁平数组
 * @returns {Object} 按根节点ID分组的对象
 */
export function splitArrayByTreeStructure(list) {
  // 创建一个映射来存储根节点及其所有子节点
  const trees = {}

  // 遍历数组，构建树结构
  list.forEach((item) => {
    if (item.parentId === null || item.parentId === undefined) {
      // 如果parentId为null，表示是根节点
      if (!trees[item.id]) {
        trees[item.id] = []
      }
    } else {
      // 如果parentId不为null，找到对应的根节点并添加当前项
      const rootId = findRootId(item.parentId, list)
      if (!trees[rootId]) {
        trees[rootId] = []
      }
      trees[rootId].push(item)
    }
  })

  // 将根节点添加到对应的数组中
  list.forEach((item) => {
    if ((item.parentId === null || item.parentId === undefined) && trees[item.id]) {
      trees[item.id].unshift(item)
    }
  })

  return trees
}

/**
 * 查找根节点ID
 * @param {String|Number} parentId 父节点ID
 * @param {Array} list 扁平数组
 * @returns {String|Number} 根节点ID
 */
export function findRootId(parentId, list) {
  // 查找当前节点
  const parent = list.find((item) => item.id === parentId)
  // 如果当前节点不存在或者已经是根节点，则返回当前节点的ID
  if (!parent || parent.parentId === null || parent.parentId === undefined) {
    return parentId
  }
  // 否则，递归查找父节点
  return findRootId(parent.parentId, list)
}

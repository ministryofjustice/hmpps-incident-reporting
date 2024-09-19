import { setDifference, setToString } from '../../utils/setUtils'

type Adjacency<T> = Map<T, Set<T>>

type Path<T> = T[]

export type DfsResult<T> = {
  visited: Set<T>
  cycles: Path<T>[]
}

type VisitState<T> = DfsResult<T> & {
  currentPath: T[]
}

export class Graph<T> {
  private adjacency: Adjacency<T>

  constructor() {
    this.adjacency = new Map<T, Set<T>>()
  }

  /**
   * Adds the edge from `from` to `to` to the `from` node adjacency list
   *
   * `to` is not added if it's `null` or `undefined`
   *
   * @param from source node
   * @param to destination node
   */
  addEdge(from: T, to: T) {
    if (!this.adjacency.get(from)) {
      this.adjacency.set(from, new Set())
    }

    if (to !== null && to !== undefined) {
      const adjacents = this.adjacency.get(from)
      adjacents.add(to)
    }
  }

  /**
   * Returns a string representing the graph
   *
   * Useful for debugging purposes, for example:
   *
   * '1 => { 2, 3 }
   *  2 => { 3 }
   *  3 => { 4, 5 }
   *  4 => { 1 }
   *  5 => {  }'
   *
   * @param from source node
   * @param to destination node
   */
  toString(): string {
    let result = ''
    for (const [node, adjacents] of this.adjacency.entries()) {
      result += `${node} => { ${setToString(adjacents)} }\n`
    }
    return result
  }

  /**
   * Returns nodes which are referred in the adjacent lists but don't exist
   *
   * For example, given:
   *
   *  1 => { 2, 3 }
   *  2 => { 3, 42 }
   *  3 => { }
   *
   * the node 42 is in the 2's adjacent list but doesn't exist
   *
   * @returns Set of invalid nodes
   */
  getInvalidNodes(): Set<T> {
    const allAdjacents = new Set<T>()
    for (const adjacentsSet of this.adjacency.values()) {
      adjacentsSet.forEach(adjacent => allAdjacents.add(adjacent))
    }

    const invalidNodes = [...allAdjacents].filter(node => !this.adjacency.has(node))
    return new Set(invalidNodes)
  }

  /**
   * Returns nodes which are unreachable
   *
   * For example, given:
   *
   *  1 => { 2 }
   *  2 => { }
   *  42 => { }
   *
   * the node 42 is unreachable when starting from 1
   *
   * @param dfsResult result of DFS traversal
   * @returns Set of invalid nodes
   */
  getUnreachableNodes(dfsResult: DfsResult<T>): Set<T> {
    const allNodes = new Set<T>(this.adjacency.keys())
    const unreachableNodes = setDifference(allNodes, dfsResult.visited)

    return unreachableNodes
  }

  /**
   * DFS (Depth-first search) traversal of the graph
   *
   * Returns a result with set of visited nodes and list of cycles
   *
   * For example, given:
   *
   * 1 => { 2, 3 }
   * 2 => { 3 }
   * 3 => { 4, 1 }
   * 4 => { 5 }
   * 5 => { 3 }
   *
   * it returns:
   * - visited: { 1, 2, 3, 4, 5 }
   * - cycles: [
   *     [ 1, 2, 3, 4, 5, 3 ],
   *     [ 1, 2, 3, 1 ]
   *   ]
   *
   * @returns the result of the traversal
   */
  dfs(start: T): DfsResult<T> {
    const state: VisitState<T> = {
      visited: new Set(),
      cycles: [],
      currentPath: [],
    }

    this.dfsWalk(start, state)

    return state
  }

  /**
   * DFS walk from the given node and update the given state
   *
   * The given state keeps track of visited nodes, current path and cycles
   * detected.
   *
   * @param node where to start to walk
   * @param state state to update
   */
  private dfsWalk(node: T, state: VisitState<T>) {
    state.visited.add(node)
    state.currentPath.push(node)

    const adjacents = this.adjacency.get(node)
    if (adjacents !== undefined) {
      for (const child of adjacents) {
        if (!state.visited.has(child)) {
          this.dfsWalk(child, state)
        } else if (state.currentPath.includes(child)) {
          // Cycle detected, add copy of the current path to cycles
          state.cycles.push([...state.currentPath, child])
        }
      }
    }

    state.currentPath.pop()
  }
}

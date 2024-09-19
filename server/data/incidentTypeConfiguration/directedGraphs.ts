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

  addEdge(from: T, to: T) {
    if (!this.adjacency.get(from)) {
      this.adjacency.set(from, new Set())
    }

    if (to !== null && to !== undefined) {
      const adjacents = this.adjacency.get(from)
      adjacents.add(to)
    }
  }

  toString(): string {
    let result = ''
    for (const [node, adjacents] of this.adjacency.entries()) {
      result += `${node} => { ${setToString(adjacents)} }\n`
    }
    return result
  }

  getInvalidNodes(): Set<T> {
    const allAdjacents = new Set<T>()
    for (const adjacentsSet of this.adjacency.values()) {
      adjacentsSet.forEach(adjacent => allAdjacents.add(adjacent))
    }

    const invalidNodes = [...allAdjacents].filter(node => !this.adjacency.has(node))
    return new Set(invalidNodes)
  }

  getUnreachableNodes(dfsResult: DfsResult<T>): Set<T> {
    const allNodes = new Set<T>(this.adjacency.keys())
    const unreachableNodes = setDifference(allNodes, dfsResult.visited)

    return unreachableNodes
  }

  dfs(start: T): DfsResult<T> {
    const state: VisitState<T> = {
      visited: new Set(),
      cycles: [],
      currentPath: [],
    }

    this.dfsWalk(start, state)

    return state
  }

  private dfsWalk(node: T, state: VisitState<T>) {
    state.visited.add(node)
    state.currentPath.push(node)

    const adjacents = this.adjacency.get(node)
    if (adjacents !== undefined) {
      for (const child of adjacents) {
        if (!state.visited.has(child)) {
          this.dfsWalk(child, state)
        } else if (state.currentPath.includes(child)) {
          // Cycle detected
          state.cycles.push([...state.currentPath])
        }
      }
    }

    state.currentPath.pop()
  }
}

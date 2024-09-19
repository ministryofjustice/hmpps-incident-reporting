import { setToString } from '../../utils/setUtils'

export type Graph<T> = Map<T, Set<T>>

export type Path<T> = T[]

export type VisitResult<T> = {
  visited: Set<T>
  cycles: Path<T>[]
}

type VisitState<T> = VisitResult<T> & {
  currentPath: T[]
}

export function dfs<T>(start: T, graph: Graph<T>): VisitResult<T> {
  const state: VisitState<T> = {
    visited: new Set(),
    cycles: [],
    currentPath: [],
  }

  walk(start, graph, state)

  return state
}

function walk<T>(node: T, graph: Graph<T>, state: VisitState<T>) {
  state.visited.add(node)
  state.currentPath.push(node)

  const children = graph.get(node)
  if (children !== undefined) {
    for (const child of children) {
      if (!state.visited.has(child)) {
        walk(child, graph, state)
      } else if (state.currentPath.includes(child)) {
        // Cycle detected
        state.cycles.push([...state.currentPath])
      }
    }
  }

  state.currentPath.pop()
}

export function graphToString<T>(graph: Graph<T>): string {
  let result = ''
  for (const [node, children] of graph.entries()) {
    result += `${node} => { ${setToString(children)} }\n`
  }
  return result
}

import Heap from 'heap';

export type Edge<T = number | string> = {
  from: T;
  to: T;
  capacity: number;
  cost: number;
  flow?: number;
};

const SOURCE_NODE = 0;

/**
 * An implementation of the Successive shortest path algorithm for solving a minimum cost flow problem
 * The implementation is nabbed from <https://cp-algorithms.com/graph/min_cost_flow.html>
 *
 * Assumptions:
 * - The nodes are sequentially numbered integers from 0 to (but not including) n.
 * - Node 0 is the source, node n-1 is the sink.
 * - Only one edge goes between any two nodes – in either direction. In other words: no double edges in the same direction, and no back edges.
 *
 * @param {Array<Edge<number>>} graph The graph represented as an edge list
 * @param {number} desiredFlow The maximum flow you want; the algorithm stops when it reaches this number. Default is Infinity, indicating a desire for maximum flow.
 * @returns {Array<Required<Edge>>} The network updated to provide as much flow up to the limit specified by desiredFlow
 */
export function minCostFlow(graph: Array<Edge<number>>, desiredFlow = Infinity): Array<Required<Edge>> {
  const sink = Math.max(...graph.map(({to}) => to));
  const numberOfNodes = sink + 1;

  const adjacency: number[][] = [...new Array(numberOfNodes)].map(() => []);
  const costMatrix: number[][] = [...new Array(numberOfNodes)].map(() => new Array(numberOfNodes).fill(0));
  const capacityMatrix: number[][] = [...new Array(numberOfNodes)].map(() => new Array(numberOfNodes).fill(0));
  graph.forEach(({capacity, cost, flow = 0, from, to}) => {
    adjacency[from].push(to);
    adjacency[to].push(from);
    costMatrix[from][to] = cost;
    costMatrix[to][from] = -cost;
    capacityMatrix[from][to] = capacity - flow;
    capacityMatrix[to][from] = flow;
  });

  let flow = 0;
  while (flow < desiredFlow) {
    const {leastCosts, predecessors} = cheapestPaths(adjacency, capacityMatrix, costMatrix);
    if (leastCosts[sink] === Infinity) {
      break;
    }

    let maxFlowOnThisPath: number = desiredFlow - flow;
    let currentNode: number = sink;
    while (currentNode !== SOURCE_NODE) {
      maxFlowOnThisPath = Math.min(maxFlowOnThisPath, capacityMatrix[predecessors[currentNode]][currentNode]);
      currentNode = predecessors[currentNode];
    }

    flow += maxFlowOnThisPath;
    currentNode = sink;

    while (currentNode !== SOURCE_NODE) {
      capacityMatrix[predecessors[currentNode]][currentNode] -= maxFlowOnThisPath;
      capacityMatrix[currentNode][predecessors[currentNode]] += maxFlowOnThisPath;
      currentNode = predecessors[currentNode];
    }
  }

  return graph.map((edge) => ({...edge, flow: capacityMatrix[edge.to][edge.from]}));
}

/**
 * The Bellman-Ford shortest path algorithm as shown in <https://cp-algorithms.com/graph/min_cost_flow.html>.
 * Calculates the chepaest path from the source to every other node in the network as well as which node is the best predecessor of every node.
 *
 * @param {number[][]} adjacency . I.e., if adjacency[0] === [1, 4, 6], nodes 1, 4 and 6 are adjacent to 0.
 * @param {number[][]} capacity A two dimensional array (size n*n, where n is the number of nodes) describing the capacity going from each node to any other. capacity[x][y] describes the capacity from node x to node y.
 * @param {number[][]} cost A two dimensional array (size n*n, where n is the number of nodes) describing the cost of transporting one unit of flow from each node to any other. cost[x][y] describes the cost from node x to node y.
 * @returns {{leastCosts: number[], predecessors: number[]}} An object with type `{leastCosts: number[], predecessors: number[]}`. The element at index `x` in each of these arrays contains the least cost of going to and the best predecessors for node `x` respectively.
 */
function cheapestPaths(
  adjacency: number[][],
  capacity: number[][],
  cost: number[][]
): {leastCosts: number[]; predecessors: number[]} {
  const numberOfNodes = adjacency.length;
  const leastCosts: number[] = new Array(numberOfNodes).fill(Infinity);
  leastCosts[SOURCE_NODE] = 0;
  const inQueue: boolean[] = new Array(numberOfNodes).fill(false);
  const queue: Heap<number> = new Heap();
  queue.push(SOURCE_NODE);
  const predecessors: number[] = new Array(numberOfNodes).fill(-1);

  while (!queue.empty()) {
    const home: number = queue.pop();
    inQueue[home] = false;
    adjacency[home].forEach((neighbor) => {
      if (capacity[home][neighbor] > 0 && leastCosts[neighbor] > leastCosts[home] + cost[home][neighbor]) {
        leastCosts[neighbor] = leastCosts[home] + cost[home][neighbor];
        predecessors[neighbor] = home;
        if (!inQueue[neighbor]) {
          inQueue[neighbor] = true;
          queue.push(neighbor);
        }
      }
    });
  }

  return {leastCosts, predecessors};
}

/**
 * Calculates the current flow in a network, which is the sum of the flow on all edges going from the source node
 *
 * @param {Array<Edge<number>>} graph A graph in the form of an edge list
 * @returns {number} The current flow
 */
export function currentFlow(graph: Array<Edge<number>>): number {
  return graph
    .filter((edge) => edge.from === SOURCE_NODE)
    .reduce((accumulator, edge) => accumulator + (edge.flow ?? 0), 0);
}

/**
 * Calculates the current cost of a network, which is the sum of each edge's cost per unit of flow times the flow passing through it
 *
 * @param {Array<Edge<number>>} graph A graph in the form of an edge list
 * @returns {number} The current cost of the network
 */
export function currentCost(graph: Array<Edge<number>>): number {
  return graph.reduce((accumulator, edge) => accumulator + edge.cost * (edge.flow ?? 0), 0);
}

/**
 * Takes a graph with edges edges going to and from nodes with string names and transforms it into a graph with numbered edges,
 * following the convention that the source node is the first node and the sink node the last.
 * It assumes that the source node's name is SOURCE and the sink node's name is SINK.
 *
 * @param {Array<Edge<string>>} graph A graph in the form of an edge list
 * @param {{source: (string|undefined), sink: (string|undefined)}} options An object with two (optional) keys: source and sink.
 * If a value is supplied at this key, the function will assume that the source/sink node's name is equal to the supplied value.
 * @returns {Array} A two element tuple whose first element is the destringified graph and whose second element is the node names listed in the order in which they were named, so that the graph can be restringified by getting nodeNames[n] for any node in the destringified graph.
 */
export function destringifyGraph(
  graph: Array<Edge<string>>,
  options: {source?: string; sink?: string} = {}
): [Array<Edge<number>>, string[]] {
  const {source = 'SOURCE', sink = 'SINK'} = options;
  const ordinaryNodes = [
    ...new Set(graph.flatMap(({from, to}) => [from, to]).filter((name) => name !== source && name !== sink))
  ].sort();
  const allNodeNames = [source, ...ordinaryNodes, sink];
  const stringToIndex = new Map(allNodeNames.map((name, index): [string, number] => [name, index]));
  return [
    graph.map((edge) => {
      const from = stringToIndex.get(edge.from);
      const to = stringToIndex.get(edge.to);
      if (from == null) {
        throw new Error(`The node ${edge.from} does not seem to be included in this network's nodes.`);
      }

      if (to == null) {
        throw new Error(`The node ${edge.to} does not seem to be included in this network's nodes.`);
      }

      return {...edge, from, to};
    }),
    allNodeNames
  ];
}

/**
 * Restringifies a graph that has been destringified by destringifyGraph
 *
 * @param {Array<Edge<number>>} graph The graph as an edge list
 * @param {string[]} nodeNames The names of each node, so that the name of the node numbered `x` can be found at `nodeNames[x]`
 * @returns {Array<Edge<string>>} The restringified graph
 */
export function restringifyGraph(graph: Array<Edge<number>>, nodeNames: string[]): Array<Edge<string>> {
  const highestAllowedIndex = nodeNames.length - 1;
  return graph.map(({from, to, ...edge}) => {
    if (from > highestAllowedIndex) {
      throw new Error(`Index ${from} is outside of the list of node names`);
    }

    if (to > highestAllowedIndex) {
      throw new Error(`Index ${to} is outside of the list of node names`);
    }

    return {...edge, from: nodeNames[from], to: nodeNames[to]};
  });
}

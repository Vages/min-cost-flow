import Heap from 'heap';

export type Edge<T = number | string> = {
  from: T;
  to: T;
  capacity: number;
  cost: number;
  flow?: number;
};

type DestringifyOptions = {source?: string; sink?: string};

const SOURCE_NODE = 0;

type MinCostFlowOptions = {desiredFlow?: number} & DestringifyOptions;

/**
 * Solves a minimum-cost flow problem using the successive shortest paths algorithm. Assumes that only one edge goes
 * between any two nodes – in either direction. In other words: no double edges in the same direction, and no back
 * edges.
 *
 * The function is a wrapper that destringifies the graph, calls minCostFlowForNumberNodes on it and restringifies the
 * result.
 *
 * @param {Array<Edge<string>>} graph The graph represented as an edge list
 * @param {MinCostFlowOptions} options An object with three keys: source (string), sink (string) and
 * desiredFlow (number). Source is `"SOURCE"` by default, sink is `"SINK"` by default and desiredFlow is `Infinity` by
 * default (indicating a desire for maximum flow).
 * @returns {Array<Required<Edge<string>>>}
 */
export function minCostFlow(
  graph: Array<Edge<string>>,
  options: MinCostFlowOptions = {}
): Array<Required<Edge<string>>> {
  const {desiredFlow, ...destringifyOptions} = options;
  const [destringifiedGraph, nodeNames] = destringifyGraph(graph, destringifyOptions);
  return restringifyGraph(minCostFlowForNumberNodes(destringifiedGraph, desiredFlow), nodeNames) as Array<
    Required<Edge<string>>
  >;
}

/**
 * The underlying implementation of the successive shortest paths algorithm, nabbed from <https://cp-algorithms.com/graph/min_cost_flow.html>
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
export function minCostFlowForNumberNodes(
  graph: Array<Edge<number>>,
  desiredFlow = Infinity
): Array<Required<Edge<number>>> {
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
    const noCapacityLeft = leastCosts[sink] === Infinity;
    if (noCapacityLeft) {
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
      const precedingNode = predecessors[currentNode];
      capacityMatrix[precedingNode][currentNode] -= maxFlowOnThisPath;
      capacityMatrix[currentNode][precedingNode] += maxFlowOnThisPath;
      currentNode = precedingNode;
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
  options: DestringifyOptions = {}
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

type BipartiteEdge = {left: string; right: string; weight: number};

/**
 * Finds a minimum weight bipartite match for a graph.
 *
 * Converts the problem to a minimum-cost flow problem.
 *
 * @param {BipartiteEdge[]} edges The entire weighted graph represented as weighted edges
 * @returns {BipartiteEdge[]} The edges that are part of the minimum bipartite match
 */
export function minimumWeightBipartiteMatch(edges: BipartiteEdge[]): BipartiteEdge[] {
  const leftNodes = edges.map(({left}) => left);
  const rightNodes = edges.map(({right}) => right);

  const middleEdges: Array<Edge<string>> = edges.map(({left, right, weight}) => ({
    from: left,
    to: right,
    cost: weight,
    capacity: 1
  }));
  const sourceEdges = leftNodes.map((name) => ({from: 'SOURCE', to: name, cost: 0, capacity: 1}));
  const sinkEdges = rightNodes.map((name) => ({to: 'SINK', from: name, cost: 0, capacity: 1}));

  const solution = minCostFlow([...sourceEdges, ...middleEdges, ...sinkEdges]);

  return solution
    .filter(({from, to, flow}) => flow > 0 && from !== 'SOURCE' && to !== 'SINK')
    .map(({from, to, cost}) => ({left: from, right: to, weight: cost}));
}

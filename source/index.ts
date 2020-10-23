import Heap from 'heap';

export type Edge = {
  from: number;
  to: number;
  capacity: number;
  cost: number;
  flow?: number;
};

const SOURCE_NODE = 0;

/**
 * An implementation of the Successive shortest path algorithm for solving a minimum cost flow problem
 *
 * Assumes that the nodes are sequentially numbered integers from 0 to (but not including) n.
 * node 0 is the source, node n-1 is the sink.
 *
 * The implementation is nabbed from https://cp-algorithms.com/graph/min_cost_flow.html
 * @param {Edge[]} edges The graph represented as an edge list
 * @param {number | undefined} desiredFlow The maximum flow you want; the algorithm stops when it reaches this number. Default is Infinity, indicating a desire for maximum flow.
 */
export function minCostFlow(edges: Edge[], desiredFlow = Infinity): Array<Required<Edge>> {
  const sink = Math.max(...edges.map(({to}) => to));
  const numberOfNodes = sink + 1;

  const adjacency: number[][] = [...new Array(numberOfNodes)].map(() => []);
  const costMatrix: number[][] = [...new Array(numberOfNodes)].map(() => new Array(numberOfNodes).fill(0));
  const capacityMatrix: number[][] = [...new Array(numberOfNodes)].map(() => new Array(numberOfNodes).fill(0));
  edges.forEach(({capacity, cost, flow = 0, from, to}) => {
    adjacency[from].push(to);
    adjacency[to].push(from);
    costMatrix[from][to] = cost;
    costMatrix[to][from] = -cost;
    capacityMatrix[from][to] = capacity - flow;
    capacityMatrix[to][from] = flow;
  });

  let flow = 0;
  while (flow < desiredFlow) {
    const {distances, predecessors} = shortestPaths(adjacency, capacityMatrix, costMatrix);
    if (distances[sink] === Infinity) {
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

  return edges.map((edge) => ({...edge, flow: capacityMatrix[edge.to][edge.from]}));
}

/**
 * The Bellman-Ford shortest path algorithm as shown in
 * https://cp-algorithms.com/graph/min_cost_flow.html
 */
function shortestPaths(
  adjacency: number[][],
  capacity: number[][],
  cost: number[][]
): {distances: number[]; predecessors: number[]} {
  const numberOfNodes = adjacency.length;
  const distances: number[] = new Array(numberOfNodes).fill(Infinity);
  distances[SOURCE_NODE] = 0;
  const inQueue: boolean[] = new Array(numberOfNodes).fill(false);
  const queue: Heap<number> = new Heap();
  queue.push(SOURCE_NODE);
  const predecessors: number[] = new Array(numberOfNodes).fill(-1);

  while (!queue.empty()) {
    const home: number = queue.pop();
    inQueue[home] = false;
    adjacency[home].forEach((neighbor) => {
      if (capacity[home][neighbor] > 0 && distances[neighbor] > distances[home] + cost[home][neighbor]) {
        distances[neighbor] = distances[home] + cost[home][neighbor];
        predecessors[neighbor] = home;
        if (!inQueue[neighbor]) {
          inQueue[neighbor] = true;
          queue.push(neighbor);
        }
      }
    });
  }

  return {distances, predecessors};
}

/**
 * Calculates the current flow in the network as the sum of the flow on all edges going from the source node
 *
 * @param {Edge[]} edges The graph represented as an edge list
 */
export function currentFlow(edges: Edge[]): number {
  return edges
    .filter((edge) => edge.from === SOURCE_NODE)
    .reduce((accumulator, edge) => accumulator + (edge.flow ?? 0), 0);
}

/**
 * Calculates the current cost of the network as the sum of each edge's cost times its flow
 *
 * @param {Edge[]} edges The graph represented as an edge list
 */
export function currentCost(edges: Edge[]): number {
  return edges.reduce((accumulator, edge) => accumulator + edge.cost * (edge.flow ?? 0), 0);
}

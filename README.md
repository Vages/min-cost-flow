[![view on npm](http://img.shields.io/npm/v/min-cost-flow.svg)](https://www.npmjs.org/package/min-cost-flow)

# min-cost-flow

A package that solves minimum cost flow problems using the Successive Shortest Paths algorithm.

## Functions

<dl>
<dt><a href="#minCostFlow">minCostFlow(graph, desiredFlow)</a> ⇒ <code>Array.&lt;Required.&lt;Edge&gt;&gt;</code></dt>
<dd><p>An implementation of the Successive shortest path algorithm for solving a minimum cost flow problem
The implementation is nabbed from <a href="https:%5C/%5C/cp-algorithms.com/graph/min_cost_flow.html">https://cp-algorithms.com/graph/min_cost_flow.html</a></p>
<p>Assumptions:</p>
<ul>
<li>The nodes are sequentially numbered integers from 0 to (but not including) n.</li>
<li>Node 0 is the source, node n-1 is the sink.</li>
<li>Only one edge goes between any two nodes – in either direction. In other words: no double edges in the same direction, and no back edges.</li>
</ul></dd>
<dt><a href="#cheapestPaths">cheapestPaths(adjacency, capacity, cost)</a> ⇒ <code>Object</code></dt>
<dd><p>The Bellman-Ford shortest path algorithm as shown in <a href="https:%5C/%5C/cp-algorithms.com/graph/min_cost_flow.html">https://cp-algorithms.com/graph/min_cost_flow.html</a>.
Calculates the chepaest path from the source to every other node in the network as well as which node is the best predecessor of every node.</p></dd>
<dt><a href="#currentFlow">currentFlow(graph)</a> ⇒ <code>number</code></dt>
<dd><p>Calculates the current flow in a network, which is the sum of the flow on all edges going from the source node</p></dd>
<dt><a href="#currentCost">currentCost(graph)</a> ⇒ <code>number</code></dt>
<dd><p>Calculates the current cost of a network, which is the sum of each edge's cost per unit of flow times the flow passing through it</p></dd>
</dl>

<a name="minCostFlow"></a>

## minCostFlow(graph, desiredFlow) ⇒ <code>Array.&lt;Required.&lt;Edge&gt;&gt;</code>
<p>An implementation of the Successive shortest path algorithm for solving a minimum cost flow problem
The implementation is nabbed from <a href="https:%5C/%5C/cp-algorithms.com/graph/min_cost_flow.html">https://cp-algorithms.com/graph/min_cost_flow.html</a></p>
<p>Assumptions:</p>
<ul>
<li>The nodes are sequentially numbered integers from 0 to (but not including) n.</li>
<li>Node 0 is the source, node n-1 is the sink.</li>
<li>Only one edge goes between any two nodes – in either direction. In other words: no double edges in the same direction, and no back edges.</li>
</ul>

**Kind**: global function  
**Returns**: <code>Array.&lt;Required.&lt;Edge&gt;&gt;</code> - <p>The network updated to provide as much flow up to the limit specified by desiredFlow</p>  

| Param | Type | Description |
| --- | --- | --- |
| graph | <code>Array.&lt;Edge&gt;</code> | <p>The graph represented as an edge list</p> |
| desiredFlow | <code>number</code> | <p>The maximum flow you want; the algorithm stops when it reaches this number. Default is Infinity, indicating a desire for maximum flow.</p> |

<a name="cheapestPaths"></a>

## cheapestPaths(adjacency, capacity, cost) ⇒ <code>Object</code>
<p>The Bellman-Ford shortest path algorithm as shown in <a href="https:%5C/%5C/cp-algorithms.com/graph/min_cost_flow.html">https://cp-algorithms.com/graph/min_cost_flow.html</a>.
Calculates the chepaest path from the source to every other node in the network as well as which node is the best predecessor of every node.</p>

**Kind**: global function  
**Returns**: <code>Object</code> - <p>An object with type <code>{leastCosts: number[], predecessors: number[]}</code>. The element at index <code>x</code> in each of these arrays contains the least cost of going to and the best predecessors for node <code>x</code> respectively.</p>  

| Param | Type | Description |
| --- | --- | --- |
| adjacency | <code>Array.&lt;Array.&lt;number&gt;&gt;</code> | <p>. I.e., if adjacency[0] === [1, 4, 6], nodes 1, 4 and 6 are adjacent to 0.</p> |
| capacity | <code>Array.&lt;Array.&lt;number&gt;&gt;</code> | <p>A two dimensional array (size n*n, where n is the number of nodes) describing the capacity going from each node to any other. capacity[x][y] describes the capacity from node x to node y.</p> |
| cost | <code>Array.&lt;Array.&lt;number&gt;&gt;</code> | <p>A two dimensional array (size n*n, where n is the number of nodes) describing the cost of transporting one unit of flow from each node to any other. cost[x][y] describes the cost from node x to node y.</p> |

<a name="currentFlow"></a>

## currentFlow(graph) ⇒ <code>number</code>
<p>Calculates the current flow in a network, which is the sum of the flow on all edges going from the source node</p>

**Kind**: global function  
**Returns**: <code>number</code> - <p>The current flow</p>  

| Param | Type | Description |
| --- | --- | --- |
| graph | <code>Array.&lt;Edge&gt;</code> | <p>A graph in the form of an edge list</p> |

<a name="currentCost"></a>

## currentCost(graph) ⇒ <code>number</code>
<p>Calculates the current cost of a network, which is the sum of each edge's cost per unit of flow times the flow passing through it</p>

**Kind**: global function  
**Returns**: <code>number</code> - <p>The current cost of the network</p>  

| Param | Type | Description |
| --- | --- | --- |
| graph | <code>Array.&lt;Edge&gt;</code> | <p>A graph in the form of an edge list</p> |


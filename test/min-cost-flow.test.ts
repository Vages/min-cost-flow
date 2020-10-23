/* eslint-env jest */

import {Edge, minCostFlow} from '../source';

const bipartiteNetwork: Edge[] = [
  ...[{to: 1}, {to: 2}, {to: 3}].map((edge) => ({...edge, from: 0, cost: 0})),
  ...[
    {to: 4, cost: 2},
    {to: 5, cost: 4},
    {to: 6, cost: 6}
  ].map((edge) => ({...edge, from: 1})),
  ...[
    {to: 4, cost: 6},
    {to: 5, cost: 2},
    {to: 6, cost: 4}
  ].map((edge) => ({...edge, from: 2})),
  ...[
    {to: 4, cost: 4},
    {to: 5, cost: 6},
    {to: 6, cost: 2}
  ].map((edge) => ({...edge, from: 3})),
  ...[{from: 4}, {from: 5}, {from: 6}].map((edge) => ({...edge, to: 7, cost: 0}))
].map((edge) => ({...edge, capacity: 1}));

const bestFlow = {
  flow: 3,
  cost: 6,
  edges: [
    {
      to: 1,
      from: 0,
      cost: 0,
      capacity: 1,
      flow: 1
    },
    {
      to: 2,
      from: 0,
      cost: 0,
      capacity: 1,
      flow: 1
    },
    {
      to: 3,
      from: 0,
      cost: 0,
      capacity: 1,
      flow: 1
    },
    {
      to: 4,
      cost: 2,
      from: 1,
      capacity: 1,
      flow: 1
    },
    {
      to: 5,
      cost: 4,
      from: 1,
      capacity: 1,
      flow: 0
    },
    {
      to: 6,
      cost: 6,
      from: 1,
      capacity: 1,
      flow: 0
    },
    {
      to: 4,
      cost: 6,
      from: 2,
      capacity: 1,
      flow: 0
    },
    {
      to: 5,
      cost: 2,
      from: 2,
      capacity: 1,
      flow: 1
    },
    {
      to: 6,
      cost: 4,
      from: 2,
      capacity: 1,
      flow: 0
    },
    {
      to: 4,
      cost: 4,
      from: 3,
      capacity: 1,
      flow: 0
    },
    {
      to: 5,
      cost: 6,
      from: 3,
      capacity: 1,
      flow: 0
    },
    {
      to: 6,
      cost: 2,
      from: 3,
      capacity: 1,
      flow: 1
    },
    {
      from: 4,
      to: 7,
      cost: 0,
      capacity: 1,
      flow: 1
    },
    {
      from: 5,
      to: 7,
      cost: 0,
      capacity: 1,
      flow: 1
    },
    {
      from: 6,
      to: 7,
      cost: 0,
      capacity: 1,
      flow: 1
    }
  ]
};

describe('maxFlowMinCost', () => {
  test('maxFlowMinCost', () => {
    const minCostFlow1 = minCostFlow(bipartiteNetwork, Infinity);
    const compareEdges = (a: Edge, b: Edge) => a.from - b.from || a.to - b.to;
    expect([...minCostFlow1.edges].sort(compareEdges)).toEqual([...bestFlow.edges].sort(compareEdges));
  });
});

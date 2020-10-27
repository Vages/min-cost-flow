/* eslint-env jest */

import {minCostFlow, currentCost, currentFlow, destringifyGraph, restringifyGraph} from '../source';
import type {Edge} from '../source';

const dummyNetwork: Array<Edge<number>> = [
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

const bestFlowInDummyNetwork = [
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
];

function compareEdges(a: Edge<number>, b: Edge<number>): number {
  return Math.sign(a.from - b.from || a.to - b.to);
}

describe('minCostMaxFlow', () => {
  test('minCostMaxFlow', () => {
    const minCostFlow1 = minCostFlow(dummyNetwork);
    expect([...minCostFlow1].sort(compareEdges)).toEqual([...bestFlowInDummyNetwork].sort(compareEdges));
    expect(currentFlow(minCostFlow1)).toEqual(3);
    expect(currentCost(minCostFlow1)).toEqual(6);
  });
});

const STUDENT_ASSIGNMENT_PROBLEM = [
  {
    from: 'SOURCE',
    to: 'Xanthippe',
    cost: 0,
    capacity: 1
  },
  {
    from: 'SOURCE',
    to: 'Yazoo',
    cost: 0,
    capacity: 1
  },
  {
    from: 'SOURCE',
    to: 'Zamboni',
    cost: 0,
    capacity: 1
  },
  {
    from: 'Xanthippe',
    to: 'Accounting',
    cost: 4,
    capacity: 1
  },
  {
    from: 'Xanthippe',
    to: 'Bicycles',
    cost: 2,
    capacity: 1
  },
  {
    from: 'Xanthippe',
    to: 'Construction',
    cost: 1,
    capacity: 1
  },
  {
    from: 'Xanthippe',
    to: 'Dentistry',
    cost: 3,
    capacity: 1
  },
  {
    from: 'Yazoo',
    to: 'Accounting',
    cost: 3,
    capacity: 1
  },
  {
    from: 'Yazoo',
    to: 'Bicycles',
    cost: 1,
    capacity: 1
  },
  {
    from: 'Yazoo',
    to: 'Construction',
    cost: 2,
    capacity: 1
  },
  {
    from: 'Yazoo',
    to: 'Dentistry',
    cost: 4,
    capacity: 1
  },
  {
    from: 'Zamboni',
    to: 'Accounting',
    cost: 2,
    capacity: 1
  },
  {
    from: 'Zamboni',
    to: 'Bicycles',
    cost: 4,
    capacity: 1
  },
  {
    from: 'Zamboni',
    to: 'Construction',
    cost: 3,
    capacity: 1
  },
  {
    from: 'Zamboni',
    to: 'Dentistry',
    cost: 1,
    capacity: 1
  },
  {
    from: 'Accounting',
    to: 'SINK',
    cost: 0,
    capacity: 1
  },
  {
    from: 'Bicycles',
    to: 'SINK',
    cost: 0,
    capacity: 1
  },
  {
    from: 'Construction',
    to: 'SINK',
    cost: 0,
    capacity: 1
  },
  {
    from: 'Dentistry',
    to: 'SINK',
    cost: 0,
    capacity: 1
  }
];

const STUDENT_ASSIGNMENT_SOLUTION = [
  {
    from: 'SOURCE',
    to: 'Xanthippe',
    cost: 0,
    capacity: 1,
    flow: 1
  },
  {
    from: 'SOURCE',
    to: 'Yazoo',
    cost: 0,
    capacity: 1,
    flow: 1
  },
  {
    from: 'SOURCE',
    to: 'Zamboni',
    cost: 0,
    capacity: 1,
    flow: 1
  },
  {
    from: 'Xanthippe',
    to: 'Accounting',
    cost: 4,
    capacity: 1,
    flow: 0
  },
  {
    from: 'Xanthippe',
    to: 'Bicycles',
    cost: 2,
    capacity: 1,
    flow: 0
  },
  {
    from: 'Xanthippe',
    to: 'Construction',
    cost: 1,
    capacity: 1,
    flow: 1
  },
  {
    from: 'Xanthippe',
    to: 'Dentistry',
    cost: 3,
    capacity: 1,
    flow: 0
  },
  {
    from: 'Yazoo',
    to: 'Accounting',
    cost: 3,
    capacity: 1,
    flow: 0
  },
  {
    from: 'Yazoo',
    to: 'Bicycles',
    cost: 1,
    capacity: 1,
    flow: 1
  },
  {
    from: 'Yazoo',
    to: 'Construction',
    cost: 2,
    capacity: 1,
    flow: 0
  },
  {
    from: 'Yazoo',
    to: 'Dentistry',
    cost: 4,
    capacity: 1,
    flow: 0
  },
  {
    from: 'Zamboni',
    to: 'Accounting',
    cost: 2,
    capacity: 1,
    flow: 0
  },
  {
    from: 'Zamboni',
    to: 'Bicycles',
    cost: 4,
    capacity: 1,
    flow: 0
  },
  {
    from: 'Zamboni',
    to: 'Construction',
    cost: 3,
    capacity: 1,
    flow: 0
  },
  {
    from: 'Zamboni',
    to: 'Dentistry',
    cost: 1,
    capacity: 1,
    flow: 1
  },
  {
    from: 'Accounting',
    to: 'SINK',
    cost: 0,
    capacity: 1,
    flow: 0
  },
  {
    from: 'Bicycles',
    to: 'SINK',
    cost: 0,
    capacity: 1,
    flow: 1
  },
  {
    from: 'Construction',
    to: 'SINK',
    cost: 0,
    capacity: 1,
    flow: 1
  },
  {
    from: 'Dentistry',
    to: 'SINK',
    cost: 0,
    capacity: 1,
    flow: 1
  }
];

const namedBestFlowInDummyNetwork = [
  {
    from: 'SOURCE',
    to: 'alice',
    cost: 0,
    capacity: 1,
    flow: 1
  },
  {
    from: 'SOURCE',
    to: 'bob',
    cost: 0,
    capacity: 1,
    flow: 1
  },
  {
    from: 'SOURCE',
    to: 'christine',
    cost: 0,
    capacity: 1,
    flow: 1
  },
  {
    from: 'alice',
    to: 'daniel',
    cost: 2,
    capacity: 1,
    flow: 1
  },
  {
    from: 'alice',
    to: 'erica',
    cost: 4,
    capacity: 1,
    flow: 0
  },
  {
    from: 'alice',
    to: 'frank',
    cost: 6,
    capacity: 1,
    flow: 0
  },
  {
    from: 'bob',
    to: 'daniel',
    cost: 6,
    capacity: 1,
    flow: 0
  },
  {
    from: 'bob',
    to: 'erica',
    cost: 2,
    capacity: 1,
    flow: 1
  },
  {
    from: 'bob',
    to: 'frank',
    cost: 4,
    capacity: 1,
    flow: 0
  },
  {
    from: 'christine',
    to: 'daniel',
    cost: 4,
    capacity: 1,
    flow: 0
  },
  {
    from: 'christine',
    to: 'erica',
    cost: 6,
    capacity: 1,
    flow: 0
  },
  {
    from: 'christine',
    to: 'frank',
    cost: 2,
    capacity: 1,
    flow: 1
  },
  {
    from: 'daniel',
    to: 'SINK',
    cost: 0,
    capacity: 1,
    flow: 1
  },
  {
    from: 'erica',
    to: 'SINK',
    cost: 0,
    capacity: 1,
    flow: 1
  },
  {
    from: 'frank',
    to: 'SINK',
    cost: 0,
    capacity: 1,
    flow: 1
  }
];

describe('destringifyGraph', () => {
  test('destringifyGraph and restringifyGraph work', () => {
    const [destringifiedGraph, nodeNames] = destringifyGraph(namedBestFlowInDummyNetwork);
    expect(destringifiedGraph).toEqual(bestFlowInDummyNetwork);
    expect(nodeNames).toEqual(['SOURCE', 'alice', 'bob', 'christine', 'daniel', 'erica', 'frank', 'SINK']);
    expect(restringifyGraph(destringifiedGraph, nodeNames)).toEqual(namedBestFlowInDummyNetwork);
  });

  test('destringifyGraph and restringifyGraph work', () => {
    const [, nodeNames] = destringifyGraph(namedBestFlowInDummyNetwork, {source: 'daniel', sink: 'bob'});
    expect(nodeNames).toEqual(['daniel', 'SINK', 'SOURCE', 'alice', 'christine', 'erica', 'frank', 'bob']);
  });

  test('solves the student assignment problem', () => {
    const [destringifiedStudentProblem, nodeNames] = destringifyGraph(STUDENT_ASSIGNMENT_PROBLEM);
    expect(restringifyGraph(minCostFlow(destringifiedStudentProblem), nodeNames)).toEqual(STUDENT_ASSIGNMENT_SOLUTION);
  });
});

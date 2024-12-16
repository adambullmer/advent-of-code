import run from "aocrunner";
import type { Coordinate } from "../utils/grid";

type QuadrantCounts = [number, number, number, number];

class Robot {
  position: Coordinate;
  velocity: Coordinate;

  constructor(position: Coordinate, velocity: Coordinate) {
    this.position = position;
    this.velocity = velocity;
  }

  move(seconds: number, boundaries: Coordinate) {
    const [x, y] = this.position;
    const [dx, dy] = this.velocity;
    const newPosition: Coordinate = [x + dx * seconds, y + dy * seconds];

    if (newPosition[0] < 0) {
      newPosition[0] = boundaries[0] + (newPosition[0] % boundaries[0]);
    }

    if (newPosition[1] < 0) {
      newPosition[1] = boundaries[1] + (newPosition[1] % boundaries[1]);
    }

    if (newPosition[0] >= boundaries[0]) {
      newPosition[0] = newPosition[0] % boundaries[0];
    }

    if (newPosition[1] >= boundaries[1]) {
      newPosition[1] = newPosition[1] % boundaries[1];
    }

    this.position = newPosition;
  }
}

const varMatch = /[pv]=(-?\d+),(-?\d+)/g;
function parseCoordinate(x: string, y: string): Coordinate {
  return [Number.parseInt(x, 10), Number.parseInt(y, 10)];
}

const parseInput = (rawInput: string): Robot[] =>
  rawInput.split("\n").map((line) => {
    const [[, px, py], [, vx, vy]] = line.matchAll(varMatch);
    const position = parseCoordinate(px, py);
    const velocity = parseCoordinate(vx, vy);

    return new Robot(position, velocity);
  });

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const boundaries: Coordinate = [101, 103];
  const seconds = 100;
  // const boundaries: Coordinate = [11, 7];
  // const seconds = 5;

  for (const robot of input) {
    robot.move(seconds, boundaries);
  }

  const boundaryMidline = [Math.floor(boundaries[0] / 2), Math.floor(boundaries[1] / 2)];
  return input
    .reduce(
      (quadrantCount, robot) => {
        if (robot.position[0] < boundaryMidline[0] && robot.position[1] < boundaryMidline[1]) {
          quadrantCount[0] += 1;
        } else if (robot.position[0] > boundaryMidline[0] && robot.position[1] < boundaryMidline[1]) {
          quadrantCount[1] += 1;
        } else if (robot.position[0] < boundaryMidline[0] && robot.position[1] > boundaryMidline[1]) {
          quadrantCount[2] += 1;
        } else if (robot.position[0] > boundaryMidline[0] && robot.position[1] > boundaryMidline[1]) {
          quadrantCount[3] += 1;
        }

        return quadrantCount;
      },
      [0, 0, 0, 0] as QuadrantCounts,
    )
    .reduce((total, count) => total * count || 1, 1);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

const input = `
p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3
`;

run({
  part1: {
    tests: [
      // { input, expected: 12 }
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // { input, expected: 1 }
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

import run from "aocrunner";
import { Cell, type Coordinate, Grid, calculateCoordinates, directions, parseGrid } from "../utils/index.js";

class ImpassableCell extends Cell {}

class TrailCell extends Cell {
  elevation: number;

  constructor(coord: Coordinate, char: string) {
    super(coord);

    this.elevation = Number.parseInt(char, 10);
  }

  toChar() {
    return `${this.elevation}`;
  }
}

const parseInput = (rawInput: string) => {
  const origins: Coordinate[] = [];
  const cells = parseGrid(rawInput, (coords, char) => {
    switch (char) {
      case ".":
        return new ImpassableCell(coords);
      // biome-ignore lint/suspicious/noFallthroughSwitchClause: falls through
      case "0":
        origins.push(coords);
      default:
        return new TrailCell(coords, char);
    }
  });

  const grid = new Grid(cells);

  return { grid, origins };
};

const directionOptions = [directions.Right, directions.Down, directions.Left, directions.Up];
function* iterateDirections(coord: Coordinate, grid: Grid) {
  const elevation = (grid.getCell(coord) as TrailCell).elevation;
  const nextElevation = elevation + 1;

  for (const delta of directionOptions) {
    const nextCoord = calculateCoordinates(coord, delta);
    if (grid.isCoordinateInBounds(nextCoord) && `${nextElevation}` === grid.getCell(nextCoord).toChar()) {
      yield nextCoord;
    }
  }
}

function recurseTrail(completeTrails: Coordinate[], coord: Coordinate, grid: Grid, isDistinct = false) {
  const current = (grid.getCell(coord) as TrailCell).elevation;

  if (current === 9) {
    if (isDistinct === true || completeTrails.findIndex(([x, y]) => x === coord[0] && y === coord[1]) === -1) {
      completeTrails.push(coord);
    }
    return true;
  }

  for (const direction of iterateDirections(coord, grid)) {
    recurseTrail(completeTrails, direction, grid, isDistinct);
  }
}

const part1 = (rawInput: string) => {
  const { grid, origins } = parseInput(rawInput);

  console.log(grid.toString());

  const allTrails: Coordinate[] = [];
  for (const trailhead of origins) {
    const found: Coordinate[] = [];
    recurseTrail(found, trailhead, grid);
    allTrails.push(...found);
  }

  // console.log(allTrails);

  return allTrails.length;
};

const part2 = (rawInput: string) => {
  const { grid, origins } = parseInput(rawInput);

  console.log(grid.toString());

  const allTrails: Coordinate[] = [];
  for (const trailhead of origins) {
    const found: Coordinate[] = [];
    recurseTrail(found, trailhead, grid, true);
    allTrails.push(...found);
  }

  // console.log(allTrails);

  return allTrails.length;
};

const input = `
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732
`;

run({
  part1: {
    tests: [
      {
        input: `
          ...0...
          ...1...
          ...2...
          6543456
          7.....7
          8.....8
          9.....9
        `,
        expected: 2,
      },
      {
        input: `
          ..90..9
          ...1.98
          ...2..7
          6543456
          765.987
          876....
          987....
        `,
        expected: 4,
      },
      {
        input: `
          10..9..
          2...8..
          3...7..
          4567654
          ...8..3
          ...9..2
          .....01
        `,
        expected: 3,
      },
      { input, expected: 36 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          .....0.
          ..4321.
          ..5..2.
          ..6543.
          ..7..4.
          ..8765.
          ..9....
        `,
        expected: 3,
      },
      {
        input: `
          ..90..9
          ...1.98
          ...2..7
          6543456
          765.987
          876....
          987....
        `,
        expected: 13,
      },
      {
        input: `
          012345
          123456
          234567
          345678
          4.6789
          56789.
        `,
        expected: 227,
      },
      { input, expected: 81 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

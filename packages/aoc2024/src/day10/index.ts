import run from "aocrunner";
import {
  type Coordinates,
  calculateCoordinates,
  directions,
} from "../utils/index.js";

class Cell {
  x = 0;
  y = 0;

  constructor(coord: Coordinates) {
    this.setCoordinate(coord);
  }

  setCoordinate([x, y]: Coordinates) {
    this.x = x;
    this.y = y;
  }

  toChar(): string {
    return ".";
  }
}

class ImpassableCell extends Cell {}

class TrailCell extends Cell {
  elevation: number;

  constructor(coord: Coordinates, char: string) {
    super(coord);

    this.elevation = Number.parseInt(char, 10);
  }

  toChar() {
    return `${this.elevation}`;
  }
}

class Grid {
  cells: Cell[][] = [];

  constructor(cells: Cell[][]) {
    this.cells = cells;
  }

  setCell(cell: Cell) {
    this.cells[cell.y][cell.x] = cell;
  }

  getCell([x, y]: Coordinates) {
    return this.cells[y][x];
  }

  toString() {
    const gridString = this.cells
      .map((line) => line.map((cell) => cell.toChar()).join(""))
      .join("\n");
    return `${gridString}\n`;
  }
}

const parseInput = (rawInput: string) => {
  const origins: Coordinates[] = [];
  const grid = rawInput.split("\n").map((line, y) =>
    line.split("").map((char, x) => {
      const coords: Coordinates = [x, y];

      switch (char) {
        case ".":
          return new ImpassableCell(coords);
        // biome-ignore lint/suspicious/noFallthroughSwitchClause: falls through
        case "0":
          origins.push(coords);
        default:
          return new TrailCell(coords, char);
      }
    }),
  );

  return { grid, origins };
};

function isCoordinateInBounds([x, y]: Coordinates, grid: Cell[][]) {
  if (y >= grid.length || y < 0 || x < 0 || x >= grid[0].length) {
    return false;
  }

  return true;
}

const directionOptions = [
  directions.Right,
  directions.Down,
  directions.Left,
  directions.Up,
];
function* iterateDirections(coord: Coordinates, grid: Grid) {
  const elevation = (grid.getCell(coord) as TrailCell).elevation;
  const nextElevation = elevation + 1;

  for (const delta of directionOptions) {
    const nextCoord = calculateCoordinates(coord, delta);
    if (
      isCoordinateInBounds(nextCoord, grid.cells) &&
      `${nextElevation}` === grid.getCell(nextCoord).toChar()
    ) {
      yield nextCoord;
    }
  }
}

function recurseTrail(
  completeTrails: Coordinates[],
  coord: Coordinates,
  grid: Grid,
  isDistinct = false,
) {
  const current = (grid.getCell(coord) as TrailCell).elevation;

  if (current === 9) {
    if (
      isDistinct === true ||
      completeTrails.findIndex(([x, y]) => x === coord[0] && y === coord[1]) ===
        -1
    ) {
      completeTrails.push(coord);
    }
    return true;
  }

  for (const direction of iterateDirections(coord, grid)) {
    recurseTrail(completeTrails, direction, grid, isDistinct);
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const grid = new Grid(input.grid);

  console.log(grid.toString());

  const allTrails: Coordinates[] = [];
  for (const trailhead of input.origins) {
    const found: Coordinates[] = [];
    recurseTrail(found, trailhead, grid);
    allTrails.push(...found);
  }

  // console.log(allTrails);

  return allTrails.length;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const grid = new Grid(input.grid);

  console.log(grid.toString());

  const allTrails: Coordinates[] = [];
  for (const trailhead of input.origins) {
    const found: Coordinates[] = [];
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

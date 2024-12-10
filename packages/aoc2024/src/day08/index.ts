import run from "aocrunner";
import { calculateCoordinates, type Coordinates } from "../utils/index.js";

abstract class Cell {
  x: number = 0;
  y: number = 0;

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

class OpenCell extends Cell {
  toChar(): string {
    return ".";
  }
}

class InterferenceCell extends Cell {
  toChar(): string {
    return "#";
  }
}

class AntennaCell extends Cell {
  char: string;
  constructor(coordinates: Coordinates, char: string) {
    super(coordinates);
    this.char = char;
  }

  toChar(): string {
    return this.char;
  }
}

class Grid {
  cells: Cell[][] = [];
  // guard = new GuardCell([0, 0]);

  constructor(cells: Cell[][]) {
    this.cells = cells;
    // for (let y = 0; y < cells.length; y++) {
    //   for (let x = 0; x < cells[y].length; x++) {
    //     if (this.getCell([x, y])) {
    //       // this.guard.setCoordinate([x, y]);
    //       this.setCell(new OpenCell([x, y]));
    //     }
    //   }
    // }
  }

  setCell(cell: Cell) {
    if (cell.y >= this.cells.length || cell.y < 0 || cell.x < 0 || cell.x >= this.cells[0].length) {
      return;
    }

    this.cells[cell.y][cell.x] = cell;
  }

  getCell([x, y]: Coordinates) {
    return this.cells[y][x];
  }

  toString() {
    return this.cells.map((line) => line.map((cell) => cell.toChar()).join("")).join("\n") + "\n";
  }
}

const parseInput = (rawInput: string) => {
  const antennaPairs: { [key: string]: Coordinates[] } = {};

  const grid = rawInput.split("\n").map((line, y) =>
    line.split("").map((char, x) => {
      const coordinates: Coordinates = [x, y];

      switch (char) {
        case ".":
          return new OpenCell(coordinates);
        case "#":
          return new InterferenceCell(coordinates);
        default:
          if (antennaPairs[char] === undefined) {
            antennaPairs[char] = [];
          }

          antennaPairs[char].push(coordinates);

          return new AntennaCell(coordinates, char);
      }
    }),
  );
  return { antennaPairs, grid };
};

function calculateSlope([x1, y1]: Coordinates, [x2, y2]: Coordinates): Coordinates {
  return [x2 - x1, y2 - y1];
}

function iteratePairs(coordinates: Coordinates[]) {
  const interferenceCoordinates: Coordinates[] = [];

  for (let x = 0; x < coordinates.length; x++) {
    const remainingCoordinates = coordinates.filter((_, y) => x !== y);
    for (const coord of remainingCoordinates) {
      const slope = calculateSlope(coordinates[x], coord);
      const newCoordinate = calculateCoordinates(coord, slope);
      interferenceCoordinates.push(newCoordinate);
    }
  }

  return interferenceCoordinates;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const grid = new Grid(input.grid);
  console.log(grid.toString());

  for (const key in input.antennaPairs) {
    iteratePairs(input.antennaPairs[key])
      .map((coordinate) => new InterferenceCell(coordinate))
      .forEach((cell) => grid.setCell(cell));
  }
  console.log(grid.toString());

  return grid.cells.flat().filter((cell) => cell instanceof InterferenceCell).length;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

const input = `
............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............
`;

run({
  part1: {
    tests: [{ input, expected: 14 }],
    solution: part1,
  },
  part2: {
    tests: [{ input, expected: 1 }],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});

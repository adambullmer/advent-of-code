import run from "aocrunner";
import { Cell, type Coordinate, Grid, calculateCoordinates, parseGrid } from "../utils/grid.js";

class OpenCell extends Cell {
  character = ".";
}

class InterferenceCell extends Cell {
  character = "#";
}

class AntennaCell extends Cell {}

const parseInput = (rawInput: string) => {
  const antennaPairs: { [key: string]: Coordinate[] } = {};

  const cells = parseGrid(rawInput, (coordinates, char) => {
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
  });
  const grid = new Grid(cells);
  return { antennaPairs, grid };
};

function calculateSlope([x1, y1]: Coordinate, [x2, y2]: Coordinate): Coordinate {
  return [x2 - x1, y2 - y1];
}

function iteratePairs(coordinates: Coordinate[], grid: Grid, repeat = false) {
  const interferenceCoordinates: Coordinate[] = [];

  for (let x = 0; x < coordinates.length; x++) {
    const remainingCoordinates = coordinates.filter((_, y) => x !== y);
    for (const coord of remainingCoordinates) {
      const slope = calculateSlope(coordinates[x], coord);
      const originCoordinate = repeat ? coordinates[x] : coord;
      let newCoordinate = calculateCoordinates(originCoordinate, slope);
      while (grid.isCoordinateInBounds(newCoordinate)) {
        interferenceCoordinates.push(newCoordinate);
        if (repeat === false) {
          break;
        }
        newCoordinate = calculateCoordinates(newCoordinate, slope);
      }
    }
  }

  return interferenceCoordinates;
}

const part1 = (rawInput: string) => {
  const { grid, antennaPairs } = parseInput(rawInput);
  console.log(grid.toString());

  for (const key in antennaPairs) {
    for (const coordinate of iteratePairs(antennaPairs[key], grid)) {
      grid.setCell(new InterferenceCell(coordinate));
    }
  }
  console.log(grid.toString());

  return grid.cells.flat().filter((cell) => cell instanceof InterferenceCell).length;
};

const part2 = (rawInput: string) => {
  const { grid, antennaPairs } = parseInput(rawInput);
  console.log(grid.toString());

  for (const key in antennaPairs) {
    for (const coordinate of iteratePairs(antennaPairs[key], grid, true)) {
      grid.setCell(new InterferenceCell(coordinate));
    }
  }
  console.log(grid.toString());

  return grid.cells.flat().filter((cell) => cell instanceof InterferenceCell).length;
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
    tests: [
      {
        input: `
          T.........
          ...T......
          .T........
          ..........
          ..........
          ..........
          ..........
          ..........
          ..........
          ..........
        `,
        expected: 9,
      },
      { input, expected: 34 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

import run from "aocrunner";
import {
  Cell,
  type Coordinate,
  type DirectionChar,
  Grid,
  calculateCoordinates,
  directionInstruction,
  parseGrid,
} from "../utils/grid.js";

class PathCell extends Cell {
  score = Number.POSITIVE_INFINITY;
}

class WallCell extends Cell {
  character = "#";
}

interface Solution {
  steps: number;
  rotations: number;
  visited: Cell[];
}

function calculateRotations(currentDirection: DirectionChar, desiredDirection: DirectionChar) {
  switch (currentDirection) {
    case "^":
      switch (desiredDirection) {
        case "^":
          return 0;
        case ">":
          return 1;
        case "v":
          return 2;
        case "<":
          return 1;
      }
      break;
    case ">":
      switch (desiredDirection) {
        case "^":
          return 1;
        case ">":
          return 0;
        case "v":
          return 1;
        case "<":
          return 2;
      }
      break;
    case "v":
      switch (desiredDirection) {
        case "^":
          return 2;
        case ">":
          return 1;
        case "v":
          return 0;
        case "<":
          return 1;
      }
      break;
    case "<":
      switch (desiredDirection) {
        case "^":
          return 1;
        case ">":
          return 2;
        case "v":
          return 1;
        case "<":
          return 0;
      }
  }
}

function calculateSolutionScore({ rotations, steps }: Solution) {
  return rotations * 1000 + steps;
}

class MazeGrid extends Grid {
  start: Coordinate;
  end: Coordinate;
  solutions: Solution[] = [];
  crossroads: PathCell[] = [];

  constructor(cells: Cell[][], start: Coordinate, end: Coordinate) {
    super(cells);
    this.start = start;
    this.end = end;
  }

  isCrossroad(coordinate: Coordinate) {
    const openSides = Object.values(directionInstruction).reduce(
      (total, nextCoordinate) =>
        this.getCell(calculateCoordinates(coordinate, nextCoordinate)) instanceof PathCell ? total + 1 : total,
      0,
    );

    return openSides >= 3;
  }

  tryNext(
    currentCoordinate: Coordinate,
    currentDirection: DirectionChar,
    nextDirection: DirectionChar,
    solution: Solution,
  ) {
    const nextCoordinate = calculateCoordinates(currentCoordinate, directionInstruction[nextDirection]);
    const nextCell = this.getCell(nextCoordinate);

    if (nextCell instanceof WallCell === false && solution.visited.includes(nextCell) === false) {
      const rotations = calculateRotations(currentDirection, nextDirection);
      const nextSolution = {
        rotations: solution.rotations + rotations,
        steps: solution.steps + 1,
        visited: [...solution.visited, nextCell],
      };
      this.traverse(nextCoordinate, nextDirection, nextSolution);
    }
  }

  traverse(currentCoordinate: Coordinate, direction: DirectionChar, solution: Solution) {
    // successful solution
    if (currentCoordinate[0] === this.end[0] && currentCoordinate[1] === this.end[1]) {
      this.solutions.push(solution);
      return;
    }

    if (this.isCrossroad(currentCoordinate)) {
      const cell = this.getCell(currentCoordinate) as PathCell;
      if (this.crossroads.includes(cell) === false) {
        this.crossroads.push(cell);
      }

      const score = calculateSolutionScore(solution);
      // A strict comparison removes potential equally valid routes that have costlier beginnings.
      // This came up in the sample data. Adding a buffer for one extra turn.
      if (score <= cell.score + 1000) {
        // Current route is better than or the same as a previous route. Update state
        cell.score = score;
      } else {
        // Current score is worse than a previous route. Stop Traversing
        return;
      }
    }

    this.tryNext(currentCoordinate, direction, "^", solution);
    this.tryNext(currentCoordinate, direction, ">", solution);
    this.tryNext(currentCoordinate, direction, "v", solution);
    this.tryNext(currentCoordinate, direction, "<", solution);
  }
}

const parseInput = (rawInput: string) => {
  const startCell: Coordinate = [0, 0];
  const endCell: Coordinate = [0, 0];
  const cells = parseGrid(rawInput, (coordinate, char) => {
    switch (char) {
      case "#":
        return new WallCell(coordinate);
      case "S":
        startCell[0] = coordinate[0];
        startCell[1] = coordinate[1];
        return new PathCell(coordinate);
      case "E":
        endCell[0] = coordinate[0];
        endCell[1] = coordinate[1];
        return new PathCell(coordinate);
      default:
        return new PathCell(coordinate);
    }
  });

  return new MazeGrid(cells, startCell, endCell);
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  input.traverse(input.start, ">", { rotations: 0, steps: 0, visited: [input.getCell(input.start)] });

  return input.solutions.reduce((lowest, solution) => {
    const solutionCost = calculateSolutionScore(solution);
    return Math.min(lowest, solutionCost);
  }, Number.POSITIVE_INFINITY);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  input.traverse(input.start, ">", { rotations: 0, steps: 0, visited: [input.getCell(input.start)] });

  const optimal = input.solutions.reduce((lowest, solution) => {
    const solutionCost = calculateSolutionScore(solution);
    return Math.min(lowest, solutionCost);
  }, Number.POSITIVE_INFINITY);

  for (const solution of input.solutions.filter((solution) => optimal === calculateSolutionScore(solution))) {
    for (const cell of solution.visited) {
      cell.character = "O";
    }
  }

  console.log(input.toString());

  return new Set(
    input.solutions
      .filter((solution) => optimal === calculateSolutionScore(solution))
      .flatMap(({ visited }) => visited),
  ).size;
};

const input = `
###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############
`;

run({
  part1: {
    tests: [
      { input, expected: 7036 },
      {
        input: `
          #################
          #...#...#...#..E#
          #.#.#.#.#.#.#.#.#
          #.#.#.#...#...#.#
          #.#.#.#.###.#.#.#
          #...#.#.#.....#.#
          #.#.#.#.#.#####.#
          #.#...#.#.#.....#
          #.#.#####.#.###.#
          #.#.#.......#...#
          #.#.###.#####.###
          #.#.#...#.....#.#
          #.#.#.#####.###.#
          #.#.#.........#.#
          #.#.#.#########.#
          #S#.............#
          #################
        `,
        expected: 11048,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input, expected: 45 },
      {
        input: `
          #################
          #...#...#...#..E#
          #.#.#.#.#.#.#.#.#
          #.#.#.#...#...#.#
          #.#.#.#.###.#.#.#
          #...#.#.#.....#.#
          #.#.#.#.#.#####.#
          #.#...#.#.#.....#
          #.#.#####.#.###.#
          #.#.#.......#...#
          #.#.###.#####.###
          #.#.#...#.....#.#
          #.#.#.#####.###.#
          #.#.#.........#.#
          #.#.#.#########.#
          #S#.............#
          #################
        `,
        expected: 64,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

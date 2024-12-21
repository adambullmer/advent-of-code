import run from "aocrunner";
import {
  Cell,
  type Coordinate,
  type DirectionChar,
  Grid,
  calculateCoordinates,
  directionInstruction,
} from "../utils/grid.js";

class WallCell extends Cell {
  character = "#";
}

class PathCell extends Cell {
  score = Number.POSITIVE_INFINITY;
}

class MazeGrid extends Grid {
  start: Coordinate = [0, 0];
  end: Coordinate;

  constructor(cells: Cell[][], size: Coordinate) {
    super(cells);
    this.end = size;
  }

  iterativeTraverse(currentCoordinate: Coordinate): number {
    const startCell = this.getCell(currentCoordinate) as PathCell;
    startCell.score = 0;
    startCell.character = "O";
    const queue: PathCell[] = [startCell];

    while (queue.length > 0) {
      const cell = queue.shift() as PathCell;
      if (cell === undefined) {
        console.log("No more moves");
        break;
      }

      // successful solution
      if (cell.x === this.end[0] && cell.y === this.end[1]) {
        return cell.score;
      }

      const nextScore = cell.score + 1;

      for (const direction of [">", "v", "<", "^"] as DirectionChar[]) {
        const nextCoordinate = calculateCoordinates(cell.coordinate, directionInstruction[direction]);
        const nextCell = this.getCell(nextCoordinate) as PathCell | WallCell | undefined;

        // Next cell is a wall, or already visited more efficiently
        if (nextCell === undefined || nextCell instanceof WallCell || nextScore >= nextCell.score) {
          continue;
        }

        // Current route is better than or the same as a previous route. Update state
        nextCell.score = nextScore;
        nextCell.character = "O";
        queue.push(nextCell);
      }
    }

    return 0;
  }
}

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.split(",").map((num) => Number.parseInt(num, 10)) as Coordinate);

function createGrid([x, y]: Coordinate) {
  const cells: Cell[][] = Array(y + 1)
    .fill(".")
    .map((_, y) =>
      Array(x + 1)
        .fill(".")
        .map((char, x) => new PathCell([x, y], char)),
    );

  return new MazeGrid(cells, [x, y]);
}

function dropBytes(grid: Grid, bytes: number, coordinates: Coordinate[]) {
  for (const coordinate of coordinates.slice(0, bytes)) {
    const cell = new WallCell(coordinate);
    grid.setCell(cell);
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  // const grid = createGrid([6, 6]);
  // dropBytes(grid, 12, input);
  const grid = createGrid([70, 70]);
  dropBytes(grid, 1024, input);

  console.log(grid.toString());

  const score = grid.iterativeTraverse([0, 0]) ?? 0;

  console.log(grid.toString());

  return score;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

const input = `
5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0
`;

run({
  part1: {
    tests: [{ input, expected: 22 }],
    solution: part1,
  },
  part2: {
    tests: [{ input, expected: 1 }],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});

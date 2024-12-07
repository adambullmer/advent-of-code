import run from "aocrunner";
import { calculateCoordinates, type Coordinates, directions } from "../utils/index.js";

enum CellChar {
  Open = ".",
  Visited = "X",
  Obstacle = "#",

  GuardUp = "^",
  GuardRight = ">",
  GuardDown = "V",
  GuardLeft = "<",
}

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

  toChar(): CellChar {
    return CellChar.Open;
  }
}

class OpenCell extends Cell {
  toChar(): CellChar {
    return CellChar.Open;
  }
}

class ObstacleCell extends Cell {
  toChar() {
    return CellChar.Obstacle;
  }
}

class VisitedCell extends Cell {
  direction: CellChar[] = [];

  toChar() {
    return CellChar.Visited;
  }
}

class GuardCell extends Cell {
  direction: CellChar = CellChar.GuardUp;

  nextDirection() {
    switch (this.direction) {
      case CellChar.GuardUp:
        this.direction = CellChar.GuardRight;
        break;
      case CellChar.GuardRight:
        this.direction = CellChar.GuardDown;
        break;
      case CellChar.GuardDown:
        this.direction = CellChar.GuardLeft;
        break;
      case CellChar.GuardLeft:
        this.direction = CellChar.GuardUp;
        break;
    }
  }

  getCoordinateDelta() {
    switch (this.direction) {
      case CellChar.GuardUp:
        return directions.Up;
      case CellChar.GuardRight:
        return directions.Right;
      case CellChar.GuardDown:
        return directions.Down;
      case CellChar.GuardLeft:
        return directions.Left;
      default:
        console.log("Unexpected Movement: ", this.direction);
        return directions.Up;
    }
  }

  toChar() {
    return this.direction;
  }
}

class Grid {
  cells: Cell[][] = [];
  guard = new GuardCell([0, 0]);

  constructor(cells: Cell[][]) {
    this.cells = cells;
    for (let y = 0; y < cells.length; y++) {
      for (let x = 0; x < cells[y].length; x++) {
        if (this.getCell([x, y]) instanceof GuardCell) {
          this.guard.setCoordinate([x, y]);
          this.setCell(new OpenCell([x, y]));
        }
      }
    }
  }

  setCell(cell: Cell) {
    this.cells[cell.y][cell.x] = cell;
  }

  getCell([x, y]: Coordinates) {
    return this.cells[y][x];
  }

  moveGuard() {
    const guard = this.guard;
    const nextCoords = calculateCoordinates([this.guard.x, this.guard.y], guard.getCoordinateDelta());

    // If next move is out of bounds
    if (
      nextCoords[0] < 0 ||
      nextCoords[1] < 0 ||
      nextCoords[0] >= this.cells[0].length ||
      nextCoords[1] >= this.cells.length
    ) {
      const previousCell = new VisitedCell([guard.x, guard.y]);
      this.setCell(previousCell);
      return null;
    }

    const nextCell = this.getCell(nextCoords);
    if (nextCell instanceof ObstacleCell) {
      guard.nextDirection();
      return true;
    }

    if (this.getCell([this.guard.x, this.guard.y]) instanceof VisitedCell === false) {
      this.setCell(new VisitedCell([guard.x, guard.y]));
    }

    const previousCell = this.getCell([this.guard.x, this.guard.y]) as VisitedCell;
    if (previousCell.direction.includes(guard.direction)) {
      return false;
    }

    previousCell.direction.push(guard.direction);
    this.guard.setCoordinate(nextCoords);

    return true;
  }

  toString() {
    return this.cells.map((row) => row.map((cell) => cell.toChar()).join("")).join("\n") + "\n";
  }
}

const parseInput = (rawInput: string) => {
  const cells = rawInput.split("\n").map((rowString, rowIndex) => {
    return rowString.split("").map((char, colIndex) => {
      const coordinate: Coordinates = [colIndex, rowIndex];
      switch (char) {
        case CellChar.Obstacle:
          return new ObstacleCell(coordinate);
        case CellChar.Visited:
          return new VisitedCell(coordinate);
        case CellChar.GuardUp:
        case CellChar.GuardRight:
        case CellChar.GuardDown:
        case CellChar.GuardLeft:
          return new GuardCell(coordinate);
        case CellChar.Open:
        default:
          return new OpenCell(coordinate);
      }
    });
  });
  return new Grid(cells);
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  // console.log(input.toString(), input.guardCoord);
  while (input.moveGuard()) {
    // console.log(input.toString(), input.guardCoord);
  }
  console.log(input.toString(), input.guard.x, input.guard.y);

  return input.cells.flatMap((a) => a).filter((a) => a instanceof VisitedCell).length;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  // console.log(input.toString(), input.guardCoord);
  while (input.moveGuard()) {
    // console.log(input.toString(), input.guardCoord);
  }

  const visited = input.cells.flatMap((a) => a).filter((a) => a instanceof VisitedCell);

  let loopCount = 0;
  for (const cell of visited) {
    const input = parseInput(rawInput);
    if (input.getCell([cell.x, cell.y]) instanceof OpenCell === false) {
      continue;
    }

    input.setCell(new ObstacleCell([cell.x, cell.y]));

    while (true) {
      const moveSuccessful = input.moveGuard();
      if (moveSuccessful !== true) {
        if (moveSuccessful === false) {
          loopCount++;
        }
        break;
      }
    }
  }

  return loopCount;
};

run({
  part1: {
    tests: [
      {
        input: `
          ....#.....
          .........#
          ..........
          ..#.......
          .......#..
          ..........
          .#..^.....
          ........#.
          #.........
          ......#...
        `,
        expected: 41,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          ....#.....
          .........#
          ..........
          ..#.......
          .......#..
          ..........
          .#..^.....
          ........#.
          #.........
          ......#...
        `,
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

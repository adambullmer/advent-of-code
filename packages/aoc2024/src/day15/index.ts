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

class WallCell extends Cell {
  character = "#";
}

class CrateCell extends Cell {
  character = "O";
}

class RobotCell extends Cell {
  character = "@";
}

class WarehouseGrid extends Grid {
  robot: RobotCell;
  instructions: DirectionChar[];

  constructor(cells: Cell[][], robotCoordinates: Coordinate, instructions: DirectionChar[]) {
    super(cells);

    this.instructions = instructions;
    this.robot = this.getCell(robotCoordinates) as RobotCell;
  }

  moveCell(currentCoordinate: Coordinate, instruction: DirectionChar) {
    const currentCell = this.getCell(currentCoordinate);
    let nextCell = this.getCell(calculateCoordinates(currentCoordinate, directionInstruction[instruction]));
    if (nextCell instanceof WallCell) {
      return false;
    }

    if (nextCell instanceof CrateCell) {
      const canMove = this.moveCell(nextCell.coordinate, instruction);
      if (canMove === false) {
        return false;
      }

      nextCell = this.getCell(calculateCoordinates(currentCoordinate, directionInstruction[instruction]));
    }

    currentCell.setCoordinate(nextCell.coordinate);
    nextCell.setCoordinate(currentCoordinate);

    this.setCell(currentCell);
    this.setCell(nextCell);

    return true;
  }
}

const parseInput = (rawInput: string) => {
  const [rawGridInput, rawInstructionsInput] = rawInput.split("\n\n");
  const robotCoordinates: Coordinate = [0, 0];
  const crates: CrateCell[] = [];
  const cells = parseGrid(rawGridInput, (coordinates, char) => {
    switch (char) {
      case "#":
        return new WallCell(coordinates);
      case "O": {
        const cell = new CrateCell(coordinates);
        crates.push(cell);
        return cell;
      }
      case "@":
        robotCoordinates[0] = coordinates[0];
        robotCoordinates[1] = coordinates[1];
        return new RobotCell(coordinates);
      default:
        return new Cell(coordinates);
    }
  });

  const instructions = rawInstructionsInput.split("\n").flatMap((line) => line.split("")) as DirectionChar[];

  return { crates, grid: new WarehouseGrid(cells, robotCoordinates, instructions) };
};

const part1 = (rawInput: string) => {
  const { grid, crates } = parseInput(rawInput);

  for (const instruction of grid.instructions) {
    grid.moveCell(grid.robot.coordinate, instruction);
  }

  console.log(grid.toString());
  console.log("");

  return crates.reduce((total, crate) => total + (crate.coordinate[0] + 100 * crate.coordinate[1]), 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

const input = `
##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^
`;

run({
  part1: {
    tests: [
      {
        input: `
          ########
          #..O.O.#
          ##@.O..#
          #...O..#
          #.#.O..#
          #...O..#
          #......#
          ########

          <^^>>>vv<v>>v<<
        `,
        expected: 2028,
      },
      { input, expected: 10092 },
    ],
    solution: part1,
  },
  part2: {
    tests: [{ input, expected: 1 }],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});

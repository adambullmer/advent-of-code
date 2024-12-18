import run from "aocrunner";
import { Cell, type Coordinate, Grid, calculateCoordinates, directions, parseGrid } from "../utils/grid.js";

interface GardenGroup {
  character: string;
  cells: Cell[];
  perimeter: number;
}

class GardenGrid extends Grid {
  unusedCells: Cell[] = [];
  groups: GardenGroup[] = [];

  constructor(cells: Cell[][]) {
    super(cells);
    this.unusedCells = cells.flat();
  }

  parseGroups() {
    while (this.unusedCells.length > 0) {
      const current = this.unusedCells[0];
      const group: GardenGroup = {
        character: current.character,
        cells: [],
        perimeter: 0,
      };

      this.groups.push(group);
      this.parseGroup(current.coordinate, group);
    }
  }

  parseGroup(coordinate: Coordinate, group: GardenGroup) {
    const cell = this.getCell(coordinate);
    if (cell === undefined) {
      group.perimeter++;
      return false;
    }

    // if (cell.visited) {
    //   return;
    // }

    if (cell.character !== group.character) {
      group.perimeter++;
      return false;
    }

    const cellIndex = this.unusedCells.indexOf(cell);
    if (cellIndex === -1) {
      return null;
    }

    group.cells.push(...this.unusedCells.splice(cellIndex, 1));
    cell.visited = true;

    this.parseGroup(calculateCoordinates(cell.coordinate, directions.Up), group);
    this.parseGroup(calculateCoordinates(cell.coordinate, directions.Right), group);
    this.parseGroup(calculateCoordinates(cell.coordinate, directions.Down), group);
    this.parseGroup(calculateCoordinates(cell.coordinate, directions.Left), group);
  }
}

const parseInput = (rawInput: string) => {
  const cells = parseGrid(rawInput, (coordinate, character) => {
    const cell = new Cell(coordinate, character);

    return cell;
  });

  return new GardenGrid(cells);
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  input.parseGroups();

  return input.groups.reduce((acc, group) => acc + group.perimeter * group.cells.length, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

const input = `
RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE
`;

run({
  part1: {
    tests: [
      {
        input: `
          AAAA
          BBCD
          BBCC
          EEEC
        `,
        expected: 140,
      },
      {
        input: `
          OOOOO
          OXOXO
          OOOOO
          OXOXO
          OOOOO
        `,
        expected: 772,
      },
      { input, expected: 1930 },
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

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

  countCorners(group: GardenGroup) {
    let corners = 0;

    for (const cell of group.cells) {
      const top = calculateCoordinates(cell.coordinate, directions.Up);
      const right = calculateCoordinates(cell.coordinate, directions.Right);
      const bottom = calculateCoordinates(cell.coordinate, directions.Down);
      const left = calculateCoordinates(cell.coordinate, directions.Left);

      const topLeft = calculateCoordinates(cell.coordinate, directions.UpLeft);
      const topRight = calculateCoordinates(cell.coordinate, directions.UpRight);
      const bottomLeft = calculateCoordinates(cell.coordinate, directions.DownLeft);
      const bottomRight = calculateCoordinates(cell.coordinate, directions.DownRight);

      const topCell = this.getCell(top) as Cell;
      const rightCell = this.getCell(right) as Cell;
      const bottomCell = this.getCell(bottom) as Cell;
      const leftCell = this.getCell(left) as Cell;

      // Top Left
      // Outer Corner
      if (!group.cells.includes(topCell) && !group.cells.includes(leftCell)) {
        corners++;
      }
      // Inner Corner
      if (
        group.cells.includes(topCell) &&
        group.cells.includes(leftCell) &&
        !group.cells.includes(this.getCell(topLeft) as Cell)
      ) {
        corners++;
      }

      // Top Right
      // Outer Corner
      if (!group.cells.includes(topCell) && !group.cells.includes(rightCell)) {
        corners++;
      }
      // Inner Corner
      if (
        group.cells.includes(topCell) &&
        group.cells.includes(rightCell) &&
        !group.cells.includes(this.getCell(topRight) as Cell)
      ) {
        corners++;
      }

      // Bottom Left
      // Outer Corner
      if (!group.cells.includes(bottomCell) && !group.cells.includes(leftCell)) {
        corners++;
      }
      // Inner Corner
      if (
        group.cells.includes(bottomCell) &&
        group.cells.includes(leftCell) &&
        !group.cells.includes(this.getCell(bottomLeft) as Cell)
      ) {
        corners++;
      }

      // Bottom Right
      // Outer Corner
      if (!group.cells.includes(bottomCell) && !group.cells.includes(rightCell)) {
        corners++;
      }
      // Inner Corner
      if (
        group.cells.includes(bottomCell) &&
        group.cells.includes(rightCell) &&
        !group.cells.includes(this.getCell(bottomRight) as Cell)
      ) {
        corners++;
      }
    }

    return corners;
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

  input.parseGroups();

  return input.groups.reduce((acc, group) => {
    const corners = input.countCorners(group);
    return acc + corners * group.cells.length;
  }, 0);
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
    tests: [
      {
        input: `
          AAAA
          BBCD
          BBCC
          EEEC
        `,
        expected: 80,
      },
      {
        input: `
          OOOOO
          OXOXO
          OOOOO
          OXOXO
          OOOOO
        `,
        expected: 436,
      },
      {
        input: `
          EEEEE
          EXXXX
          EEEEE
          EXXXX
          EEEEE
        `,
        expected: 236,
      },
      {
        input: `
          AAAAAA
          AAABBA
          AAABBA
          ABBAAA
          ABBAAA
          AAAAAA
        `,
        expected: 368,
      },
      { input, expected: 1206 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

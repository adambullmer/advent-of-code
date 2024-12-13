import run from "aocrunner";
import { Cell, type Coordinate, calculateCoordinates, directions, parseGrid } from "../utils/index.js";

type Grid = Cell[][];

const parseInput = (rawInput: string) => {
  return parseGrid(rawInput, (coordinate, char) => new Cell(coordinate, char));
};

const word = "XMAS".split("");
const cross = word.slice(1);

function checkMatches(grid: Grid, [x, y]: Coordinate, direction: Coordinate, currentIndex: number): boolean {
  // console.log(grid[y][x], word[currentIndex]);
  if (currentIndex === word.length) {
    // console.log(true);
    return true;
  }
  if (grid[y][x].toChar() !== word[currentIndex]) {
    // console.log(false);
    return false;
  }
  return checkMatches(grid, calculateCoordinates([x, y], direction), direction, currentIndex + 1);
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const width = input[0].length;
  const height = input.length;
  let foundWords = 0;

  // console.log(input);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (input[y][x].toChar() === word[0]) {
        const hasDown = y + 3 < height;
        const hasUp = y - 3 >= 0;
        const hasLeft = x - 3 >= 0;
        const hasRight = x + 3 < width;
        // console.log(x, width, y, height, input[y][x], hasDown, hasUp, hasLeft, hasRight);

        if (hasDown && checkMatches(input, [x, y], directions.Down, 0)) {
          foundWords++;
        }
        if (hasUp && checkMatches(input, [x, y], directions.Up, 0)) {
          foundWords++;
        }
        if (hasLeft && checkMatches(input, [x, y], directions.Left, 0)) {
          foundWords++;
        }
        if (hasRight && checkMatches(input, [x, y], directions.Right, 0)) {
          foundWords++;
        }
        if (hasDown && hasLeft && checkMatches(input, [x, y], directions.DownLeft, 0)) {
          foundWords++;
        }
        if (hasUp && hasLeft && checkMatches(input, [x, y], directions.UpLeft, 0)) {
          foundWords++;
        }
        if (hasDown && hasRight && checkMatches(input, [x, y], directions.DownRight, 0)) {
          foundWords++;
        }
        if (hasUp && hasRight && checkMatches(input, [x, y], directions.UpRight, 0)) {
          foundWords++;
        }
      }
    }
  }

  return foundWords;
};

function getNextCharacter(grid: Grid, coordinates: Coordinate, direction: Coordinate): string {
  const [x, y] = calculateCoordinates(coordinates, direction);
  return grid[y][x].toChar();
}

function isCrossCorner(letter: string) {
  return letter === cross[0] || letter === cross[2];
}

function checkCrossMatch(corner1: string, corner2: string) {
  return isCrossCorner(corner1) && isCrossCorner(corner2) && corner1 !== corner2;
}

function checkAround(grid: Grid, coordinates: Coordinate): boolean {
  const isDiagonalUpValid = checkCrossMatch(
    getNextCharacter(grid, coordinates, directions.UpRight),
    getNextCharacter(grid, coordinates, directions.DownLeft),
  );
  if (!isDiagonalUpValid) {
    return false;
  }

  const isDiagonalDownValid = checkCrossMatch(
    getNextCharacter(grid, coordinates, directions.DownRight),
    getNextCharacter(grid, coordinates, directions.UpLeft),
  );
  if (!isDiagonalDownValid) {
    return false;
  }

  return true;
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const width = input[0].length;
  const height = input.length;
  let foundWords = 0;

  // console.log(input);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      if (input[y][x].toChar() === cross[1]) {
        // console.log(x, width, y, height, input[y][x], hasDown, hasUp, hasLeft, hasRight);
        if (checkAround(input, [x, y])) {
          foundWords++;
        }
      }
    }
  }

  return foundWords;
};

run({
  part1: {
    tests: [
      {
        input: `
          ..X...
          .SAMX.
          .A..A.
          XMAS.S
          .X....
        `,
        expected: 4,
      },
      {
        input: `
          MMMSXXMASM
          MSAMXMSMSA
          AMXSXMAAMM
          MSAMASMSMX
          XMASAMXAMM
          XXAMMXXAMA
          SMSMSASXSS
          SAXAMASAAA
          MAMMMXMMMM
          MXMXAXMASX
        `,
        expected: 18,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          .M.S......
          ..A..MSMS.
          .M.S.MAA..
          ..A.ASMSM.
          .M.S.M....
          ..........
          S.S.S.S.S.
          .A.A.A.A..
          M.M.M.M.M.
          ..........
        `,
        expected: 9,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

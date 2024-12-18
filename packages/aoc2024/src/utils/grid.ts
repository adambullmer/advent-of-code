export type Coordinate = [number, number];
export type CellHandler = (coordinate: Coordinate, character: string) => Cell;

export type DirectionChar = "v" | "<" | ">" | "^";
export const directions: Record<string, Coordinate> = {
  Up: [0, -1],
  Down: [0, 1],
  Left: [-1, 0],
  Right: [1, 0],

  UpRight: [1, -1],
  DownRight: [1, 1],
  UpLeft: [-1, -1],
  DownLeft: [-1, 1],
} as const;
export const directionInstruction: Record<DirectionChar, Coordinate> = {
  ">": directions.Right,
  v: directions.Down,
  "<": directions.Left,
  "^": directions.Up,
};

export function calculateCoordinates([x, y]: Coordinate, [dx, dy]: Coordinate): Coordinate {
  return [x + dx, y + dy];
}

export class Cell {
  coordinate: Coordinate = [0, 0];
  character = ".";
  visited = false;

  constructor(coord: Coordinate, character?: string) {
    this.setCoordinate(coord);

    if (character !== undefined) {
      this.character = character;
    }
  }

  setCoordinate(coordinate: Coordinate) {
    this.coordinate = coordinate;
  }

  get x() {
    return this.coordinate[0];
  }

  get y() {
    return this.coordinate[1];
  }

  toChar(): string {
    return this.character;
  }
}

export class Grid {
  cells: Cell[][];

  constructor(cells: Cell[][]) {
    this.cells = cells;
  }

  setCell(cell: Cell) {
    this.cells[cell.y][cell.x] = cell;
  }

  getCell([x, y]: Coordinate) {
    if (x < 0 || y < 0 || y >= this.cells.length || x >= this.cells[0].length) {
      return undefined;
    }

    return this.cells[y][x];
  }

  isCoordinateInBounds([x, y]: Coordinate) {
    if (y >= this.cells.length || y < 0 || x < 0 || x >= this.cells[0].length) {
      return false;
    }

    return true;
  }

  toString() {
    const gridString = this.cells.map((line) => line.map((cell) => cell.toChar()).join("")).join("\n");
    return `${gridString}\n`;
  }
}

export const parseGrid = (rawInput: string, cellHandler: CellHandler) =>
  rawInput.split("\n").map((line, y) => line.split("").map((character, x) => cellHandler([x, y], character)));

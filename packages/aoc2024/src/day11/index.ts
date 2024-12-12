import run from "aocrunner";

type StoneEntry = [string, number];

class Stones {
  map: Map<string, number> = new Map();
  constructor(stones: StoneEntry[]) {
    for (const [stone, count] of stones) {
      this.setStone(stone, count);
    }
  }

  setStone(stone: string, count = 1) {
    const existing = this.map.get(stone) ?? 0;

    this.map.set(stone, existing + count);
  }

  total() {
    let total = 0;
    for (const count of this.map.values()) {
      total += count;
    }
    return total;
  }
}

const parseInput = (rawInput: string) => {
  const map = new Stones(rawInput.split(" ").map((stone) => [stone, 1]));

  return map;
};

function handleZero(stone: string) {
  return "1";
}

function handleEven(stone: string) {
  const middleIndex = stone.length / 2;
  return [stone.slice(0, middleIndex), `${Number.parseInt(stone.slice(middleIndex), 10)}`];
}

function handleDefault(stone: string) {
  return `${Number.parseInt(stone, 10) * 2024}`;
}

function changeStone(stone: string) {
  if (stone === "0") {
    return [handleZero(stone)];
  }

  if (stone.length % 2 === 0) {
    return handleEven(stone);
  }

  return [handleDefault(stone)];
}

function blink(stones: Stones) {
  const newStones: StoneEntry[] = [];
  for (const [stone, count] of stones.map.entries()) {
    newStones.push(...changeStone(stone).map<StoneEntry>((stone) => [stone, count]));
  }

  return new Stones(newStones);
}

const part1 = (rawInput: string) => {
  let stones = parseInput(rawInput);

  // console.log(stones);

  const totalBlinks = 25;
  for (let x = 0; x < totalBlinks; x++) {
    // console.log(`Blink ${x}:`, stones.map.size, stones.total());
    stones = blink(stones);
    // console.log(stones);
  }

  return stones.total();
};

const part2 = (rawInput: string) => {
  let stones = parseInput(rawInput);

  // console.log(stones);

  const totalBlinks = 75;
  for (let x = 0; x < totalBlinks; x++) {
    // console.log(`Blink ${x}:`, stones.length);
    stones = blink(stones);
    // console.log(stones);
  }

  return stones.total();
};

const input = `
125 17
`;

run({
  part1: {
    tests: [{ input, expected: 55312 }],
    solution: part1,
  },
  part2: {
    tests: [{ input, expected: 65601038650482 }],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split(" ");

function handleZero(_stone: string) {
  return "1";
}

function handleEven(stone: string) {
  const middleIndex = stone.length / 2;
  return [stone.slice(0, middleIndex), `${Number.parseInt(stone.slice(middleIndex), 10)}`];
}

function handleDefault(stone: string) {
  return `${Number.parseInt(stone, 10) * 2024}`;
}

function changeStone(stone: string): string[] {
  if (stone === "0") {
    return [handleZero(stone)];
  }

  if (stone.length % 2 === 0) {
    return handleEven(stone);
  }

  return [handleDefault(stone)];
}

function blink(stones: string[]) {
  for (let x = 0; x < stones.length; x++) {
    const newStones = changeStone(stones[x]);
    stones.splice(x, 1, ...newStones);
    x += newStones.length - 1;
  }
}

const part1 = (rawInput: string) => {
  const stones = parseInput(rawInput);

  // console.log(stones);

  const totalBlinks = 25;
  for (let x = 0; x < totalBlinks; x++) {
    console.log(`Blink ${x}:`, stones.length);
    blink(stones);
    // console.log(stones);
  }

  return stones.length;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
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
    tests: [{ input, expected: 1 }],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});

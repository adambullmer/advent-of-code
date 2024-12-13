import run from "aocrunner";
import type { Coordinate } from "../utils/index.js";

type Machine = [Coordinate, Coordinate, Coordinate];

const parseInput: (rawInput: string) => Machine[] = (rawInput: string) =>
  rawInput.split("\n\n").map<Machine>(
    (machine) =>
      machine.split("\n").map(
        (line) =>
          line
            .split(": ")[1]
            .split(", ")
            .map((axis) => Number.parseInt(axis.split(/[+=]/)[1], 10)) as Coordinate,
      ) as Machine,
  );

function checkIteration(i: number, buttonA: Coordinate, buttonB: Coordinate, destination: Coordinate) {
  if ((destination[0] - buttonB[0] * i) % buttonA[0] === 0 && (destination[1] - buttonB[1] * i) % buttonA[1] === 0) {
    const j1 = (destination[0] - buttonB[0] * i) / buttonA[0];
    const j2 = (destination[1] - buttonB[1] * i) / buttonA[1];
    if (j1 === j2) {
      return j1;
    }
  }

  return false;
}

function isButtonDivisible(buttonA: Coordinate, buttonB: Coordinate, destination: Coordinate) {
  for (let i = 0; i < 100; i++) {
    const j = checkIteration(i, buttonA, buttonB, destination);
    if (j !== false) {
      return [j, i];
    }
  }
  return false;
}

function calculateTokens(buttonA: Coordinate, buttonB: Coordinate, destination: Coordinate): number {
  const buttonPushes = isButtonDivisible(buttonA, buttonB, destination);
  if (buttonPushes === false) {
    return 0;
  }

  console.log(buttonPushes);
  return buttonPushes[0] * 3 + buttonPushes[1];
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let tokens = 0;
  for (const machine of input) {
    tokens += calculateTokens(...machine);
  }

  return tokens;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

const input = `
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279
`;

run({
  part1: {
    tests: [{ input, expected: 480 }],
    solution: part1,
  },
  part2: {
    tests: [{ input, expected: 1 }],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});

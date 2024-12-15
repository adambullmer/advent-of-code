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

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let tokens = 0;
  for (const machine of input) {
    tokens += calculateTokensBig(...machine);
  }

  return tokens;
};

function solveAlgebra(buttonA: Coordinate, buttonB: Coordinate, destination: Coordinate): false | Coordinate {
  const det = buttonA[0] * buttonB[1] - buttonA[1] * buttonB[0];

  if (det === 0) {
    return false;
  }

  return [
    (destination[0] * buttonB[1] - destination[1] * buttonB[0]) / det,
    (buttonA[0] * destination[1] - buttonA[1] * destination[0]) / det,
  ];
}

function calculateTokensBig(buttonA: Coordinate, buttonB: Coordinate, destination: Coordinate): number {
  const buttonPushes = solveAlgebra(buttonA, buttonB, destination);
  if (buttonPushes === false) {
    return 0;
  }

  if (Math.floor(buttonPushes[0]) !== buttonPushes[0]) {
    return 0;
  }

  if (Math.floor(buttonPushes[1]) !== buttonPushes[1]) {
    return 0;
  }

  if (
    buttonPushes[0] * buttonA[0] + buttonPushes[1] * buttonB[0] !== destination[0] ||
    buttonPushes[0] * buttonA[1] + buttonPushes[1] * buttonB[1] !== destination[1]
  ) {
    return 0;
  }

  return buttonPushes[0] * 3 + buttonPushes[1];
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const modifier = 10000000000000;
  let tokens = 0;
  for (const machine of input) {
    machine[2][0] += modifier;
    machine[2][1] += modifier;

    tokens += calculateTokensBig(...machine);
  }

  return tokens;
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
    tests: [{ input, expected: 875318608908 }],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

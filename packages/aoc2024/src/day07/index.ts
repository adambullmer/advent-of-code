import run from "aocrunner";

enum Operation {
  Add = "+",
  Subtract = "-",
  Multiply = "*",
  Divide = "/",
}

interface Calibration {
  expected: number;
  inputs: number[];
  // operations: Operation[];
}

const parseInput = (rawInput: string): Calibration[] => {
  return rawInput.split("\n").map((line) => {
    const [expected, ...inputs] = line
      .split(/:?\s+/g)
      .map((num) => parseInt(num, 10));
    // const operations = new Array(inputs.length - 1).fill(Operation.Add);

    // If it's evenly divisible, it is possibly a multiple
    // for (let x = 1; x < inputs.length; x++) {
    //   if (expected % inputs[x] === 0) {
    //     operations[x-1] = Operation.Multiply;
    //   }
    // }

    return { expected, inputs };
  });
};

// function checkMath(expected: number, inputs: number[], operations: Operation[]): boolean {
//   let total = inputs[0];
//   for (let x = 0; x < operations.length; x++) {
//     switch (operations[x]) {
//       case Operation.Add:
//         total = add(total, inputs[x]);
//       case Operation.Multiply:
//         total = multiply(total, inputs[x]);
//     }
//   }

//   return expected === total;
// }

const add = (x: number, y: number): number => x + y;
const multiply = (x: number, y: number): number => x * y;
const concatenate = (x: number, y: number): number => parseInt(`${x}${y}`, 10);

function recurseMath(
  expected: number,
  total: number,
  inputs: number[],
): boolean {
  if (inputs.length === 0) {
    // console.log(expected, total);
    return expected === total;
  }

  const num = inputs[0];
  const rest = inputs.slice(1);
  if (recurseMath(expected, add(total, num), rest)) {
    return true;
  }

  if (recurseMath(expected, multiply(total, num), rest)) {
    return true;
  }

  return recurseMath(expected, concatenate(total, num), rest);
}

// function validateCalibration(calibration: Calibration): boolean {
//   return checkMath(calibration.expected, calibration.inputs, );
//   // return true;
// }

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input
    .filter((calibration) =>
      recurseMath(
        calibration.expected,
        calibration.inputs[0],
        calibration.inputs.slice(1),
      ),
    )
    .reduce((total, { expected }) => total + expected, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input
    .filter((calibration) =>
      recurseMath(
        calibration.expected,
        calibration.inputs[0],
        calibration.inputs.slice(1),
      ),
    )
    .reduce((total, { expected }) => total + expected, 0);
};

const input = `
190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20
`;

run({
  part1: {
    tests: [{ input, expected: 3749 }],
    solution: part1,
  },
  part2: {
    tests: [{ input, expected: 11387 }],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

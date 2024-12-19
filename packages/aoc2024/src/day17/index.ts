import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const parts = rawInput.split("\n\n");
  const registers = parts[0].split("\n").map((line) => Number.parseInt(line.split(": ")[1], 10));
  const program = parts[1]
    .split(": ")[1]
    .split(",")
    .map((num) => Number.parseInt(num, 8));

  return { registers, program };
};

function comboOperandValue(operand: number, registers: number[]) {
  switch (operand) {
    case 1:
    case 2:
    case 3:
      return operand;
    case 4:
    case 5:
    case 6:
      return registers[operand - 4];
    default:
      throw new Error(`Invalid Input: ${operand}`);
  }
}

function adv(operand: number, registers: number[]) {
  console.log("adv", operand, registers);
  const numerator = registers[0];
  const denominator = 2 ** comboOperandValue(operand, registers);
  registers[0] = Math.floor(numerator / denominator);
}

function bxl(operand: number, registers: number[]) {
  console.log("bxl", operand, registers);
  registers[1] ^= operand;
}

function bst(operand: number, registers: number[]) {
  console.log("bst", operand, registers);
  registers[1] = comboOperandValue(operand, registers) % 8;
}

function jnz(operand: number, registers: number[]) {
  console.log("jnz", operand, registers, registers[0] === 0 ? 0 : operand);
  return registers[0] === 0 ? undefined : operand;
}

function bxc(operand: number, registers: number[]) {
  console.log("bxc", operand, registers);
  registers[1] ^= registers[2];
}

function out(operand: number, registers: number[]) {
  console.log("out", operand, registers);
  return comboOperandValue(operand, registers) % 8;
}

function bdv(operand: number, registers: number[]) {
  console.log("bdv", operand, registers);
  const numerator = registers[0];
  const denominator = 2 ** comboOperandValue(operand, registers);
  registers[1] = Math.floor(numerator / denominator);
}

function cdv(operand: number, registers: number[]) {
  console.log("cdv", operand, registers);
  const numerator = registers[0];
  const denominator = 2 ** comboOperandValue(operand, registers);
  registers[2] = Math.floor(numerator / denominator);
}

function runProgram(opcode: number, operand: number, registers: number[], output: number[]) {
  switch (opcode) {
    case 0:
      adv(operand, registers);
      break;
    case 1:
      bxl(operand, registers);
      break;
    case 2:
      bst(operand, registers);
      break;
    case 3: {
      const pointer = jnz(operand, registers);
      if (pointer !== undefined) {
        return pointer;
      }
      break;
    }
    case 4:
      bxc(operand, registers);
      break;
    case 5:
      output.push(out(operand, registers));
      break;
    case 6:
      bdv(operand, registers);
      break;
    case 7:
      cdv(operand, registers);
      break;
    default:
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let pointer = 0;
  const output: number[] = [];
  while (pointer < input.program.length) {
    const opcode = input.program[pointer];
    const operand = input.program[pointer + 1];
    if (opcode === undefined || operand === undefined) {
      break;
    }

    const newPointer = runProgram(opcode, operand, input.registers, output);
    if (newPointer !== undefined) {
      pointer = newPointer;
      continue;
    }

    pointer += 2;
  }

  return output.join(",");
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

const input = `
Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0
`;

run({
  part1: {
    tests: [{ input, expected: "4,6,3,5,6,3,5,2,1,0" }],
    solution: part1,
  },
  part2: {
    tests: [{ input, expected: 1 }],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});

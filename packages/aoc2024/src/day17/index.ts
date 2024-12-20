import run from "aocrunner";

type Registers = bigint[];

const parseInput = (rawInput: string) => {
  const parts = rawInput.split("\n\n");
  const registers: Registers = parts[0].split("\n").map((line) => BigInt(line.split(": ")[1]));
  const program = parts[1]
    .split(": ")[1]
    .split(",")
    .map((num) => BigInt(num));

  return { registers, program };
};

function comboOperandValue(operand: bigint, registers: Registers) {
  switch (operand) {
    case 1n:
    case 2n:
    case 3n:
      return operand;
    case 4n:
    case 5n:
    case 6n:
      return registers[Number(operand) - 4];
    default:
      throw new Error(`Invalid Input: ${operand}`);
  }
}

function adv(operand: bigint, registers: Registers) {
  const numerator = registers[0];
  const denominator = 2n ** comboOperandValue(operand, registers);
  // console.log(
  //   `adv -- A = ${numerator} / 2**${comboOperandValue(operand, registers)} = ${Math.floor(numerator / denominator)}`,
  //   operand,
  //   registers,
  // );
  registers[0] = numerator / denominator;
}

function bxl(operand: bigint, registers: Registers) {
  // console.log(`bxl -- B = ${registers[1]} XOR ${operand} = ${registers[1] ^ operand}`, operand, registers);
  registers[1] ^= operand;
}

function bst(operand: bigint, registers: Registers) {
  // console.log(
  //   `bst -- B = ${comboOperandValue(operand, registers)} % 8 = ${comboOperandValue(operand, registers) % 8}`,
  //   operand,
  //   registers,
  // );
  registers[1] = comboOperandValue(operand, registers) % 8n;
}

function jnz(operand: bigint, registers: Registers) {
  // console.log(`jnz -- ${registers[0] === 0 ? undefined : operand}`, operand, registers);
  return registers[0] === 0n ? undefined : operand;
}

function bxc(operand: bigint, registers: Registers) {
  // console.log(`bxc -- ${registers[1]} ^ ${registers[2]} = ${registers[1] ^ registers[2]}`, operand, registers);
  registers[1] ^= registers[2];
}

function out(operand: bigint, registers: Registers) {
  // console.log(
  //   `out -- ${comboOperandValue(operand, registers)} % 8 - ${comboOperandValue(operand, registers) % 8}`,
  //   operand,
  //   registers,
  // );
  return comboOperandValue(operand, registers) % 8n;
}

function bdv(operand: bigint, registers: Registers) {
  // console.log("bdv", operand, registers);
  const numerator = registers[0];
  const denominator = 2n ** comboOperandValue(operand, registers);
  registers[1] = numerator / denominator;
}

function cdv(operand: bigint, registers: Registers) {
  const numerator = registers[0];
  const denominator = 2n ** comboOperandValue(operand, registers);
  // console.log(
  //   `cdv -- C = ${numerator} / 2**${comboOperandValue(operand, registers)} = ${Math.floor(numerator / denominator)}`,
  //   operand,
  //   registers,
  // );
  registers[2] = numerator / denominator;
}

function runOpcode(opcode: bigint, operand: bigint, registers: Registers, output: bigint[]) {
  switch (opcode) {
    case 0n:
      adv(operand, registers);
      break;
    case 1n:
      bxl(operand, registers);
      break;
    case 2n:
      bst(operand, registers);
      break;
    case 3n: {
      const pointer = jnz(operand, registers);
      if (pointer !== undefined) {
        return pointer;
      }
      break;
    }
    case 4n:
      bxc(operand, registers);
      break;
    case 5n:
      output.push(out(operand, registers));
      break;
    case 6n:
      bdv(operand, registers);
      break;
    case 7n:
      cdv(operand, registers);
      break;
    default:
  }
}

function* runProgram(instructions: bigint[], registers: Registers) {
  let pointer = 0n;
  const output: bigint[] = [];
  while (pointer < instructions.length) {
    const opcode = instructions[Number(pointer)];
    const operand = instructions[Number(pointer) + 1];
    if (opcode === undefined || operand === undefined) {
      break;
    }

    const newPointer = runOpcode(opcode, operand, registers, output);
    if (newPointer !== undefined) {
      yield output[output.length - 1];
      pointer = newPointer;
      continue;
    }

    pointer += 2n;
  }

  yield output[output.length - 1];
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const output = [...runProgram(input.program, input.registers)];

  return output.join(",");
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const solution = input.program.join(",");

  function findBit(bits: bigint[]): bigint | undefined {
    const base = bits.reduce((acc, num) => (acc << 3n) | num, 0n) << 3n;
    for (let x = 0n; x <= 7n; x++) {
      const registers: Registers = [x | base, 0n, 0n];
      const generator = runProgram(input.program, registers);
      const output = generator.next().value;
      if (solution === [output, ...generator].join(",")) {
        console.log("success");
        return x + base;
      }

      if (input.program[input.program.length - bits.length - 1] === output) {
        const result = findBit([...bits, x]);
        if (result !== undefined) {
          return result;
        }
      }
    }
  }

  return findBit([]);
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
    tests: [
      {
        input: `
          Register A: 0
          Register B: 0
          Register C: 0

          Program: 2,4,1,1,7,5,4,6,1,4,0,3,5,5,3,0
        `,
        expected: 202366627359274n,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

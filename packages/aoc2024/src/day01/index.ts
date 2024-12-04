import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const left: number[] = [];
  const right: number[] = [];
  for (const line of rawInput.split("\n")) {
    if (line === "") {
      continue;
    }
    const pairs = line.split(/\s+/);
    left.push(Number.parseInt(pairs[0].trim(), 10));
    right.push(Number.parseInt(pairs[1].trim(), 10));
  }

  return [left, right];
};

const part1 = (rawInput: string) => {
  const [left, right] = parseInput(rawInput);

  left.sort();
  right.sort();

  return left.reduce((total, leftNumber, leftIndex) => {
    return total + Math.abs(leftNumber - right[leftIndex]);
  }, 0);
};

function aggregateOccurrences(list: number[]) {
  const occurrences = new Map();
  for (const x of list) {
    occurrences.set(x, (occurrences.get(x) ?? 0) + 1);
  }

  return occurrences;
}

const part2 = (rawInput: string) => {
  const [left, right] = parseInput(rawInput);
  const rightOccurrences = aggregateOccurrences(right);

  return left.reduce((total, leftNumber) => {
    const similarityScore = leftNumber * (rightOccurrences.get(leftNumber) ?? 0);

    return total + similarityScore;
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `
          3   4
          4   3
          2   5
          1   3
          3   9
          3   3
        `,
        expected: 11,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        3   4
        4   3
        2   5
        1   3
        3   9
        3   3
      `,
        expected: 31,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

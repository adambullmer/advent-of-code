import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const reports: number[][] = [];
  for (const line of rawInput.split("\n")) {
    if (line === "") {
      continue;
    }
    const levels = line.split(/\s+/).map((item) => parseInt(item, 10));
    reports.push(levels);
  }

  return reports;
};

const minDelta = 1;
const maxDelta = 3;
function removeItemAt(levels: number[], index: number) {
  return [...levels.slice(0, index), ...levels.slice(index + 1)];
}

function checkLevels(levels: number[]) {
  if (levels.length < 2) {
    return true;
  }

  const isAscending = levels[1] - levels[0] > 0;
  for (let x = 1; x < levels.length; x++) {
    const delta = levels[x] - levels[x - 1];
    const deltaAscending = delta > 0;
    if (deltaAscending !== isAscending) {
      return false;
    }
    if (Math.abs(delta) < minDelta || Math.abs(delta) > maxDelta) {
      return false;
    }
  }
  return true;
}

const part1 = (rawInput: string) => {
  const reports = parseInput(rawInput);

  return reports.filter(checkLevels).length;
};

const part2 = (rawInput: string) => {
  const reports = parseInput(rawInput);

  return reports.filter((levels) => {
    return [levels, ...levels.map((_, index) => removeItemAt(levels, index))].some(checkLevels);
  }).length;
};

run({
  part1: {
    tests: [
      {
        input: `
          7 6 4 2 1
          1 2 7 8 9
          9 7 6 2 1
          1 3 2 4 5
          8 6 4 4 1
          1 3 6 7 9
        `,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          7 6 4 2 1
          1 2 7 8 9
          9 7 6 2 1
          1 3 2 4 5
          8 6 4 4 1
          1 3 6 7 9
        `,
        expected: 4,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

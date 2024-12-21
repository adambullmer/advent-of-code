import run from "aocrunner";

type TowelMap = Record<string, boolean>;
type Towels = {
  map: TowelMap;
  bounds: {
    min: number;
    max: number;
  };
};

const parseInput = (rawInput: string) => {
  const towels = rawInput
    .split("\n\n")[0]
    .split(", ")
    .reduce(
      (acc, towel) => {
        acc.map[towel] = true;
        acc.bounds.min = Math.min(towel.length, acc.bounds.min);
        acc.bounds.max = Math.max(towel.length, acc.bounds.max);

        return acc;
      },
      { map: {}, bounds: { min: 1, max: 1 } } as Towels,
    );

  const patterns = rawInput.split("\n\n")[1].split("\n");

  return { towels, patterns };
};

function checkPattern(pattern: string, towelMap: Towels) {
  if (pattern === "") {
    return true;
  }

  let end = towelMap.bounds.min;
  while (end <= towelMap.bounds.max) {
    if (!towelMap.map[pattern.slice(0, end)]) {
      end++;
      continue;
    }

    if (checkPattern(pattern.slice(end), towelMap)) {
      return true;
    }
    end++;
  }

  return false;
}

function enumeratePattern(pattern: string, towelMap: Towels, cache: Record<string, number>): number {
  if (pattern === "") {
    return 1;
  }

  if (cache[pattern] !== undefined) {
    return cache[pattern];
  }

  let total = 0;
  let end = towelMap.bounds.min;
  while (end <= towelMap.bounds.max && end <= pattern.length) {
    if (!towelMap.map[pattern.slice(0, end)]) {
      end++;
      continue;
    }

    total += enumeratePattern(pattern.slice(end), towelMap, cache);
    end++;
  }

  cache[pattern] = total;

  return total;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.patterns.filter((pattern) => checkPattern(pattern, input.towels)).length;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.patterns.reduce((total, pattern) => total + enumeratePattern(pattern, input.towels, {}), 0);
};

const input = `
r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb
`;

run({
  part1: {
    tests: [{ input, expected: 6 }],
    solution: part1,
  },
  part2: {
    tests: [{ input, expected: 16 }],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

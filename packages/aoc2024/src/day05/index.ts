import run from "aocrunner";

type RuleMap = {
  [key: string]: {
    before: string[];
    after: string[];
  };
};

const parseInput = (rawInput: string) => {
  const [rawRules, rawUpdates] = rawInput.split("\n\n");
  const updates = rawUpdates.split("\n").map((update) => update.split(","));
  const rules = rawRules.split("\n").map((rule) => rule.split("|"));
  const ruleMap: RuleMap = {};
  for (const [before, after] of rules) {
    // if (!update.includes(before)) {
    //   continue;
    // }

    if (ruleMap[before] === undefined) {
      ruleMap[before] = { before: [], after: [] };
    }
    if (ruleMap[after] === undefined) {
      ruleMap[after] = { before: [], after: [] };
    }

    ruleMap[before].before.push(after);
    ruleMap[after].after.push(before);
  }

  return { rules: ruleMap, updates };
};

function isBefore(currentIndex: number, target: string, list: string[]) {
  const targetIndex = list.indexOf(target);
  return targetIndex === -1 || targetIndex > currentIndex;
}
function isAfter(currentIndex: number, target: string, list: string[]) {
  const targetIndex = list.indexOf(target);
  return targetIndex === -1 || targetIndex < currentIndex;
}

function generateRules(rules: string[][], update: string[]): RuleMap {
  const ruleMap: RuleMap = {};

  for (const [before, after] of rules) {
    if (!update.includes(before)) {
      continue;
    }

    if (ruleMap[before] === undefined) {
      ruleMap[before] = { before: [], after: [] };
    }
    if (ruleMap[after] === undefined) {
      ruleMap[after] = { before: [], after: [] };
    }

    ruleMap[before].before.push(after);
    ruleMap[after].after.push(before);
  }

  return ruleMap;
}

function filterValidRules(rules: RuleMap, update: string[]): boolean {
  for (let x = 0; x < update.length; x++) {
    const page = update[x];
    const rule = rules[page];
    if (!rule.before.every((target) => isBefore(x, target, update))) {
      return false;
    }
    if (!rule.after.every((target) => isAfter(x, target, update))) {
      return false;
    }
  }

  return true;
}

const part1 = (rawInput: string) => {
  const { rules, updates } = parseInput(rawInput);

  return updates
    .filter((update) => filterValidRules(rules, update))
    .map((update) => {
      const middle = (update.length - 1) / 2;
      return Number.parseInt(update[middle], 10);
    })
    .reduce((total, page) => total + page, 0);
};

function fixInvalidUpdate(rules: RuleMap, update: string[]) {
  return [...update].sort((a, b) => (rules[a].before.includes(b) ? -1 : 1));
}

const part2 = (rawInput: string) => {
  const { rules, updates } = parseInput(rawInput);

  return updates
    .filter((update) => !filterValidRules(rules, update))
    .map((update) => fixInvalidUpdate(rules, update))
    .map((update) => {
      const middle = (update.length - 1) / 2;
      return Number.parseInt(update[middle], 10);
    })
    .reduce((total, page) => total + page, 0);
};

run({
  part1: {
    tests: [
      {
        input: `
          47|53
          97|13
          97|61
          97|47
          75|29
          61|13
          75|53
          29|13
          97|29
          53|29
          61|53
          97|53
          61|29
          47|13
          75|47
          97|75
          47|61
          75|61
          47|29
          75|13
          53|13

          75,47,61,53,29
          97,61,53,29,13
          75,29,13
          75,97,47,61,53
          61,13,29
          97,13,75,29,47
        `,
        expected: 143,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          47|53
          97|13
          97|61
          97|47
          75|29
          61|13
          75|53
          29|13
          97|29
          53|29
          61|53
          97|53
          61|29
          47|13
          75|47
          97|75
          47|61
          75|61
          47|29
          75|13
          53|13

          75,47,61,53,29
          97,61,53,29,13
          75,29,13
          75,97,47,61,53
          61,13,29
          97,13,75,29,47
        `,
        expected: 123,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

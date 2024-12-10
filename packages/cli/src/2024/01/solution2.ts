function parseInput(input: string): [number[], number[]] {
  const left: number[] = [];
  const right: number[] = [];
  for (const line of input.split("\n")) {
    if (line === "") {
      continue;
    }
    const pairs = line.split(/\s+/);
    left.push(Number.parseInt(pairs[0].trim(), 10));
    right.push(Number.parseInt(pairs[1].trim(), 10));
  }

  return [left, right];
}

function aggregateList(list: number[]) {
  const occurrences = new Map();
  for (const x of list) {
    occurrences.set(x, (occurrences.get(x) ?? 0) + 1);
  }

  return occurrences;
}

export async function solution(input: string) {
  const [left, right] = parseInput(input);
  const rightOccurrences = aggregateList(right);

  return left.reduce((total, leftNumber) => {
    const similarityScore =
      leftNumber * (rightOccurrences.get(leftNumber) ?? 0);

    return total + similarityScore;
  }, 0);
}

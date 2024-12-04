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

export async function solution(input: string) {
  const [left, right] = parseInput(input);
  left.sort();
  right.sort();

  return left.reduce((total, leftNumber, leftIndex) => {
    const rightNumber = right[leftIndex];

    return total + Math.abs(leftNumber - rightNumber);
  }, 0);
}

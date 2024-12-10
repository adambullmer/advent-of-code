import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("");

function transformMapToIdBlocks(rawMap: string[]) {
  return rawMap.flatMap((char, i) => {
    const num = parseInt(char, 10);
    const id = i % 2 === 0 ? `${i / 2}` : ".";
    return Array(num).fill(id);
  });
}

function compactDiskIds(fileIds: string[]) {
  let x = fileIds.indexOf(".");
  let y = fileIds.length - 1;
  while (x <= y) {
    while (fileIds[y] === ".") {
      y--;
    }
    while (fileIds[x] !== ".") {
      x++;
    }
    if (x >= y) {
      break;
    }
    [fileIds[x], fileIds[y]] = [fileIds[y], fileIds[x]];
    // console.log(diskArr.join(""));
  }

  return fileIds;
}

const part1 = (rawInput: string) => {
  const rawMap = parseInput(rawInput);
  const fileIds = transformMapToIdBlocks(rawMap);
  console.log(fileIds.join(""));
  const compactIds = compactDiskIds(fileIds);
  console.log(compactIds.join(""));

  return compactIds.slice(0, compactIds.indexOf(".")).reduce((t, x, i) => t + parseInt(x, 10) * i, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

const input = `
2333133121414131402
`;

run({
  part1: {
    tests: [
      { input: "12345", expected: 60 },
      { input, expected: 1928 },
    ],
    solution: part1,
  },
  part2: {
    tests: [{ input, expected: 2858 }],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});

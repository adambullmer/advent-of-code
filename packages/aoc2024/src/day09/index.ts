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

function transformMapToIdFiles(rawBlocks: string[]) {
  return rawBlocks.map((char, i) => {
    const num = parseInt(char, 10);
    const id = i % 2 === 0 ? `${i / 2}` : ".";
    return Array(num).fill(id);
  });
}

function compactDiskFiles(diskIds: string[][]) {
  for (let x = diskIds.length - 1; x > 0; x--) {
    if (diskIds[x].length === 0) {
      continue;
    }
    if (diskIds[x][0] === ".") {
      continue;
    }
    if (parseInt(diskIds[x][0], 10) >= x) {
      continue;
    }

    const fileLength = diskIds[x].length;
    const availableSpace = diskIds.findIndex((chunk) => chunk.filter((char) => char === ".").length >= fileLength);
    if (availableSpace === -1 || availableSpace > x) {
      continue;
    }

    const firstOpenIndex = diskIds[availableSpace].indexOf(".");
    diskIds[availableSpace].splice(firstOpenIndex, fileLength, ...diskIds[x]);
    diskIds[x].fill(".");
  }

  return diskIds;
}

const part2 = (rawInput: string) => {
  const rawMap = parseInput(rawInput);
  const fileIds = transformMapToIdFiles(rawMap);
  console.log(fileIds.flat().join(""));
  const compactFiles = compactDiskFiles(fileIds);
  console.log(fileIds.flat().join(""));

  return compactFiles
    .flat()
    .map((char) => (char === "." ? 0 : parseInt(char, 10)))
    .reduce((t, x, i) => t + x * i, 0);
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
  onlyTests: false,
});

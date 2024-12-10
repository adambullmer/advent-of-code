import { readFile, readdir } from "node:fs/promises";

import { select } from "@inquirer/prompts";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

async function main() {
  const yearOptions = (await readdir("./src", { withFileTypes: true }))
    .filter((item) => item.isDirectory())
    .map((item) => item.name);
  const dayOptions = Array.from(new Array(25), (_, i) => `${i + 1}`);
  const partOptions = [
    {
      name: "all",
      value: [1, 2],
    },
    {
      name: "1",
      value: [1],
    },
    {
      name: "2",
      value: [2],
    },
  ];

  const args = await yargs(hideBin(process.argv))
    .command(
      "test [year] [day] [part]",
      "Runs that day's part(s) with sample inputs and verifies against the expected outputs",
    )
    .positional("year", {
      description: "The Advent-of-Code year you want to be using",
      choices: yearOptions,
      type: "string",
    })
    .positional("day", {
      description: "The Advent-of-Code day you want to be using",
      choices: dayOptions,
      type: "string",
    })
    .positional("part", {
      description: "The Advent-of-Code day's part 1 or part 2",
      choices: partOptions.map(({ name }) => name),
    })
    .command(
      "solve [year] [day] [part]",
      "Runs that day's part(s) with the solution inputs, and prints out the solution to the answer",
    )
    .positional("year", {
      description: "The Advent-of-Code year you want to be using",
      choices: yearOptions,
      type: "string",
    })
    .positional("day", {
      description: "The Advent-of-Code day you want to be using",
      choices: dayOptions,
      type: "string",
    })
    .positional("part", {
      description: "The Advent-of-Code day's part 1 or part 2",
      choices: partOptions.map(({ name }) => name),
    })
    .demandCommand(1)
    .parse();

  if (args.year === undefined) {
    args.year = await select({
      message: "year",
      choices: yearOptions,
      default: yearOptions[yearOptions.length - 1],
    });
  }

  if (args.day === undefined) {
    const dayOptions = (
      await readdir(`./src/${args.year}`, { withFileTypes: true })
    )
      .filter((item) => item.isDirectory())
      .map((item) => item.name);
    args.day = await select({
      message: "day",
      choices: dayOptions,
      default: dayOptions[dayOptions.length - 1],
    });
  }
  args.day = args.day?.padStart(2, "0");

  if (args.part === undefined) {
    args.part = await select({
      message: "part(s)",
      choices: partOptions.map(({ name }) => name),
    });
  }

  const parts =
    partOptions.find((item) => item.name === args.part)?.value ?? [];

  for (const part of parts) {
    const isTest = args._[0] === "test";
    const inputFileType = isTest ? "sample" : "solution";
    const fixtureFileSuffix = `${part}.${inputFileType}.txt`;
    const input = await readFile(
      `${import.meta.dirname}/${args.year}/${args.day}/__fixtures__/input${fixtureFileSuffix}`,
      {
        encoding: "ascii",
      },
    );
    const { solution } = await import(
      `${import.meta.dirname}/${args.year}/${args.day}/solution${part}.js`
    );
    const result = await solution(input);

    if (isTest) {
      const output = (
        await readFile(
          `${import.meta.dirname}/${args.year}/${args.day}/__fixtures__/output${fixtureFileSuffix}`,
          {
            encoding: "ascii",
          },
        )
      ).trim();
      const resultMatches = `${result}` === `${output}`;
      console.log(
        `${args.year}/${args.day} Validation: result(${result}) = expected(${output}): ${resultMatches ? "✅" : "❌"}`,
      );
    }

    console.log(`${args.year}/${args.day} Solution ${part}: ${result}`);
  }
}

main();

# advent-of-code

Repo to gather answers to te advent of code challenge

## Running an Advent of Code day

The below command will both create a day if it does not yet exist, and then run it.

```bash
yarn run start <year> <day>
# or
yarn workspace aoc<year> run start <day>

```

## Starting a new Advent of Code year

The below command will create a new package in the monorepo to partition each year of advent of code.
This was the most straight forward way to work within a monorepo with this runner without over engineering a meta solution.

```bash
yarn run generate:year <year>
# or
yarn run aocrunner init packages/aoc<year>
```

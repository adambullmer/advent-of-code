# 🎄 Advent of Code 2024 - day 14 🎄

## Info

Task description: [link](https://adventofcode.com/2024/day/14)

## Notes

### Grid

Had an epiphany this time that I don't have to construct a physical manifestation of a grid with all the empty cells.
All that mattered was tracking the overall boundaries, and what each robot's position is.
Keeping a list of robots I can filter them down and iterate as needed.

### Iterative Approach

I started with an iterative approach for moving the robots, and planned on handling all each robot's moves before moving on.
Once I validated that everything was working correctly, I realized that don't need to itrate, and can more simply multiply the movements.
Had to think for a bit on how to handle boundary wrapping, and I realized that I can use a modulo to find what the remainder of moves.
With that remainder I can calculate the position.

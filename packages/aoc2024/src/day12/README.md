# 🎄 Advent of Code 2024 - day 12 🎄

## Info

Task description: [link](https://adventofcode.com/2024/day/12)

## Notes

I've had a realization for solving this one.
I can pass objects by reference, which will be memory efficient, and alse allow me to compare instances of objects.
With this in mind, I can create 2 representations of the data.

- A grid of cells, the usual representation.
- A global queue of cells.
  I will remove cells from here as they are added to groups.

I'll start at `[0,0]`, generating a group, and avoiding moving to any other group, and removing cells from the queue.
As cells are added to the group, I can keep a running total of borders, as defined by directions touching other groups.
Once I've exhausted the first group, I will then take the next cell from the queue, and process it's group, and so on.
Processing groups like this also prevents needing to look up any random cell to see if it's group exists.

### Part 2

Calculating the number of sides may require traversal of the shape.
I've tried to see if there was a way to cobble together the answer based on having all the different points.
This didn't work because it doesn't take contiguousness lines into account, only unique horizontal/vertical lines.
It also doesn't account for a single coordinate being part of multiple sides, nor does it differentiate which axis a side should be on.
If traversal is the answer, there should be a way to gather the information while creating the shapes initially.
Seems like counting "corners" both external and inteanal is the key.
So for every cell, check the conditions for being an inner or outer corner.

# 🎄 Advent of Code 2024 - day 16 🎄

## Info

Task description: [link](https://adventofcode.com/2024/day/16)

## Notes

### Traditional Maze Solving

Initially, I used a traditional maze solving approach, where I found the first path through depth first recursive searching.
I initially forgot that I needed to mark my visited cells to avoid infinite loops, which became very apparent when I had stack overflows.
Finally, I got a solution that worked for all the sample data.
It would exhaustively find every route, and afterwards, calculate the scores, and pick the lowest.

### Optimizing

When I tried to run this on my test input, it ran for nearly 2 hours before I killed the process.
I'm not sure how long it still would have needed to run, but there had to be another way.
I gathered some thoughts, and came up with 3 options.

- Instead of recursing on every step, skip ahead to the next intersection
- Store the score in progress at every intersection, comparing every potential solution at this cell, and rejectiong any solutions with a higher score.
- I had a vague thought of ditching the whole grid, and instead making some kind of graph, where the nodes were intersections, and the connections were steps.
  I couldn't quite hammer this out, how it would be better than grid traversal other than eliminating boundary checking.

I ended up doing the middle option, as I thought this would eliminate the most potential paths.
It ended up solving part 1 within 12 seconds.

### Overoptimizing

I made the necessary changes to part 2, to find all solutions with the lowest value, and store which cells were traversed.
I even added some output, and changed the characters so that I could debug easier.
When this ran, I noticed not all paths/steps were being found.
After some digging, I realized it was because some paths had extra steps/turns at the same point that other paths had fewer, but if I followed the path further, they would be equal.
This was best exemplified as going around a column, from bottom left to top right in an upward direction.
Both directions around it will result in the same number of steps and turns, however if another route moves past this spot, the optimal path _appears_ like it won't be one taking a different turn.
I overcame this with adding a 1-turn buffer when checking for optimal paths, and hoped that would be enough tolerance.
And it was!
The solutions now ran in 98 seconds (not great) but they ran and were correct.

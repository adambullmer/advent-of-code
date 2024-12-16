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

### Easter Egg Tree

While thinking on the soultion for part 2, I really only came up with 2 ideas.
An iterative approach, where I manually look for some kind of tree-like output.
And attempting something more clever, like looking for a shape.
Without knowing what the "christmas tree" shape looked like, I thought it may just be a hollow, or a filled in pyramid shape.
So the clever solution would have been to iterate and check if every robot had a robot or 3 below it to form, and all were accounted for.

### Sunzi's Theorem (Chinese Remainder Theorem)

The method wasn't making sense and I didn't want to look through potentoally thousands of iterations, so I looked for hints.
Looks like the clever solution is utilizind this theorem, which helps with identifying patterns.

> In mathematics, the Chinese remainder theorem states that if one knows the remainders of the Euclidean division of an integer `n` by several integers, then one can determine uniquely the remainder of the division of `n` by the product of these integers, under the condition that the divisors are pairwise coprime (no two divisors share a common factor other than 1).


### Brute Force

I ultimately went with the brute force method by printing the solutions to a log file.
I added a seconds header so I could easily identify what iteration had the tree when I saw it.
I had previously seen what the tree was supposed to look like from a post on the internet.
Since it is surrounded by a box, I knew to search for a long string of, a character representing the robots, so I chose a `#`
It became trivially easy to find my index of `8280`, limit my range to 1 of 1 iteration, and submit an answer I can explain. 
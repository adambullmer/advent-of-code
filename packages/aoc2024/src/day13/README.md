# 🎄 Advent of Code 2024 - day 13 🎄

## Info

Task description: [link](https://adventofcode.com/2024/day/13)

## Notes

I'm making an assumption that there will only be 1 combination of button presses that will actually provide a solution.
This means that there is no optimization of button presses that will be needed.

### Iterative Solution

Initially for part 1, I did an iterative approach, given the problem hinted that I woundn't need more than 100 presses.
Since I was supposed to do as few button presses as possible, I started with the maximum B presses before crossing a boundary.
I then subtracted one B and calculated the remainder of each direction, and determined how many A presses would be needed to reach the boundary in both directions.
If the button presses required for both directions was the same, then I had my combination of button presses.
This same approach does not work reasonably efficiently for part 2 due to the magnitude added to the solutions becoming prohibitive by design.

### Slope

I feel like slope (rise over run) of the combinations of button presses can be used in some way to derive if there is a possible combination that equals the slope of the prize.
We have the location of the prize, and therefore a calculable slope to be able to aim for.
Our upper and lower bounds of slope will be from 1 button press of A, all the way to 1 button press of B.
These can be derivet into percentages, or proportions, which are comparable in a greater than, or less than the target.
There are also conveniently in order, therefore allowing binary search to check, starting at a middle with 1:1, the direction to begin narrowing in on.
I may need to research and produce all the possible steps within my boundaries of [100%:0, 0:100%].

### Binary Search

It feel like this algorithm is approiate to find the correct combination of button presses, but I am struggling to put down how to compare greater than or less than with respect to the target destination.
Based on a shower thought, I think the problem is that I need to normalize what I'm searching for, and that could be the slope.
I also realize that I don't have to form a concrete array of all combinations.
I can use a virtual bountary, and need to keep a strong sense of what an exit condition would be.
When changing the binary search boundaries, I will need to be certain that I am only splitting on whole button press steps.
This will likely mean using a proportion reducing function to take 25:75 and convert that into 1:3.

### Algebra

Looks like there may be a mathematical formula to solve this for me, I see some community examples of using `mathjs.lusolve`, or even the following snippet:

```golang
func solve(A, B, prize []int) (int, int, bool) {
	a0, a1, b0, b1, pr0, pr1 := float64(A[0]), float64(A[1]), float64(B[0]), float64(B[1]), float64(prize[0]), float64(prize[1])

	if n, m, ok := linalgSolve(a0, a1, b0, b1, pr0, pr1); ok && isIntegral(n) && isIntegral(m) {
		return int(n), int(m), true
	}

	return -1, -1, false
}

func linalgSolve(a0, a1, b0, b1, c0, c1 float64) (float64, float64, bool) {
	det := a0*b1 - a1*b0

	if det == 0.0 {
		return 0.0, 0.0, false
	}

	return (c0*b1 - c1*b0) / det, (a0*c1 - a1*c0) / det, true
}

func isIntegral(val float64) bool {
	return val == float64(int(val))
}
```

I initially tried transposing this into TS, but it didn's seem to provide a correct solution, and I do dislike not undesrtanding the math part.
I will instead go with what my instincts are for linear search, trying to align on slope.

### Validations

Finding the matching slope only means there is a combination of presses that will follow the correct direction.
I will need to validate that there is a multiple of those presses that stops on the target.

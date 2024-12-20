# 🎄 Advent of Code 2024 - day 17 🎄

## Info

Task description: [link](https://adventofcode.com/2024/day/17)

## Notes

### Part 1

Pretty straight forward -- make the functions as described, and write a loop to keep track of the pointer.

### Part 2

Here, is less straight forward.
Hints from the internet is to observe how the value of A affects the output.

```
5
46
368
2944
23558
188468
...

```

I couldn't find a pattern in the numbers, but I think just reversing the program should suffice.
Turns out, because of the potential floor match and dropping of data a simple reverse won't work.
So sage advive from the internat is to observe that there is always a 3-bit (octal) operation to pop a value off the A register.
With that, we can write a depth first search iterating octal by octal, and shifting them left to rebuild the output.
The example program iterations in forwards order are:

```
bst -- B = 188468 % 8 = 4 4 [ 188468, 0, 0 ]
bxl -- B = 4 XOR 1 = 5 1 [ 188468, 4, 0 ]
cdv -- C = 188468 / 2**5 = 5889 5 [ 188468, 5, 0 ]
bxc -- 5 ^ 5889 = 5892 6 [ 188468, 5, 5889 ]
bxl -- B = 5892 XOR 4 = 5888 4 [ 188468, 5892, 5889 ]
adv -- A = 188468 / 2**3 = 23558 3 [ 188468, 5888, 5889 ]
out -- 5888 % 8 - 0 5 [ 23558, 5888, 5889 ]
jnz -- 0 0 [ 23558, 5888, 5889 ]

bst -- B = 23558 % 8 = 6 4 [ 23558, 5888, 5889 ]
bxl -- B = 6 XOR 1 = 7 1 [ 23558, 6, 5889 ]
cdv -- C = 23558 / 2**7 = 184 5 [ 23558, 7, 5889 ]
bxc -- 7 ^ 184 = 191 6 [ 23558, 7, 184 ]
bxl -- B = 191 XOR 4 = 187 4 [ 23558, 191, 184 ]
adv -- A = 23558 / 2**3 = 2944 3 [ 23558, 187, 184 ]
out -- 187 % 8 - 3 5 [ 2944, 187, 184 ]
jnz -- 0 0 [ 2944, 187, 184 ]

bst -- B = 2944 % 8 = 0 4 [ 2944, 187, 184 ]
bxl -- B = 0 XOR 1 = 1 1 [ 2944, 0, 184 ]
cdv -- C = 2944 / 2**1 = 1472 5 [ 2944, 1, 184 ]
bxc -- 1 ^ 1472 = 1473 6 [ 2944, 1, 1472 ]
bxl -- B = 1473 XOR 4 = 1477 4 [ 2944, 1473, 1472 ]
adv -- A = 2944 / 2**3 = 368 3 [ 2944, 1477, 1472 ]
out -- 1477 % 8 - 5 5 [ 368, 1477, 1472 ]
jnz -- 0 0 [ 368, 1477, 1472 ]

bst -- B = 368 % 8 = 0 4 [ 368, 1477, 1472 ]
bxl -- B = 0 XOR 1 = 1 1 [ 368, 0, 1472 ]
cdv -- C = 368 / 2**1 = 184 5 [ 368, 1, 1472 ]
bxc -- 1 ^ 184 = 185 6 [ 368, 1, 184 ]
bxl -- B = 185 XOR 4 = 189 4 [ 368, 185, 184 ]
adv -- A = 368 / 2**3 = 46 3 [ 368, 189, 184 ]
out -- 189 % 8 - 5 5 [ 46, 189, 184 ]
jnz -- 0 0 [ 46, 189, 184 ]

bst -- B = 46 % 8 = 6 4 [ 46, 189, 184 ]
bxl -- B = 6 XOR 1 = 7 1 [ 46, 6, 184 ]
cdv -- C = 46 / 2**7 = 0 5 [ 46, 7, 184 ]
bxc -- 7 ^ 0 = 7 6 [ 46, 7, 0 ]
bxl -- B = 7 XOR 4 = 3 4 [ 46, 7, 0 ]
adv -- A = 46 / 2**3 = 5 3 [ 46, 3, 0 ]
out -- 3 % 8 - 3 5 [ 5, 3, 0 ]
jnz -- 0 0 [ 5, 3, 0 ]

bst -- B = 5 % 8 = 5 4 [ 5, 3, 0 ]
bxl -- B = 5 XOR 1 = 4 1 [ 5, 5, 0 ]
cdv -- C = 5 / 2**4 = 0 5 [ 5, 4, 0 ]
bxc -- 4 ^ 0 = 4 6 [ 5, 4, 0 ]
bxl -- B = 4 XOR 4 = 0 4 [ 5, 4, 0 ]
adv -- A = 5 / 2**3 = 0 3 [ 5, 0, 0 ]
out -- 0 % 8 - 0 5 [ 0, 0, 0 ]
jnz -- undefined 0 [ 0, 0, 0 ]
```

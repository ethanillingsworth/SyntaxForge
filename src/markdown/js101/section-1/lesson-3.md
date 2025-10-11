
# if ... then ... else if ... then ... else

What if we want add another check using an `if statement` only if our first `if statement` fails? In that case we can combine 2 keywords and make the `else if` keyword.

Let's say we have a variable called `sides` and depending on what sides is I want to log what shape it corresponds too. 3 sides would be a triangle, 4 sides a rectangle, etc. I could use a combination of `if`, `else if`, and `else` operators to make this work.

Example:

```js
let sides = 4 // or 3 or any number

if (sides === 4) {
    console.log("Rectangle")
}
else if (sides === 3) {
    // If sides === 4 is false check if sides === 3
    console.log("Triangle")
}
else {
    // If both checks fail
    console.log("Unknown Shape!")
}

```

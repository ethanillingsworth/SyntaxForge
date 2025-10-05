
# Storing Data in Variables

Variables are just a way to represent data under a name which can change. You may already be familiar with this concept if you took algebra in high school.

## Math vs JS

In math variables are represented by a single letter, and can be set to any number or equation.

Math Example

```js
x = 10
y = 4.5x // 45
```

In JS and most other programming languages we arent limited to just a single letter, variables can be named anything you want. We define a variable by using the `let` keyword, and we multiply with the `*` operation. Let's rewrite our math example in javascript.

JS Example

```js
let x = 10
let y = 4.5 * x
```

Here's another example showing how we arent limited to just 1 letter.

```js
let thisCanBeReallyLong = 10
let thisCanBeEvenLongerWowThisIsCrazy = 4.5 * thisCanBeReallyLong
```

## Log Variables

Just like numbers, string, and any other data type you can log variables to the console. This is because a variable is just a representation of a data type under a different name. This can be seen by checking the type of a number and a variable storing a number value

```js
let x = 20

console.log(x) // 20
console.log(10) // 10

console.log(typeof x) // number
console.log(typeof 10) // number
```

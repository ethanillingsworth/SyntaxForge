
# Basic Math Concepts

In programming languages such as JS you can perform operations on numbers. This includes math operations like addition, subtraction, multiplication and division.

## Out of Place Operators

Out of Place Operations are just like normal operations you would see and do in math class. See example below.

```js
const a = 1 + 1 // 1 + 1 is a normal operation

let b = a * 42 // a * 42 is a normal operation

```

Here is a list of all normal operations:

Let n be any number type or any variable with a number value.

| Operation | Template | Behavior |
| --------- | -------- | -------- |
| Addition | n + n | Adds 2 numbers together, returns result |
| Subtraction | n - n | Subtracts 2 numbers, returns result |
| Multiplication | n * n | Multiplies 2 numbers together, returns result |
| Division | n / n | Divides 2 numbers, returns result |

You can also use these with variables:

Let v be a variable name

| Operation | Template | Behavior |
| --------- | -------- | -------- |
| Addition | let v = n + n | Adds 2 numbers together, stores result in v |
| Subtraction | let v = n - n | Subtracts 2 numbers, stores result in v |
| Multiplication | let v = n * n | Multiplies 2 numbers together, stores result in v |
| Division | let v = n / n | Divides 2 numbers, stores result in v |

## In Place Operators

In place operations are similar to their Normal counter parts, but change a variables value in place.

```js
let x = 45

x *= 10 // multiply the value of x by 10 and store the new value back into x.

console.log(x) // 450
```

Here is a table of In Place Operators

| Operation | Template | Behavior |
| --------- | -------- | -------- |
| Addition | v += n | Adds n to v, stores result in v |
| Subtraction | v -= n | Subtracts n from v, stores result in v |
| Multiplication | v *= n | Multiplies v by n, stores result in v |
| Division | v /= n | Divides v from n, stores result in v |

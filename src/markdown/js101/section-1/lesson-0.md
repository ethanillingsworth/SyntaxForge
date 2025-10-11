
# Comparing things

Let's say I have 2 variables. `x` which is the number `10` and `y` which is the number `20`. Now humans like you and me can just tell those don't equal each other, but let's act like were in pre-school and say we need to check via code.

To do that we use comparison operators (operators that `compare` 2 thing's).

## Comparison operators

Just like in math we can use operators like equivalency, greater than, less than, and their equal too counter parts.

See in table below:

| Name | Operator | Example |
| ---- | -------- | ------- |
| Equivalency | == | a == b |
| Strict Equivalency | === | a === b |
| Not Equal too | != | a != b |
| Strictly Not Equal too | !== | a !== b |
| Greater than | > | a > b |
| Greater than or Equal too | >= | a >= b |
| Less than | < | a < b |
| Less than or Equal too | <= | a <= b |

## Strict Operators

In javascript non strict operators can match different data types. This is a quirk of javascript and was initially a feature when web development was in its infancy. That being said these don't exist in other programming languages.

See Example below:

```js
console.log(10 == "10") // true
console.log(10 == 10) // true

console.log(10 === "10") // false
console.log(10 === 10) // true
```

Normally it is preferred to used strict operators as most `==` are strict by default in other programming languages, just not in javascript.


# Check for multiple things

What if I want to check if 2 things are true or if one or the other are true? In this case we use logical operators, such as `&&`, `||` and `!`. When spoken these are called the `and`, `or` and `not` operators.

| Name | Operator | Example |
| ---- | -------- | ------- |
| And | `&&` | a && b |
| Or | `\|\|` | a \|\| b |
| Not | `!` | !a |

## Not operator

The `not` operator represent by `!` inverts the value of the expression it is applied to. If we have a check that is `true` and apply the `not` operator the check will now be `false`.

```js
const a = 5
const b = 4

console.log(a === b) // false
console.log(!(a === b)) // true
```

It can also be used to invert boolean variables.

```js
console.log(true) // true
console.log(!true) // false
```

## And operator

The `and` operator represented by `&&` allows for checking of 2 things being `true` at the same time.

```js
const a = 5
const b = 5
const c = 2

// a equal to b is true
// and
// a equal to c is false but gets inverted by the not operator and becomes true
// so the check passes!

if (a === b && !(a === c)) {
    console.log("This passes!")
}
```

## Or operator

The `or` operator represented by `||` allows for checking if either check a or check b passes and returns if either one is `true`.

```js
const a = 5
const b = 2
const c = 5

// a equal to b is false
// a equal to c is true
// the check passes and we continue

if (a === b || a === c) {
    console.log("a is equal to b or is equal to c")
}
```

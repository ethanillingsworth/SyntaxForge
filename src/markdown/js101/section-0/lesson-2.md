
# Storing Data in Constants

Constants are just like variables but without the variablility (they can't change).

## Constants vs Variables and Declaration

| Name | Behavior |
| ---- | -------- |
| Constants | Cannot be reassinged after being declared |
| Variables | Can be assigned a new value after being declared |

To declare something in programming just means assigning it a value for the first time.

Declaration Example:

```js
let x = 5 // Declaration

x = 10 // Reassignment
```

## Declare a Constant

You can declare a constant with the `const` keyword.

```js
const x = 5
```

If you try to reassign `x` to another value an error will be thrown.

```js
const x = 5 // This is fine

x = 10 // Uh oh error!

```

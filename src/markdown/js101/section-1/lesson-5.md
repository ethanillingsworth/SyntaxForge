
# Truthy and Falsy

In programming everything has a true or false value underneath it. For example if we have the number `1` that's a `truthy` value. If we have the number `0` thats a `falsy` value. Neither of them are `true` or `false` in words, but can still be converted to those inherently.

Example:

```js
const a = 1
const b = 0

// if a is a truthy value
if (a) {
    console.log(1)
}

// if b is a truthy value
if (b) {
    console.log(2)
}

// Logs: 1
```

## Not operator with truthy and falsy values

If we use the `not` operator we can invert the values of truthy and falsy.

```js
const a = 0

// Normally falsy be its inverted to truthy
if (!a) {
    console.log(1)
}

// Logs: 1
```

## How to tell Truthy and Falsy

How I think about `Truthy` and `Falsy` is if it has something, its `Truthy`. If it has nothing its `falsy`.

An empty string (`""`) would be `Falsy`, a string with something in it (`"Hello!"`) would be `Truthy`.

Negatives and Zero would be `Falsy`.

Positives would be `Truthy`.

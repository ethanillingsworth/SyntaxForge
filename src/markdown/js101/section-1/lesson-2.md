
# if ... then .. else

Now that you know how to use if statements, what if we want to do something else if a check fails? Well we use the `else` keyword.

Let's say I want to log the phrase `"Hello, name!"` with the users `name`. I only want to log this if the users `name` is not null. Otherwise I want to log the phrase `"Hello, User!"`

```js
let name = "Jason"

// make sure name is not null
if (name !== null) {
    console.log("Hello, " + name + "!")
}
else {
    // if it is null then log the other phrase
    console.log("Hello, User!")
}
```

# React Markdown Sample

## Headings

### H3 Heading
#### H4 Heading
##### H5 Heading
###### H6 Heading

## Text Formatting

This paragraph contains **bold**, *italic*, ***bold italic***, ~~strikethrough~~,
and `inline code`.

## Paragraphs

Markdown automatically wraps text inside paragraphs.

A blank line creates a new paragraph.

## Blockquotes

> This is a blockquote.
>
> It can span multiple lines and paragraphs.

## Lists

### Unordered List
- Item one
- Item two
  - Nested item
  - Nested item
- Item three

### Ordered List
1. First item
2. Second item
   1. Nested item
   2. Nested item
3. Third item

### Task List (GFM)
- [x] Completed task
- [ ] Incomplete task

## Links

- [OpenAI](https://openai.com)
- [Internal page](/docs/getting-started)

## Images

![Placeholder image](https://via.placeholder.com/300x150.png?text=Markdown+Image)

## Code Blocks (Indented – React Markdown Safe)
```js
function add(a, b) {
  return a + b;
}
```
```py
def add(a, b):
    return a + b
```

## Tables (remark-gfm)

| Name  | Age | Role      |
| ----- | --- | --------- |
| Alice | 24  | Developer |
| Bob   | 30  | Designer  |
| Carol | 28  | Manager   |

## Escaping Characters

\*Not italic\*  
\# Not a heading  
\`Not inline code\`

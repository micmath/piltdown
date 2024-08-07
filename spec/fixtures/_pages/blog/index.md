---
title: blog
description: What we're up to
layout: spec/fixtures/_templates/article.vto
controller: blog/paginate.js
---

```js
function foo(bar) {
  return "foobar";
}
```

# The Blog

This is ~~our~~ _your_ blog.

```
# Not a heading
```

## Sample code

### Fenced code example

```js
let genericFencedCode = function(bar) {
  bloop();
}
```

#### Another heading

Some text.

## ✅ Inserted code

```javascript title="example.js" (example/snippets/hello.js) {.morestuff}
// content already in code block gets wiped out
```

```css (example/snippets/hello.css)
```

## Inserted code <strong>again</strong>,&nbsp;- WTF? 

```js (example/snippets/hello.js)
```

This is <span>some inline html</span> <mark>content.</mark> Text is for words.

<div class="demo">
  <h3>Demo</h3>
  <!--include-html src="example/snippets/example.html" safe="true"></include-html-->
  <div class="view-source">
  <!--include-html src="example/snippets/example.html" safe="no"></include-html-->
  </div>
</div>

Some more text is here.

<!--include-html src="/example/snippets/example.html" safe="true">What about <i>this</i>?</include-html-->

# Its Broken

<div>Can I be inline? <span><!--include-html src="example/snippets/borked.html" safe="true">What about <i>this</i>?</include-html--> Let's see</span>.</div>

Finally, some final text.
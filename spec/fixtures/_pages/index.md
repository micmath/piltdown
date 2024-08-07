---
title: Home Page
data: [1, 2]
---

# {{ data.site.title }} | {{ page.title }}

This is our home page. `{{ page.data.map(n => n+1) |> JSON.stringify }}`
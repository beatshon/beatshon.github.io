---
layout: page
title: Series
---
{% assign groups = site.posts | where_exp: "p", "p.series" | group_by: "series" %}
{% for group in groups %}
<h2 id="{{ group.name | slugify }}">{{ group.name }}</h2>
<ul class="posts">
  {% assign ordered = group.items | reverse %}
  {% for post in ordered %}
  <li>
    <small class="datetime muted">{{ post.date | date_to_string }} </small>
    <a href="{{ post.url }}">{{ post.title }}</a>
  </li>
  {% endfor %}
</ul>
{% endfor %}
<p class="muted"><a href="/">전체 글 보기</a></p>

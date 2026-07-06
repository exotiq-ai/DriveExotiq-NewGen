# Stories content

Drop finished Story posts here as `*.md` (one file per post; filename is the URL
slug unless overridden). The Stories shell (`app/blog`) renders every `.md` file
in this directory automatically — no code change needed.

Front-matter is a leading HTML comment of `key: value` lines:

```md
<!--
title: The sleeper thesis: why a 2017 Audi S8 leads a fleet of McLarens
slug: the-car-sleeper-thesis
category: The Car
date: 2026-07-06
metaDescription: A McLaren announces itself. An Audi S8 does not.
-->

# The sleeper thesis

Body in Markdown…
```

Recognized keys: `title` (required), `slug` (defaults to filename),
`category`/`pillar` (the chip + BlogPosting section), `date` (ISO; defaults to
file mtime for ordering), `metaDescription`/`meta description` (the dek + meta),
`author` (defaults to Drive Exotiq). Reading time is computed from the body.

Posts are written in a separate chat (see `docs/redesign/BLOG-TOPICS.md`); this
directory is just where the finished files land.

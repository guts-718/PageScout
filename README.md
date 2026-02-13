# PageScout

PageScout is a smart browser extension that upgrades webpage search.
Instead of basic find, it supports ranked results, similarity matching,
navigation shortcuts, and future semantic search using LLMs.

------------------------------------------------------------------------

## Features (as of now)

-   Exact keyword search
-   Substring matching
-   Ranked results
-   Highlight navigation
-   Next / Previous shortcuts
-   Match counter overlay
-   Fast cached DOM scanning
-   LCS similarity search

------------------------------------------------------------------------

| Shortcut | Action |
|----------|--------|
| Ctrl + Shift + F | Start search |
| Enter | Next match |
| Shift + Enter | Previous match |
| Esc | Clear highlights |


------------------------------------------------------------------------

## Architecture

Extension is modular and designed for scalability.

    content/
     ├── constants.js      # global config
     ├── searchEngine.js   # search logic
     ├── ranker.js         # scoring + sorting
     ├── highlighter.js    # DOM highlights
     └── navigator.js      # result navigation

------------------------------------------------------------------------

## Ranking Priority

1.  Exact match
2.  Substring match
3.  LCS similarity

------------------------------------------------------------------------

## Performance Design

-   Text nodes cached once
-   LCS length capped
-   Result count capped
-   Conditional algorithm execution

------------------------------------------------------------------------

## Upcoming phases:

-   Semantic search via Ollama / LLMs
-   Synonym expansion
-   UI search panel
-   Settings panel
-   PDF deep parsing
-   Smart ranking tuning

------------------------------------------------------------------------

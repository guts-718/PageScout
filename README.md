# PageScout

PageScout is a smart browser extension that improves how users search
inside long, content heavy webpages. Instead of relying only on exact
keyword matching, PageScout supports ranked results, similarity search,
and optional semantic expansion using a local LLM via Ollama.

------------------------------------------------------------------------

## Problem It Solves

Modern webpages are long and information dense. The default browser find
feature:

-   Only supports exact substring matching
-   Cannot understand related terms
-   Does not rank results by relevance
-   Provides limited navigation control

PageScout solves this by adding:

-   Ranked search results
-   Substring and similarity matching
-   Semantic keyword expansion (local LLM)
-   Smooth navigation between matches
-   Overlay based search UI

------------------------------------------------------------------------

## Use Cases

-   Searching technical blogs with unclear terminology
-   Finding related concepts in documentation
-   Quickly navigating long research articles
-   Locating ideas when exact wording is unknown
-   Semantic searching with local AI (Ollama)

------------------------------------------------------------------------

## Core Features

-   Exact match search
-   Substring matching
-   LCS-based similarity search (given less weightage since not always useful)
-   Semantic keyword expansion (Ollama)
-   Ranked results
-   Highlight navigation (Next / Previous)
-   Floating overlay UI
-   Dark / Light mode toggle

------------------------------------------------------------------------

## Architecture Overview

PageScout is modular and structured for scalability.
    
    background/
     └── ollamaClient.js
    content/
     ├── constants.js
     ├── searchEngine.js
     ├── ranker.js
     ├── semanticEngine.js
     ├── highlighter.js
     ├── navigator.js
     └── ui/
         ├── controller.js
         ├── overlay.js
         └── overlay.css
     └── content.js
     └── extractor.js
     └── manifest.json



Design Principles:

-   UI separated from search engine
-   Async semantic enhancement
-   Cached DOM scanning
-   Ranked scoring pipeline
-   Service-worker-based LLM bridge

------------------------------------------------------------------------

## Difficulties & Engineering Challenges

-   Handling Chrome Manifest V3 service worker lifecycle
-   Preventing extension context invalidation
-   Managing long running Ollama requests
-   Designing fair ranking without penalizing long text nodes
-   Avoiding DOM corruption during highlighting
-   Ensuring navigation consistency after dynamic updates
-   Implementing safe async messaging between content and background

------------------------------------------------------------------------

## How It Works

1.  User opens overlay (Ctrl + Shift + F)
2.  Query is processed by local search engine
3.  Exact and substring matches are ranked
4.  If needed, semantic keywords are fetched from Ollama
5.  Results are merged and re-ranked
6.  Highlights are injected safely into the DOM
7.  Navigation moves between ranked matches

------------------------------------------------------------------------

## Setup Instructions

### 1. Clone the Repository

    git clone https://github.com/guts-718/PageScout.git

### 2. Load Extension in Chrome

-   Go to chrome://extensions
-   Enable Developer Mode
-   Click "Load Unpacked"
-   Select the extension directory

### 3. Install and Run Ollama (Optional for Semantic Search)

Install Ollama from:

https://ollama.com

Pull a lightweight model:

    ollama pull phi3

Allow extension origin access:

Windows PowerShell:

    setx OLLAMA_ORIGINS "*"

Then restart Ollama:

    ollama serve

------------------------------------------------------------------------

## Screenshots

![Overlay UI](/assets/z_normal.png)  
*Overlay interface showing the main UI in action.*

![Search Results](/assets/z_semantic0.png)  
*Search results displaying matched queries.*

![Semantic Match Example](/assets/z_semantic1.png)  
*Example demonstrating semantic expansion and matching output.*

------------------------------------------------------------------------

## Roadmap

-   Improved caching layer
-   Shadow DOM isolation for UI
-   Advanced ranking (BM25-style scoring)
-   Query history
-   Performance profiling tools
-   Chrome Web Store release

------------------------------------------------------------------------

## License

Do whatever you want with this project.  
Use it, modify it, break it, learn from it - all good.  



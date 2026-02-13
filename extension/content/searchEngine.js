let TEXT_NODES = [];

function buildTextNodeCache() {
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    let node;
    while ((node = walker.nextNode())) {
        if (!node.parentElement) continue;
        if (!node.nodeValue.trim()) continue;
        TEXT_NODES.push(node);
    }
}

function searchExact(query) {
    const matches = [];

    TEXT_NODES.forEach(node => {
        const text = node.nodeValue;
        let index = text.toLowerCase().indexOf(query);

        while (index !== -1) {
            matches.push({
                node,
                start: index,
                end: index + query.length,
                text: text.substring(index, index + query.length)
            });

            index = text.toLowerCase().indexOf(query, index + 1);
        }
    });

    return matches;
}

function searchSubstring(query) {
    return searchExact(query);
}

function runSearch(query) {
    query = query.toLowerCase();

    let results = searchExact(query);

    if (results.length === 0)
        results = searchSubstring(query);

    return results;
}

buildTextNodeCache();

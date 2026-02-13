let TEXT_NODES = [];
console.log("search engine here");
if (!window.CONFIG) {
    console.error("CONFIG not loaded");
}

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


function exactSearch(query) {
    const results = [];

    TEXT_NODES.forEach(node => {
        const text = node.nodeValue.toLowerCase();
        let index = text.indexOf(query);

        while (index !== -1) {
            results.push({
                node,
                start: index,
                end: index + query.length,
                text: node.nodeValue.slice(index, index + query.length),
                strategy: "EXACT",
                similarity: 100,
                score: window.CONFIG.STRATEGY_WEIGHT.EXACT + 100
            });

            index = text.indexOf(query, index + 1);
        }
    });

    return results;
}


function substringSearch(query) {
    const results = [];

    TEXT_NODES.forEach(node => {
        const text = node.nodeValue.toLowerCase();

        if (!text.includes(query)) return;

        const similarity = scoreSubstring(query, text);

        results.push({
            node,
            start: 0,
            end: text.length,
            text: node.nodeValue,
            strategy: "SUBSTRING",
            similarity,
            score: window.CONFIG.STRATEGY_WEIGHT.SUBSTRING + similarity
        });
    });

    return results;
}


function lcsSearch(query) {
    const results = [];

    TEXT_NODES.forEach(node => {
        const text = node.nodeValue.toLowerCase();
        const similarity = scoreLCS(query, text);

        if (similarity < window.CONFIG.LCS_THRESHOLD * 100) return;

        results.push({
            node,
            start: 0,
            end: Math.min(text.length, window.CONFIG.LCS_MAX_TEXT),
            text: node.nodeValue,
            strategy: "LCS",
            similarity,
            score: window.CONFIG.STRATEGY_WEIGHT.LCS + similarity
        });
    });

    return results;
}


function runSearch(query) {

    if (!query || query.length < 2) return [];

    query = query.toLowerCase();

    let results = exactSearch(query);

    if (results.length < window.CONFIG.MIN_RESULTS_BEFORE_LCS)
        results = results.concat(substringSearch(query));

    if (results.length < window.CONFIG.MIN_RESULTS_BEFORE_LCS)
        results = results.concat(lcsSearch(query));

    return rankResults(results);
}

buildTextNodeCache();

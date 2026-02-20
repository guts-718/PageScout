let TEXT_NODES = [];
if (typeof getExpandedKeywords !== "function") {
    console.error("semantic engine not loaded");
}

console.log("search engine here");
if (!window.CONFIG) {
    console.error("CONFIG not loaded");
}

async function runSemanticPhase(query, results) {

    // if (results.length >= window.CONFIG.MIN_RESULTS_BEFORE_LCS)
    //     return results;
    console.log("entered runsemanticphase function");
    try{
        const keywords = await getExpandedKeywords(query);
        console.log("keywords expansion: ", keywords);

        if (!keywords.length) return results;
        const semanticResults = semanticSearch(keywords);
        console.log("semantic search output from searchengine envocation: ",semanticResults);
        return results.concat(semanticResults);
    }catch(e){
        console.log("error in the runsemantic phase: ", e);
    }
    return [];
   

   
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


async function runSearch(query) {
    console.log("runsearch called::::");

    if (!query || query.length < 2) return [];

    query = query.toLowerCase();

    let results = exactSearch(query);
    console.log("exact query resutl: ", results);

    if (results.length < window.CONFIG.MIN_RESULTS_BEFORE_LCS)
        results = results.concat(substringSearch(query));

    results = await runSemanticPhase(query, results);
    console.log("from llm this is prior result + semantic additions: ",results);
   // results.concat(temp);
    // this LCS needs some fixing. either way it doesn't make such sense
    // if (results.length < window.CONFIG.MIN_RESULTS_BEFORE_LCS)
    //     results = results.concat(lcsSearch(query));

    return rankResults(results);
}


buildTextNodeCache();

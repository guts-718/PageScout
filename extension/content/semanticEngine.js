const semanticCache = {};
const pendingResolvers = {};


function getExpandedKeywords(query) {

    console.log("Entered get expanded keywords");

     // if (semanticCache[query])
    //     return Promise.resolve(semanticCache[query]);

    return new Promise(resolve => {

        try {
            chrome.runtime.sendMessage(
                { type: "OLLAMA_QUERY", query }//,
                // () => {
                //     if (chrome.runtime.lastError) {
                //         console.warn("Runtime unavailable");
                //         resolve([]);
                //     }
                // }
            );
        } catch(e){
            console.log("issue in resolution instead ollama query... thats why resolved with empty: ",e);
            return resolve([]);
        }

        pendingResolvers[query] = resolve;

        // safety timeout
        setTimeout(() => {
            if (pendingResolvers[query]) {
                delete pendingResolvers[query];
                resolve([]);
            }
        }, 35000);

    });
}


chrome.runtime.onMessage.addListener(msg => {
    console.log("entered ollama result message handler");
     console.log("message from ollama", msg);

    if (msg.type !== "OLLAMA_RESULT") return;

    semanticCache[msg.query] = msg.words;
    semanticSearch(msg.words);
   

    if (pendingResolvers[msg.query]) {
        pendingResolvers[msg.query](msg.words);
        delete pendingResolvers[msg.query];
    }
});


function semanticSearch(keywords) {

    console.log("entered semantic search");
    const results = [];

    TEXT_NODES.forEach(node => {

        const text = node.nodeValue.toLowerCase();

        keywords.forEach(word => {

            const index = text.indexOf(word);
            if (index === -1) return;
            

            let similarity = 80;

            // strong match if word boundary match
            const regex = new RegExp(`\\b${word}\\b`);
            if (regex.test(text)) similarity = 100;
            if (index < 50) similarity += 25;
            results.push({
                node,
                start: index,
                end: index + word.length,
                text: node.nodeValue,
                strategy: "SEMANTIC",
                similarity,
                score: window.CONFIG.STRATEGY_WEIGHT.SEMANTIC + similarity
            });

        });

    });

    console.log("result of semantic search: ", results);

    return results;
}

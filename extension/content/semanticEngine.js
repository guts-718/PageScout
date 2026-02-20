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

            if (!text.includes(word)) return;

            const similarity = (word.length / text.length) * 100;

            results.push({
                node,
                start: 0,
                end: text.length,
                text: node.nodeValue,
                strategy: "SEMANTIC",
                similarity,
                score: 500 + similarity
            });

        });

    });
    console.log("result of semantic search: ", results);

    return results;
}

/*
fetch("http://localhost:11434")
Promise {<pending>}
search?q=what+does+status+code+403+forbidden+mean&oq=what+does+status+code+403+forbidden+mean&gs_lc…:1 Access to fetch at 'http://localhost:11434/' from origin 'https://www.google.com' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.Understand this error
VM450:1  GET http://localhost:11434/ net::ERR_FAILED 403 (Forbidden)
(anonymous) @ VM450:1Understand this error
VM450:1 Fetch failed loading: GET "http://localhost:11434/".
*/

chrome.runtime.onMessage.addListener(async(msg, sender) => {
    console.log("ollama called");
    console.log("message: ",msg);
    console.log("sender: ", sender);
    if (msg.type !== "OLLAMA_QUERY") return;

    const tabId = sender.tab.id;
    try{
    await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: "phi3",
            stream: false,
            messages: [
                {
                    role: "user",
                    content: `Return 8 keywords related to or having the same / similar meaning to "${msg.query}". 
        Comma separated. No explanation. just 8 keywords`
                }
            ]
        })

    })
    .then(r=>{console.log("Res: ",r);return r})
    .then(r => r.json())
    .then(data => {
        console.log("data inside ollama client", data);
        const words = (data.message?.content || "")
            .split(",")
            .map(w => w.trim().toLowerCase())
            .filter(Boolean);

        chrome.tabs.sendMessage(tabId, {
            type: "OLLAMA_RESULT",
            query: msg.query,
            words
        });

    })
    .catch((e) => {
        console.log("error inside the ollama client.js: ",e);
        chrome.tabs.sendMessage(tabId, {
            type: "OLLAMA_RESULT",
            query: msg.query,
            words: []
        });
    });
    }catch(e){
        console.warn("Error in fetch ollama itself inside ollamaclient.js", e);

    }
});

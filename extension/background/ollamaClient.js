chrome.runtime.onMessage.addListener(async(msg, sender) => {
    console.log("ollama called");
    console.log("message: ",msg);
    console.log("sender: ", sender);
    if (msg.type !== "OLLAMA_QUERY") return;

    const tabId = sender.tab.id;

    await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: "phi3",
            stream: false,
            messages: [
                {
                    role: "user",
                    content: `Return 8 short keywords related to "${msg.query}". 
        Comma separated. No explanation.`
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
});

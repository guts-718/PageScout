console.log("CONTENT SCRIPT LOADED", Date.now());


// (async () => {
//     await import(chrome.runtime.getURL("content/semanticEngine.js"));
// })();

console.log("SmartSearch Ready");

function showOverlay(count) {
    const old = document.getElementById("search-overlay");
    if (old) old.remove();

    const div = document.createElement("div");
    div.id = "search-overlay";
    div.textContent = `${count} matches`;

    Object.assign(div.style, {
        position: "fixed",
        top: "20px",
        right: "20px",
        background: "#111",
        color: "#fff",
        padding: "8px 14px",
        borderRadius: "8px",
        zIndex: 999999,
        fontSize: "14px",
        opacity: "0.9"
    });

    document.body.appendChild(div);

    setTimeout(() => div.remove(), 3000);
}


document.addEventListener("keydown",async e => {

    if (e.ctrlKey && e.shiftKey && e.key === "F") {
        e.preventDefault();

        const query = prompt("Search page:");
        if (!query) return;

        const results = await runSearch(query);
        console.log("RESULTS: ", results);

        if (!results.length) {
            alert("No relevant matches found");
            return;
        }

        highlightMatches(results);

        const spans = [...document.querySelectorAll("span")]
            .filter(el => el.style.background === "yellow");

        startNavigation(spans);
        showOverlay(spans.length);

        nextMatch();
    }

    if (e.key === "Enter" && !e.shiftKey) nextMatch();
    if (e.key === "Enter" && e.shiftKey) prevMatch();
    if (e.key === "Escape") clearHighlights();
});


const style = document.createElement("style");
style.textContent = `.current-match{background:orange!important}`;
document.head.appendChild(style);

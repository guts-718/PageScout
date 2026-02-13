console.log("SmartSearch Ready");

// keyboard shortcut
document.addEventListener("keydown", e => {

    if (e.ctrlKey && e.shiftKey && e.key === "F") {
        e.preventDefault();

        const query = prompt("Search page:");

        if (!query) return;

        const results = runSearch(query);

        if (!results.length) {
            alert("No matches found");
            return;
        }

        highlightMatches(results);

        const spans = [...document.querySelectorAll("span")]
            .filter(el => el.style.background === "yellow");

        startNavigation(spans);

        nextMatch();
    }

    if (e.key === "Enter" && !e.shiftKey) {
        nextMatch();
    }

    if (e.key === "Enter" && e.shiftKey) {
        prevMatch();
    }

    if (e.key === "Escape") {
        clearHighlights();
    }
});


const style = document.createElement("style");
style.textContent = `
.current-match {
    background: orange !important;
}
`;
document.head.appendChild(style);

let currentIndex = -1;
let currentMatches = [];

// STATR
function startNavigation(matches) {
    currentMatches = matches;
    currentIndex = -1;
}

// CURRENT 
function highlightCurrent() {
    document.querySelectorAll(".current-match").forEach(el =>
        el.classList.remove("current-match")
    );

    const el = currentMatches[currentIndex];
    if (!el) return;

    el.classList.add("current-match");
    el.scrollIntoView({ behavior: "smooth", block: "center" });
}

// NEXT
function nextMatch() {
    if (!currentMatches.length) return;

    currentIndex = (currentIndex + 1) % currentMatches.length;
    highlightCurrent();
}


// PREV
function prevMatch() {
    if (!currentMatches.length) return;

    currentIndex =
        (currentIndex - 1 + currentMatches.length) % currentMatches.length;

    highlightCurrent();
}

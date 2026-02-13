let currentIndex = -1;
let currentMatches = [];

function startNavigation(matches) {
    currentMatches = matches;
    currentIndex = -1;
}

function highlightCurrent() {
    document.querySelectorAll(".current-match")
        .forEach(el => el.classList.remove("current-match"));

    const el = currentMatches[currentIndex];
    if (!el) return;

    el.classList.add("current-match");

    el.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

function nextMatch() {
    if (!currentMatches.length) return;

    currentIndex = (currentIndex + 1) % currentMatches.length;
    highlightCurrent();
}

function prevMatch() {
    if (!currentMatches.length) return;

    currentIndex =
        (currentIndex - 1 + currentMatches.length) % currentMatches.length;

    highlightCurrent();
}

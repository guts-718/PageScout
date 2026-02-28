let currentIndex = -1;
let currentMatches = [];

function startNavigation(matches) {
    currentMatches = matches;
    currentIndex = 0;
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
    // console.log("next_matched_clicked");
    if (!currentMatches.length) return;

   
    currentIndex = (currentIndex + 1) % currentMatches.length;
    // console.log("crrent_index: ",currentIndex);
    highlightCurrent();
}

function prevMatch() {
    // console.log("prev_matched_clicked");
    if (!currentMatches.length) return;

    currentIndex =
        (currentIndex - 1 + currentMatches.length) % currentMatches.length;
    // console.log("crrent_index: ",currentIndex);
    highlightCurrent();
}

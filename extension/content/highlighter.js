let activeHighlights = [];

function clearHighlights() {
    activeHighlights.forEach(span => {
        const parent = span.parentNode;
        parent.replaceChild(document.createTextNode(span.textContent), span);
        parent.normalize();
    });

    activeHighlights = [];
}

async function highlightMatches(matches) {
    clearHighlights();

    //const matches = await matchesPromise; 
    console.log("matches:", matches);

    matches?.forEach(match => {
        const { node, start, end } = match;

        const text = node.nodeValue;
        const before = text.slice(0, start);
        const target = text.slice(start, end);
        const after = text.slice(end);

        const span = document.createElement("span");
        span.className = "ss-highlight";
        span.textContent = target;
        span.style.background = "yellow";
        span.style.color = "black";

        const fragment = document.createDocumentFragment();

        if (before) fragment.appendChild(document.createTextNode(before));
        fragment.appendChild(span);
        if (after) fragment.appendChild(document.createTextNode(after));

        node?.parentNode?.replaceChild(fragment, node);
        activeHighlights.push(span);
    });
}
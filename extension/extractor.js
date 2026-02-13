function isPDFPage() {
    return document.contentType === "application/pdf" ||
           window.location.href.endsWith(".pdf");
}

function isVisible(node) {
    if (!node.parentElement) return false;

    const style = window.getComputedStyle(node.parentElement);

    return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        style.opacity !== "0"
    );
}

function extractVisibleText() {

    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    let text = "";
    let node;

    while ((node = walker.nextNode())) {

        if (!isVisible(node)) continue;

        const value = node.nodeValue.trim();
        if (!value) continue;

        text += value + " ";
    }

    return text.trim();
}

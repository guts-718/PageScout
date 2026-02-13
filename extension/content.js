const pageType = isPDFPage() ? "PDF" : "HTML";

const text = extractVisibleText();

console.log("=== SmartSearch Extension Loaded ===");
console.log("Page Type:", pageType);
console.log("Preview:", text.slice(0, 500));

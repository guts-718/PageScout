// here const CONFIG was not working
console.log("CONFIG LOADED");

window.CONFIG = {
    MAX_RESULTS: 100,
    LCS_THRESHOLD: 0.6,
    LCS_MAX_TEXT: 30,
    MIN_RESULTS_BEFORE_LCS: 5,

    STRATEGY_WEIGHT: {
        EXACT: 1000,
        SUBSTRING: 700,
        LCS: 300
    }
};

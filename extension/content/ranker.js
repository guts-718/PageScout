function lcsLength(a, b) {
    const m = a.length;
    const n = b.length;

    const dp = Array(m + 1).fill(null)
        .map(() => Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (a[i - 1] === b[j - 1])
                dp[i][j] = dp[i - 1][j - 1] + 1;
            else
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    return dp[m][n];
}


function scoreSubstring(query, text) {
    return (query.length / text.length) * 100;
}

function scoreLCS(query, text) {
    const truncated = text.slice(0, window.CONFIG.LCS_MAX_TEXT);
    const len = lcsLength(query, truncated);
    return (len / query.length) * 100;
}


function rankResults(results) {
    console.log("strategy: ", results[0].strategy, results[1].strategy)
    return results
        // .filter(r => r.similarity >= window.CONFIG.LCS_THRESHOLD * 100) 
        .filter(r=> r.strategy==="SEMANTIC")  // to check for SEMANTIC...
        .sort((a, b) => b.score - a.score)
        .slice(0, window.CONFIG.MAX_RESULTS);
}

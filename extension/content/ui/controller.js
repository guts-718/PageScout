window.SSController = (() => {

    const state = {
        query: "",
        results: [],
        index: 0
    };

    async function search(query) {
        state.query = query;

        state.results = await runSearch(query);
        console.log("matches:  inside the controller.js sscontroller ", state.results);
        highlightMatches(state.results);
        startNavigation([...document.querySelectorAll("span")]);

        updateCount(state.results.length);

        // async semantic
        runSemanticPhase(query, state.results)
        .then(updated => {

            state.results = updated;

            highlightMatches(updated);
            startNavigation([...document.querySelectorAll("span")]);
            updateCount(updated.length);
        });
    }

    function next() { nextMatch(); }
    function prev() { prevMatch(); }

    function clear() {
        clearHighlights();
        state.results = [];
        updateCount(0);
    }

    let updateCount = ()=>{};

    return {
        search,
        next,
        prev,
        clear,
        setCounterUpdater(fn){ updateCount = fn }
    };

})();

console.log("window.SSController: ", window.SSController)
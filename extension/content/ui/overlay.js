(function(){

if (document.getElementById("ss-root")) return;

const root = document.createElement("div");
root.id = "ss-root";
root.style.display = "none";

root.innerHTML = `
<div class="ss-box ss-dark" id="ss-box">
  <div class="ss-row">
    🔎
    <input class="ss-input" id="ss-input" placeholder="Search page..." />
  </div>

  <div class="ss-row">
    <span class="ss-count" id="ss-count">0 results</span>
    <div style="flex:1"></div>
    <button class="ss-btn" id="ss-prev">Prev</button>
    <button class="ss-btn" id="ss-next">Next</button>
    <button class="ss-btn" id="ss-theme">☀</button>
    <button class="ss-btn" id="ss-close">✕</button>
  </div>
</div>
`;

document.body.appendChild(root);


const link = document.createElement("link");
link.rel = "stylesheet";
link.href = chrome.runtime.getURL("content/ui/overlay.css");
document.head.appendChild(link);


const input = root.querySelector("#ss-input");
const count = root.querySelector("#ss-count");
const box = root.querySelector("#ss-box");

/* CONTROLLER CONNECT */

SSController.setCounterUpdater(n=>{
    count.textContent = `${n} result${n!==1?"s":""}`;
});

/*  BUTTONS  */

root.querySelector("#ss-next").onclick = SSController.next;
root.querySelector("#ss-prev").onclick = SSController.prev;

root.querySelector("#ss-close").onclick = ()=>{
    root.style.display="none";
    SSController.clear();
};

root.querySelector("#ss-theme").onclick = ()=>{
    console.log("TOGGLE TRIED");
    box.classList.toggle("ss-dark");
    box.classList.toggle("ss-light");
};

/* INPUT */

input.addEventListener("keydown", e=>{
    if(e.key==="Enter"){
        SSController.search(input.value.trim());
    }
});

/* KEY SHORTCUTS */

document.addEventListener("keydown", e=>{

    if(e.ctrlKey && e.shiftKey && e.key==="F"){
        e.preventDefault();
        root.style.display="block";
        input.focus();
    }

    if(e.key==="Escape"){
        root.style.display="none";
        SSController.clear();
    }
});

})();
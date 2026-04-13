let showCounter = false;
let displayDiv = null;

function createDisplay() {
    if (document.getElementById("pixelDisplay")) return;

    displayDiv = document.createElement("div");
    displayDiv.id = "pixelDisplay";
    displayDiv.style.position = "fixed";
    displayDiv.style.top = "60px";
    displayDiv.style.right = "10px";
    displayDiv.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
    displayDiv.style.color = "#00FF00";
    displayDiv.style.padding = "15px";
    displayDiv.style.borderRadius = "5px";
    displayDiv.style.fontFamily = "monospace";
    displayDiv.style.zIndex = "10000";
    displayDiv.style.display = "none";
    displayDiv.style.pointerEvents = "auto";
    displayDiv.style.maxHeight = "400px";
    displayDiv.style.overflowY = "auto";
    displayDiv.style.fontSize = "12px";
    displayDiv.style.minWidth = "250px";

    displayDiv.innerHTML = "<strong style='color: #ffff00;'>PIXEL COUNTS</strong><div id='pixelList'></div>";

    document.body.appendChild(displayDiv);
}

function injectButton() {
    if (document.getElementById("pixelCounterBtn")) return;

    let btn = document.createElement("button");
    btn.id = "pixelCounterBtn";
    btn.innerHTML = "Pixels";

    btn.style.position = "fixed";
    btn.style.top = "10px";
    btn.style.right = "10px";
    btn.style.zIndex = "9999";
    btn.style.backgroundColor = "#4CAF50";
    btn.style.color = "white";
    btn.style.border = "2px solid white";
    btn.style.padding = "8px 12px";
    btn.style.cursor = "pointer";
    btn.style.fontSize = "14px";
    btn.style.fontWeight = "bold";
    btn.style.fontFamily = "Arial, sans-serif";

    btn.onclick = function (e) {
        e.stopPropagation();
        showCounter = !showCounter;

        if (displayDiv) {
            displayDiv.style.display = showCounter ? "block" : "none";
            if (showCounter) {
                updateCounter();
            }
        }

        btn.style.backgroundColor = showCounter ? "#f44336" : "#4CAF50";
        btn.innerHTML = showCounter ? "Close" : "Pixels";
    };

    document.body.appendChild(btn);
}

let lastUpdate = 0;

function updateCounter() {
    if (!displayDiv) return;

    let now = Date.now();
    if (now - lastUpdate < 100) return;
    lastUpdate = now;

    let listHtml = "";

    // TEST: Show what variables exist
    if (typeof currentPixels === "undefined") {
        listHtml = "<span style='color: #ff0000;'>ERROR: currentPixels undefined</span>";
    } else if (!Array.isArray(currentPixels)) {
        listHtml = "<span style='color: #ff0000;'>ERROR: currentPixels not array</span>";
    } else if (currentPixels.length === 0) {
        listHtml = "<span style='color: #ffaa00;'>No pixels placed (array empty)</span>";
    } else {
        let counts = {};

        for (let i = 0; i < currentPixels.length; i++) {
            let pixel = currentPixels[i];
            if (pixel && pixel.element) {
                counts[pixel.element] = (counts[pixel.element] || 0) + 1;
            }
        }

        let sorted = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);

        listHtml = `<div style='color: #ffff00; margin: 8px 0; font-weight: bold;'>Total: ${currentPixels.length}</div>`;
        
        for (let el of sorted.slice(0, 20)) {
            listHtml += `<div style='margin: 4px 0;'>${el}: <span style='color: #00ff00;'>${counts[el]}</span></div>`;
        }
    }

    let list = document.getElementById("pixelList");
    if (list) list.innerHTML = listHtml;
}

// Initialize
createDisplay();
injectButton();

// Update continuously while showing
setInterval(() => {
    if (showCounter) {
        updateCounter();
    }
}, 100);

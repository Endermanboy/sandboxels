let showCounter = false;
let displayDiv = null;
let debugDiv = null;

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
    displayDiv.style.minWidth = "200px";

    displayDiv.innerHTML = "<strong>PIXEL COUNTS</strong><div id='pixelList'>Waiting for data...</div>";

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

    btn.onclick = function (e) {
        e.stopPropagation();
        showCounter = !showCounter;

        if (displayDiv) {
            displayDiv.style.display = showCounter ? "block" : "none";
        }

        btn.style.backgroundColor = showCounter ? "#f44336" : "#4CAF50";
        btn.innerHTML = showCounter ? "Close" : "Pixels";
    };

    document.body.appendChild(btn);
}

let lastUpdate = 0;

function updateCounter() {
    if (!showCounter || !displayDiv) return;

    let now = Date.now();
    if (now - lastUpdate < 200) return;
    lastUpdate = now;

    let counts = {};

    // Check what's available
    if (typeof currentPixels === "undefined") {
        document.getElementById("pixelList").innerHTML = "ERROR: currentPixels undefined";
        return;
    }

    if (!Array.isArray(currentPixels)) {
        document.getElementById("pixelList").innerHTML = "ERROR: currentPixels not an array";
        return;
    }

    if (currentPixels.length === 0) {
        document.getElementById("pixelList").innerHTML = "No pixels placed yet";
        return;
    }

    // Count pixels
    for (let i = 0; i < currentPixels.length; i++) {
        let pixel = currentPixels[i];
        if (pixel && pixel.element) {
            counts[pixel.element] = (counts[pixel.element] || 0) + 1;
        }
    }

    let sorted = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);

    let listHtml = `<div style='margin: 10px 0; color: #ffff00;'>Total: ${currentPixels.length}</div>`;
    for (let el of sorted.slice(0, 20)) {
        listHtml += `<div style='margin: 5px 0;'>${el}: <strong>${counts[el]}</strong></div>`;
    }

    let list = document.getElementById("pixelList");
    if (list) list.innerHTML = listHtml;
}

// Initialize
createDisplay();
injectButton();

// Try to hook into game loop
if (typeof runEveryTick === "function") {
    runEveryTick(updateCounter);
} else if (typeof runAfterTick === "function") {
    runAfterTick(updateCounter);
} else {
    // Fallback: update every frame manually
    setInterval(updateCounter, 100);
}

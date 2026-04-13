let showCounter = false;
let displayDiv = null;

// Create UI when DOM is ready
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
    displayDiv.style.pointerEvents = "none";
    displayDiv.style.maxHeight = "400px";
    displayDiv.style.overflowY = "auto";
    displayDiv.style.fontSize = "12px";
    displayDiv.style.border = "2px solid #00FF00";

    displayDiv.innerHTML = "<strong style='color: #00FF00;'>PIXEL COUNTS</strong><div id='pixelList' style='margin-top: 10px;'></div>";

    document.body.appendChild(displayDiv);
}

// Add button
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
    btn.style.borderRadius = "4px";
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
        }

        btn.style.backgroundColor = showCounter ? "#f44336" : "#4CAF50";
        btn.innerHTML = showCounter ? "Close" : "Pixels";
    };

    document.body.appendChild(btn);
}

// Update counter (throttled)
let lastUpdate = 0;

function updateCounter() {
    if (!showCounter || !displayDiv) return;

    // Make sure currentPixels exists
    if (typeof currentPixels === "undefined") return;

    let now = Date.now();
    if (now - lastUpdate < 500) return;
    lastUpdate = now;

    let counts = {};

    // Use currentPixels instead of looping pixelMap
    for (let i = 0; i < currentPixels.length; i++) {
        let pixel = currentPixels[i];
        if (pixel && pixel.element) {
            let name = pixel.element;
            counts[name] = (counts[name] || 0) + 1;
        }
    }

    let sorted = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);

    let listHtml = "";
    for (let el of sorted.slice(0, 20)) {
        listHtml += `<div style='margin: 5px 0;'>${el}: <span style='color: #ffff00;'>${counts[el]}</span></div>`;
    }

    let list = document.getElementById("pixelList");
    if (list) list.innerHTML = listHtml;
}

// Initialize when game loads
window.addEventListener("load", () => {
    createDisplay();
    injectButton();

    if (typeof runAfterTick === "function") {
        runAfterTick(updateCounter);
    } else {
        let interval = setInterval(() => {
            if (typeof runAfterTick === "function") {
                runAfterTick(updateCounter);
                clearInterval(interval);
            }
        }, 200);
    }
});

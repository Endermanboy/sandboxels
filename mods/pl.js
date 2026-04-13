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
    displayDiv.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    displayDiv.style.color = "#00FF00";
    displayDiv.style.padding = "10px";
    displayDiv.style.borderRadius = "5px";
    displayDiv.style.fontFamily = "monospace";
    displayDiv.style.zIndex = "10000";
    displayDiv.style.display = "none";
    displayDiv.style.pointerEvents = "none";
    displayDiv.style.maxHeight = "300px";
    displayDiv.style.overflowY = "auto";
    displayDiv.style.fontSize = "12px";

    displayDiv.innerHTML = "<strong>PIXEL COUNTS</strong><div id='pixelList'></div>";

    document.body.appendChild(displayDiv);
}

// Add button - find any visible container or create one
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

    let now = Date.now();
    if (now - lastUpdate < 500) return;
    lastUpdate = now;

    let counts = {};

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let pixel = pixelMap[x][y];
            if (pixel) {
                let name = pixel.element;
                counts[name] = (counts[name] || 0) + 1;
            }
        }
    }

    let sorted = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);

    let listHtml = "";
    for (let el of sorted.slice(0, 20)) {
        listHtml += `<br>${el.toUpperCase()}: ${counts[el]}`;
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

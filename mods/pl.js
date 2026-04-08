/* Pixel Counter Mod - HTML Overlay Version */

let showCounter = false;
let lastPixelCounts = {};
let displayDiv = null;

// 1. Luodaan tilastovalikko (HTML-elementti)
function createDisplay() {
    if (document.getElementById("pixelDisplay")) return;
    
    displayDiv = document.createElement("div");
    displayDiv.id = "pixelDisplay";
    displayDiv.style.position = "absolute";
    displayDiv.style.top = "50px";
    displayDiv.style.left = "10px";
    displayDiv.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    displayDiv.style.color = "#00FF00";
    displayDiv.style.padding = "10px";
    displayDiv.style.borderRadius = "5px";
    displayDiv.style.fontFamily = "monospace";
    displayDiv.style.zIndex = "10000";
    displayDiv.style.display = "none"; // Piilossa aluksi
    displayDiv.style.pointerEvents = "none"; // Ei estä hiiren käyttöä pelissä
    displayDiv.innerHTML = "<strong>PIXEL COUNTS</strong><div id='pixelList'></div>";
    
    document.body.appendChild(displayDiv);
}

// 2. Luodaan painike yläpalkkiin
function injectButton() {
    let container = document.getElementById("topBar") || document.body;
    if (document.getElementById("pixelCounterBtn")) return;

    let btn = document.createElement("span");
    btn.id = "pixelCounterBtn";
    btn.innerHTML = "Pixels";
    btn.style.padding = "2px 8px";
    btn.style.margin = "2px";
    btn.style.cursor = "pointer";
    btn.style.border = "1px solid #fff";
    btn.style.borderRadius = "4px";
    btn.style.display = "inline-block";
    btn.style.backgroundColor = "#4CAF50";
    btn.style.color = "white";
    btn.style.fontWeight = "bold";

    btn.onclick = function() {
        showCounter = !showCounter;
        displayDiv.style.display = showCounter ? "block" : "none";
        btn.style.backgroundColor = showCounter ? "#f44336" : "#4CAF50";
        btn.innerHTML = showCounter ? "Close" : "Pixels";
    };

    container.appendChild(btn);
}

// 3. Laskenta ja tekstin päivitys
runAfterTick(() => {
    if (!showCounter || !displayDiv) return;

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

    // Päivitetään HTML-listaus
    let listHtml = "";
    let sorted = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    
    for (let el of sorted) {
        listHtml += `<br>${el.toUpperCase()}: ${counts[el]}`;
    }
    document.getElementById("pixelList").innerHTML = listHtml;
});

// Käynnistys
createDisplay();
injectButton();

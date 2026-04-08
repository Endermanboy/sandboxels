/* Pixel Counter Mod - Varma Lataus */

let showCounter = false;
let displayDiv = null;

// 1. Luodaan HTML-ikkuna tilastoille (piilotettuna aluksi)
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
    displayDiv.style.zIndex = "10000"; // Pakotetaan päällimmäiseksi
    displayDiv.style.display = "none"; 
    displayDiv.style.pointerEvents = "none"; 
    displayDiv.innerHTML = "<strong>PIXEL COUNTS</strong><div id='pixelList'></div>";
    
    document.body.appendChild(displayDiv);
}

// 2. Odotetaan yläpalkkia ja lisätään painike
function injectButton() {
    let topBar = document.getElementById("topBar");
    
    // Jos topBaria ei ole vielä olemassa, odotetaan 200 millisekuntia ja yritetään uudelleen
    if (!topBar) {
        setTimeout(injectButton, 200);
        return;
    }

    // Jos painike on jo lisätty (esim. modin tuplalataus), ei tehdä mitään
    if (document.getElementById("pixelCounterBtn")) return;

    // Luodaan painike
    let btn = document.createElement("button");
    btn.id = "pixelCounterBtn";
    btn.innerHTML = "Pixels";
    btn.style.backgroundColor = "#4CAF50";
    btn.style.color = "white";
    btn.style.border = "1px solid white";
    btn.style.borderRadius = "4px";
    btn.style.padding = "2px 6px";
    btn.style.cursor = "pointer";
    btn.style.marginLeft = "5px"; // Pieni rako muihin nappeihin
    btn.style.fontSize = "13px";
    btn.style.fontWeight = "bold";

    // Painikkeen toiminnallisuus
    btn.onclick = function() {
        showCounter = !showCounter;
        if (displayDiv) {
            displayDiv.style.display = showCounter ? "block" : "none";
        }
        btn.style.backgroundColor = showCounter ? "#f44336" : "#4CAF50"; // Vaihtaa värin punaiseksi kun päällä
        btn.innerHTML = showCounter ? "Close" : "Pixels";
    };

    // Lisätään painike yläpalkkiin
    topBar.appendChild(btn);
}

// 3. Lasketaan pikselit ja päivitetään HTML-ikkuna
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

    // Luodaan teksti ja laitetaan se valikkoon
    let listHtml = "";
    let sorted = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    
    for (let el of sorted) {
        listHtml += `<br>${el.toUpperCase()}: ${counts[el]}`;
    }
    document.getElementById("pixelList").innerHTML = listHtml;
});

// Laitetaan rullat pyörimään
createDisplay();
injectButton();

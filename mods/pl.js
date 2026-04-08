/* Pixel Counter Mod - Robust Injection */

let showCounter = false;
let lastPixelCounts = {};

function addCounterButton() {
    // Etsitään paikka, johon nappi laitetaan (erilaisia vaihtoehtoja Sandboxelsin eri versioille)
    let container = document.getElementById("topBar") || 
                    document.querySelector(".button-container") || 
                    document.body;

    // Poistetaan vanha nappi, jos se on jo olemassa (estää tuplakuvakkeet)
    if (document.getElementById("pixelCounterBtn")) return;

    let btn = document.createElement("span");
    btn.id = "pixelCounterBtn";
    btn.innerHTML = "Pixels";
    
    // Tyylitellään nappi näyttämään pelin omalta napilta
    btn.style.padding = "2px 8px";
    btn.style.margin = "2px";
    btn.style.cursor = "pointer";
    btn.style.border = "1px solid #fff";
    btn.style.borderRadius = "4px";
    btn.style.display = "inline-block";
    btn.style.verticalAlign = "middle";
    btn.style.fontSize = "14px";
    btn.style.fontWeight = "bold";
    btn.style.backgroundColor = "#4CAF50";
    btn.style.color = "white";
    btn.style.userSelect = "none";

    btn.onclick = function() {
        showCounter = !showCounter;
        btn.style.backgroundColor = showCounter ? "#f44336" : "#4CAF50";
        btn.innerHTML = showCounter ? "Close" : "Pixels";
    };

    // Jos topBaria ei löydy, laitetaan nappi kellumaan yläreunaan
    if (container === document.body) {
        btn.style.position = "fixed";
        btn.style.top = "5px";
        btn.style.left = "50%";
        btn.style.transform = "translateX(-50%)";
        btn.style.zIndex = "9999";
    }

    container.appendChild(btn);
}

// Suoritetaan heti ja uudestaan hetken kuluttua varmuuden vuoksi
addCounterButton();
setTimeout(addCounterButton, 2000);

// Laskenta-logiikka
runAfterTick(() => {
    if (!showCounter) return;

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
    lastPixelCounts = counts;
});

// Piirretään tiedot
const originalRenderPizzazz = window.renderPizzazz;
window.renderPizzazz = function(ctx) {
    if (originalRenderPizzazz) originalRenderPizzazz(ctx);
    
    if (showCounter) {
        let sortedElements = Object.keys(lastPixelCounts).sort((a, b) => lastPixelCounts[b] - lastPixelCounts[a]);
        
        // Pieni ikkuna näytön vasempaan laitaan
        ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
        ctx.fillRect(10, 60, 160, (sortedElements.length * 20) + 40);
        ctx.strokeStyle = "#4CAF50";
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 60, 160, (sortedElements.length * 20) + 40);

        ctx.fillStyle = "#4CAF50";
        ctx.font = "bold 14px Arial";
        ctx.fillText("PIXELS", 20, 85);

        ctx.fillStyle = "white";
        ctx.font = "12px monospace";
        
        let textY = 105;
        for (let el of sortedElements) {
            ctx.fillText(`${el}: ${lastPixelCounts[el]}`, 20, textY);
            textY += 20;
        }
    }
};

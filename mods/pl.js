/* Pixel Counter Mod - Integroitu käyttöliittymään */

let showCounter = false;
let lastPixelCounts = {};

// Odotetaan, että peli on latautunut, jotta topBar on olemassa
function injectButton() {
    if (!document.getElementById("topBar")) {
        setTimeout(injectButton, 100);
        return;
    }

    // Luodaan painike muiden painikkeiden tyylillä
    let counterBtn = document.createElement("span");
    counterBtn.innerHTML = "Pixels";
    counterBtn.classList.add("topBarButton"); // Käyttää pelin omaa tyyliluokkaa
    counterBtn.style.backgroundColor = "#4CAF50"; // Erottuva väri (vihreä)
    
    counterBtn.onclick = function() {
        showCounter = !showCounter;
        this.style.backgroundColor = showCounter ? "#f44336" : "#4CAF50"; // Vaihtaa väriä kun päällä
    };

    // Lisätään painike yläpalkkiin (esim. Reset-painikkeen viereen)
    document.getElementById("topBar").appendChild(counterBtn);
}

injectButton();

// Laskenta-logiikka (ajetaan vain kun valikko on auki)
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

// Piirretään tilastot ruudulle
const originalRenderPizzazz = window.renderPizzazz;
window.renderPizzazz = function(ctx) {
    if (originalRenderPizzazz) originalRenderPizzazz(ctx);
    
    if (showCounter) {
        let sortedElements = Object.keys(lastPixelCounts).sort((a, b) => lastPixelCounts[b] - lastPixelCounts[a]);
        
        let width = 160;
        let height = (sortedElements.length * 20) + 40;
        let x = 10;
        let y = 50;

        // Tyylikäs laatikko tekstille
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.fillRect(x, y, width, height);
        ctx.strokeRect(x, y, width, height);

        ctx.fillStyle = "#00FF00";
        ctx.font = "bold 14px monospace";
        ctx.fillText("PIXEL COUNTS", x + 10, y + 25);

        ctx.fillStyle = "white";
        ctx.font = "12px monospace";
        
        let textY = y + 45;
        for (let el of sortedElements) {
            let count = lastPixelCounts[el];
            ctx.fillText(`${el.toUpperCase()}:`, x + 10, textY);
            ctx.fillText(`${count}`, x + 110, textY);
            textY += 20;
        }
    }
};

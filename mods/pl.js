/* Pixel Counter Mod for Sandboxels
   Tämä modi laskee kaikki näytöllä olevat pikselit ja näyttää ne listana.
*/

let lastPixelCounts = {};

// Lisätään "vaiheen jälkeinen" suoritus, jotta laskenta tapahtuu joka framella
runAfterTick(() => {
    let counts = {};
    
    // Käydään läpi koko peliruudukko
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

// Piirretään teksti näytölle
function drawPixelCounts(ctx) {
    ctx.fillStyle = "white";
    ctx.font = "12px Arial";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    let yOffset = 50;
    let sortedElements = Object.keys(lastPixelCounts).sort((a, b) => lastPixelCounts[b] - lastPixelCounts[a]);

    if (sortedElements.length === 0) return;

    ctx.strokeText("Pikselit:", 10, yOffset);
    ctx.fillText("Pikselit:", 10, yOffset);
    yOffset += 15;

    for (let el of sortedElements) {
        let text = `${el}: ${lastPixelCounts[el]}`;
        ctx.strokeText(text, 10, yOffset);
        ctx.fillText(text, 10, yOffset);
        yOffset += 15;
    }
}

// Rekisteröidään piirtofunktio pelin renderöintikiertoon
const originalRenderPizzazz = window.renderPizzazz;
window.renderPizzazz = function(ctx) {
    if (originalRenderPizzazz) originalRenderPizzazz(ctx);
    drawPixelCounts(ctx);
};

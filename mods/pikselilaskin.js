// pixel_counter_mod.js
// Näyttää kaikkien elementtien pikselimäärät ruudun kulmassa.

if (typeof elements !== "undefined") {

    // Luodaan overlay-elementti
    var counterBox = document.createElement("div");
    counterBox.style.position = "absolute";
    counterBox.style.left = "10px";
    counterBox.style.top = "10px";
    counterBox.style.padding = "8px 12px";
    counterBox.style.background = "rgba(0,0,0,0.6)";
    counterBox.style.color = "white";
    counterBox.style.fontFamily = "monospace";
    counterBox.style.fontSize = "14px";
    counterBox.style.borderRadius = "6px";
    counterBox.style.zIndex = "999999";
    counterBox.innerText = "Pixel Counter";
    document.body.appendChild(counterBox);

    function updatePixelCounts() {
        var counts = {};
        var total = 0;

        // Käydään läpi koko maailmagrid
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                var p = pixelMap[x][y];
                if (p !== null && p !== undefined) {
                    total++;
                    var name = p.element;
                    if (!counts[name]) counts[name] = 0;
                    counts[name]++;
                }
            }
        }

        // Rakennetaan teksti
        var out = `Kaikkia pikseleitä: ${total}\n`;
        for (var key in counts) {
            out += `${key}: ${counts[key]}\n`;
        }

        counterBox.innerText = out;
    }

    // Päivitetään laskurit 1 sekunnin välein
    setInterval(updatePixelCounts, 1000);
}

// pixel_counter_mod.js
// Erittäin tarkka pikselilaskuri – laskee joka pelitickillä synkassa pelin kanssa.

if (typeof elements !== "undefined") {

    // Näyttölaatikko
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
    counterBox.style.whiteSpace = "pre";
    counterBox.style.zIndex = "999999";
    document.body.appendChild(counterBox);

    // Tallennetaan alkuperäinen pixelTick
    var originalPixelTick = pixelTick;

    // Ylikirjoitetaan pixelTick, jotta laskuri on aina 100% ajan tasalla
    pixelTick = function(pixel) {
        originalPixelTick(pixel);
        updatePixelCounts();
    };

    // Laskentafunktio (hyvin nopea, koska se tekee yhden kierroksen)
    function updatePixelCounts() {
        var counts = {};
        var total = 0;

        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                var p = pixelMap[x][y];
                if (p) {
                    total++;
                    var name = p.element;
                    if (!counts[name]) counts[name] = 0;
                    counts[name]++;
                }
            }
        }

        // Rakennetaan teksti
        var text = `Kaikkia pikseleitä: ${total}\n`;
        for (var e in counts) {
            text += `${e}: ${counts[e]}\n`;
        }

        counterBox.innerText = text;
    }

}

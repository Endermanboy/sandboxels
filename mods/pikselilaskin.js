// pixel_counter_working.js
// Täysin toimiva laskuri – odottaa että peli on ladattu ennen kuin tekee mitään.

runAfterLoad(function() {

    if (typeof pixelMap === "undefined") {
        alert("pixelMap puuttuu – tämä mod toimii vain alkuperäisessä Sandboxelsissa.");
        return;
    }

    // UI-laatikko
    const box = document.createElement("div");
    box.style.position = "absolute";
    box.style.left = "10px";
    box.style.top = "10px";
    box.style.padding = "8px 12px";
    box.style.background = "rgba(0,0,0,0.70)";
    box.style.color = "white";
    box.style.fontFamily = "monospace";
    box.style.fontSize = "14px";
    box.style.whiteSpace = "pre";
    box.style.zIndex = "2000000000";
    box.style.border = "1px solid #fff3";
    box.style.borderRadius = "6px";
    document.body.appendChild(box);

    function countPixels() {
        let total = 0;
        let counts = {};

        for (let x = 0; x < pixelMap.length; x++) {
            for (let y = 0; y < pixelMap[x].length; y++) {
                const p = pixelMap[x][y];
                if (p) {
                    total++;
                    const name = p.element;
                    counts[name] = (counts[name] || 0) + 1;
                }
            }
        }

        let txt = `Kaikkia pikseleitä: ${total}\n\n`;

        const keys = Object.keys(counts).sort((a,b)=>counts[b]-counts[a]);
        for (let k of keys)
            txt += `${k}: ${counts[k]}\n`;

        box.innerText = txt;
    }

    // päivitä joka frame
    function loop() {
        countPixels();
        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
});

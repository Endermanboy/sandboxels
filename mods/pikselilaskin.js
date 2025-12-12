// pixel_counter_precise.js
// Tarkka pikselilaskuri: käyttää suoraan pelin pixels-listaa (jos saatavilla).
// Toimii useimmissa Sandboxels-forkeissa. Fallback pixelMap:iin jos lista puuttuu.

(function(){
    if (typeof elements === "undefined") return;

    // UI
    var box = document.createElement("div");
    box.style.position = "absolute";
    box.style.left = "8px";
    box.style.top = "8px";
    box.style.padding = "8px 10px";
    box.style.background = "rgba(0,0,0,0.65)";
    box.style.color = "white";
    box.style.fontFamily = "monospace";
    box.style.fontSize = "13px";
    box.style.whiteSpace = "pre";
    box.style.zIndex = "999999";
    box.style.borderRadius = "6px";
    box.style.maxHeight = "70vh";
    box.style.overflow = "auto";
    document.body.appendChild(box);

    // Näppäin C piilottaa/näyttää laatikon
    var visible = true;
    window.addEventListener("keydown", function(e){
        if (e.key === "c" || e.key === "C") {
            visible = !visible;
            box.style.display = visible ? "block" : "none";
        }
    });

    // Pääfunktio: laske pixeleitä mahdollisimman tarkasti
    function computeCounts() {
        var counts = Object.create(null);
        var total = 0;

        // 1) ensisijainen: useimmissa porteissa on globaali 'pixels' tai 'pixelList' taulukko
        var list = window.pixels || window.pixelList || window.pixelsList || null;

        if (Array.isArray(list)) {
            // Lista sisältää pikseli-oliot — suodatetaan pois null/undefined
            for (var i = 0; i < list.length; i++) {
                var p = list[i];
                if (!p) continue;
                // Joissain versioissa elementin nimi on p.element, toisissa p.type; käsitellään molemmat
                var name = p.element || p.type || (p.name && typeof p.name === "string" ? p.name : null);
                if (!name) continue;
                total++;
                counts[name] = (counts[name] || 0) + 1;
            }
        } else {
            // fallback: skannaa pixelMap-ruudukon (vanha tapa)
            if (typeof pixelMap !== "undefined" && pixelMap.length) {
                for (var x = 0; x < pixelMap.length; x++) {
                    var col = pixelMap[x];
                    if (!col) continue;
                    for (var y = 0; y < col.length; y++) {
                        var p = col[y];
                        if (!p) continue;
                        var name = p.element || p.type || null;
                        if (!name) continue;
                        total++;
                        counts[name] = (counts[name] || 0) + 1;
                    }
                }
            } else {
                // Ei löydy kumpaakaan — ei voida laskea
                box.innerText = "Ei löydy pixels-listaa tai pixelMapia tästä peliversiosta.";
                return;
            }
        }

        // Rakennetaan teksti: näytetään ensin topit pienestä-suureksi nimenomaan
        var keys = Object.keys(counts);
        // Sortataan laskevasti määrän mukaan
        keys.sort(function(a,b){ return counts[b] - counts[a]; });

        var out = "Kaikkia pikseleitä: " + total + "\n\n";
        for (var k = 0; k < keys.length; k++) {
            var key = keys[k];
            out += key + ": " + counts[key] + "\n";
        }

        box.innerText = out;
    }

    // Päivitä synkronisesti pelin kanssa: yritetään kytkeä pixelTickiin, muuten käytetään requestAnimationFrame
    var hooked = false;
    if (typeof pixelTick === "function") {
        var orig = pixelTick;
        pixelTick = function(pixel) {
            orig(pixel);
            // päivitä vain joka N:s tick suorituskyvyn säästämiseksi
            if (!window._pixelCounterTick) window._pixelCounterTick = 0;
            window._pixelCounterTick++;
            if (window._pixelCounterTick >= 5) { // päivitys ~ joka 5. pixelTick
                computeCounts();
                window._pixelCounterTick = 0;
            }
        };
        hooked = true;
    }

    if (!hooked) {
        // Jos ei pixelTickiä, käytä requestAnimationFrame-pohjaista päivitystä (silti tarkka)
        var rafCount = 0;
        function loop(){
            rafCount++;
            if (rafCount >= 3) { // päivitys ~ joka 3. frame
                computeCounts();
                rafCount = 0;
            }
            requestAnimationFrame(loop);
        }
        requestAnimationFrame(loop);
    }

    // Tarjoa myös manuaalinen päivitys-nappi
    var btn = document.createElement("button");
    btn.innerText = "Päivitä nyt";
    btn.style.display = "block";
    btn.style.marginTop = "8px";
    btn.style.width = "100%";
    btn.onclick = computeCounts;
    box.appendChild(btn);

    // Ensimmäinen päivitys heti
    computeCounts();

    // Poista elementti automaattisesti, jos sivu navigoidaan pois
    window.addEventListener("beforeunload", function(){ try{ document.body.removeChild(box); }catch(e){} });
})();

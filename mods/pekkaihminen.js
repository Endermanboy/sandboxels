// iso_pekka_mod.js
// Lisää peliin ihmismäinen "Iso Pekka" -elementti.

if (typeof elements !== "undefined") {

    elements.iso_pekka = {
        name: "Iso Pekka",
        color: ["#d32f2f", "#212121", "#e57373"], // punainen + musta + vaalea sävy (hymyilevä iho)
        category: "life",
        behavior: behaviors.HUMAN,
        temp: 37,
        state: "solid",
        density: 1000,
        burn: 20,
        burnTime: 200,
        flammability: 10,

        // Pieni persoona mukaan
        tick: function(pixel) {
            // satunnainen “nauru-efekti” (visuaalinen, ei ääniä)
            if (Math.random() < 0.002) {
                // vaihtaa hetkeksi värisävyä "nauraen"
                pixel.color = pickRandom(["#ffccbc", "#ffab91", "#ef9a9a"]);
            }

            // jos syttyy → luo Pekka-savua
            if (pixel.burning && Math.random() < 0.1) {
                var sx = pixel.x + (Math.random() < 0.5 ? -1 : 1);
                var sy = pixel.y - 1;
                if (isEmpty(sx, sy)) {
                    createPixel("pekka_savu", sx, sy);
                }
            }
        }
    };

}

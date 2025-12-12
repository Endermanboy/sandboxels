// pekka_mod.js
// Lisää peliin useita Pekka-teemaisia palavia aineita.

if (typeof elements !== "undefined") {

    // Pekka Rekka – helppo syttyjä
    elements.pekka_rekka = {
        color: ["#ffcc66","#ffaa33"],
        behavior: behaviors.LIQUID,
        category: "liquid",
        flammability: 40,
        burn: 60,
        burnTime: 200,
        reactions: {
            "fire": { elem1: "pekka_liekki", elem2: "pekka_savu" }
        }
    };

    // Pekka Bensa – erittäin herkkä syttyjä
    elements.pekka_bensa = {
        color: ["#ffdd55","#ffbb22"],
        behavior: behaviors.LIQUID,
        category: "liquid",
        flammability: 80,
        burn: 90,
        burnTime: 120,
        reactions: {
            "fire": { elem1: "pekka_liekki", elem2: "pekka_savu" }
        }
    };

    // Pekka Liekk i– itsessään liekkimäinen elementti
    elements.pekka_liekki = {
        color: ["#ff9933","#ff6600","#ff3300"],
        behavior: behaviors.FIRE,
        category: "energy",
        temp: 800,
        burn: 20,
        burnTime: 40,
        state: "gas",
        density: 0.1
    };

    // Pekka Savu – syntyy palamisesta
    elements.pekka_savu = {
        color: ["#666666","#444444","#222222"],
        behavior: behaviors.SMOKE,
        category: "gas",
        state: "gas",
        density: 0.05
    };
}

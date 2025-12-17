// Sponge Mod

elements.sponge = {
    color: ["#f5e27a", "#e6d36a"],
    behavior: behaviors.SOLID,
    category: "solids",
    density: 300,
    tempHigh: 9999, // doesn't burn on its own
    reactions: {
        "water": { 
            elem1: "wet_sponge", 
            elem2: null, 
            chance: 0.5 
        }
    }
};

elements.wet_sponge = {
    color: ["#cfc46a", "#bdb15f"],
    behavior: behaviors.SOLID,
    category: "solids",
    density: 500,
    tempHigh: 100, // when heated
    stateHigh: "sponge",
    reactions: {
        "water": { 
            elem1: "wet_sponge", 
            elem2: null 
        }
    }
};

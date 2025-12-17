// Active Sponge Mod

elements.sponge = {
    color: ["#f5e27a", "#e6d36a"],
    behavior: behaviors.SOLID,
    category: "solids",
    density: 300,
    tick: function(pixel) {
        // Check nearby pixels for water
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                let x = pixel.x + dx;
                let y = pixel.y + dy;
                if (!outOfBounds(x, y)) {
                    let other = pixelMap[x][y];
                    if (other && other.element === "water") {
                        // absorb water
                        deletePixel(other.x, other.y);
                        changePixel(pixel, "wet_sponge");
                        return;
                    }
                }
            }
        }
    }
};

elements.wet_sponge = {
    color: ["#cfc46a", "#bdb15f"],
    behavior: behaviors.SOLID,
    category: "solids",
    density: 500,
    tempHigh: 100,
    stateHigh: "sponge"
};

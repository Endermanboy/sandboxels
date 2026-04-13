let showCounter = false;
let displayDiv = null;

function createDisplay() {
    displayDiv = document.createElement("div");
    displayDiv.id = "pixelDisplay";
    displayDiv.style.position = "fixed";
    displayDiv.style.top = "50px";
    displayDiv.style.left = "10px";
    displayDiv.style.width = "300px";
    displayDiv.style.backgroundColor = "black";
    displayDiv.style.color = "lime";
    displayDiv.style.padding = "10px";
    displayDiv.style.border = "3px solid lime";
    displayDiv.style.zIndex = "99999";
    displayDiv.style.display = "none";
    displayDiv.style.fontSize = "14px";
    displayDiv.style.fontFamily = "monospace";

    displayDiv.innerHTML = "PIXELS: 0";

    document.body.appendChild(displayDiv);
}

function injectButton() {
    let btn = document.createElement("button");
    btn.id = "pixelCounterBtn";
    btn.innerHTML = "SHOW PIXELS";

    btn.style.position = "fixed";
    btn.style.top = "10px";
    btn.style.left = "10px";
    btn.style.width = "120px";
    btn.style.height = "30px";
    btn.style.zIndex = "99998";
    btn.style.backgroundColor = "green";
    btn.style.color = "white";
    btn.style.border = "2px solid white";
    btn.style.fontSize = "12px";
    btn.style.fontWeight = "bold";
    btn.style.cursor = "pointer";

    btn.onclick = function () {
        showCounter = !showCounter;
        displayDiv.style.display = showCounter ? "block" : "none";
        btn.innerHTML = showCounter ? "HIDE" : "SHOW PIXELS";
        btn.style.backgroundColor = showCounter ? "red" : "green";
    };

    document.body.appendChild(btn);
}

// Main update loop
function countPixels() {
    if (!showCounter || !displayDiv) return;

    let total = 0;
    
    if (typeof currentPixels !== "undefined" && currentPixels) {
        total = currentPixels.length;
    }

    displayDiv.innerHTML = "TOTAL PIXELS: " + total;
}

// Run the counter
createDisplay();
injectButton();

setInterval(countPixels, 100);

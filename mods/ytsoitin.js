// yt_bgm_mod.js
// Sandboxels mod — Background music from YouTube (UI on bottom-left).

(function() {
    if (window.__yt_bgm_loaded) return;
    window.__yt_bgm_loaded = true;

    // Load YouTube iframe API
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);

    // Hidden player div
    const playerDiv = document.createElement("div");
    playerDiv.id = "yt_bgm_player";
    playerDiv.style.display = "none";
    document.body.appendChild(playerDiv);

    let player = null;

    // UI container (NOW bottom-left)
    const ui = document.createElement("div");
    ui.style.position = "fixed";
    ui.style.left = "12px";      // << moved from right to left
    ui.style.bottom = "12px";
    ui.style.zIndex = 9999;
    ui.style.background = "rgba(0,0,0,0.6)";
    ui.style.color = "white";
    ui.style.padding = "8px";
    ui.style.borderRadius = "8px";
    ui.style.fontFamily = "Arial";
    ui.style.fontSize = "13px";
    ui.style.display = "flex";
    ui.style.gap = "6px";
    ui.style.alignItems = "center";
    document.body.appendChild(ui);

    // Input + Buttons
    const input = document.createElement("input");
    input.placeholder = "YouTube URL…";
    input.style.width = "150px";

    const loadBtn = document.createElement("button");
    loadBtn.textContent = "Load";
    loadBtn.style.cursor = "pointer";

    const playBtn = document.createElement("button");
    playBtn.textContent = "Play";
    playBtn.style.cursor = "pointer";

    const vol = document.createElement("input");
    vol.type = "range";
    vol.min = 0;
    vol.max = 100;
    vol.value = 60;
    vol.style.width = "80px";

    ui.appendChild(input);
    ui.appendChild(loadBtn);
    ui.appendChild(playBtn);
    ui.appendChild(vol);

    // Extract video ID from URL
    function extractVideoID(url) {
        try {
            const u = new URL(url);
            if (u.hostname.includes("youtu.be")) return u.pathname.substring(1);
            if (u.searchParams.get("v")) return u.searchParams.get("v");
        } catch(e){}
        return null;
    }

    loadBtn.onclick = () => {
        const id = extractVideoID(input.value.trim());
        if (!id) return alert("Invalid YouTube URL");
        if (!player) return;

        player.loadVideoById(id);
        player.playVideo();
        playBtn.textContent = "Pause";
    };

    playBtn.onclick = () => {
        if (!player) return;
        const state = player.getPlayerState();
        if (state === 1) {
            player.pauseVideo();
            playBtn.textContent = "Play";
        } else {
            player.playVideo();
            playBtn.textContent = "Pause";
        }
    };

    vol.oninput = () => {
        if (player) player.setVolume(vol.value);
    };

    // YouTube API callback
    window.onYouTubeIframeAPIReady = function() {
        player = new YT.Player("yt_bgm_player", {
            height: "0",
            width: "0",
            videoId: "",
            playerVars: {
                autoplay: 0,
                controls: 0,
                disablekb: 1
            },
            events: {
                onReady: () => {
                    player.setVolume(vol.value);
                }
            }
        });
    };

})();

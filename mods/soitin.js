// bgm_mod.js
// Sandboxels mod — Background music player using local files
// Save as "bgm_mod.js" and load via Sandboxels Mods manager (enter file URL or filename).

(function(){
  if (window.__bgm_mod_loaded) return;
  window.__bgm_mod_loaded = true;

  // Create audio element
  const audio = document.createElement("audio");
  audio.id = "sandboxels_bgm_player";
  audio.loop = true;
  audio.preload = "none";
  audio.style.display = "none";
  document.body.appendChild(audio);

  // Create UI container
  const ui = document.createElement("div");
  ui.id = "sandboxels_bgm_ui";
  Object.assign(ui.style, {
    position: "fixed",
    right: "12px",
    bottom: "12px",
    zIndex: 9999,
    background: "rgba(0,0,0,0.6)",
    color: "white",
    padding: "8px",
    borderRadius: "8px",
    fontFamily: "Arial, sans-serif",
    fontSize: "13px",
    display: "flex",
    gap: "6px",
    alignItems: "center",
    boxShadow: "0 6px 18px rgba(0,0,0,0.5)"
  });

  // File input (hidden) + visible button
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "audio/*";
  fileInput.style.display = "none";

  const pickBtn = document.createElement("button");
  pickBtn.textContent = "Choose music";
  pickBtn.title = "Choose a music file from your computer";
  pickBtn.style.cursor = "pointer";

  pickBtn.onclick = () => fileInput.click();

  fileInput.onchange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    // revoke old object URL
    if (audio._objUrl) URL.revokeObjectURL(audio._objUrl);
    audio._objUrl = URL.createObjectURL(f);
    audio.src = audio._objUrl;
    audio.play().catch(()=>{ /* autoplay blocked - user can press play */ });
    updateState();
  };

  // Play/pause button
  const playBtn = document.createElement("button");
  playBtn.textContent = "Play";
  playBtn.style.cursor = "pointer";
  playBtn.onclick = () => {
    if (audio.paused) audio.play().catch(()=>{});
    else audio.pause();
    updateState();
  };

  // Loop toggle
  const loopBtn = document.createElement("button");
  loopBtn.textContent = "Loop: on";
  loopBtn.style.cursor = "pointer";
  loopBtn.onclick = () => {
    audio.loop = !audio.loop;
    loopBtn.textContent = "Loop: " + (audio.loop ? "on" : "off");
  };

  // Volume slider
  const vol = document.createElement("input");
  vol.type = "range";
  vol.min = 0;
  vol.max = 1;
  vol.step = 0.01;
  vol.value = 0.6;
  vol.title = "Volume";
  vol.style.width = "90px";
  vol.oninput = () => {
    audio.volume = parseFloat(vol.value);
  };
  audio.volume = parseFloat(vol.value);

  // Mute checkbox
  const mute = document.createElement("input");
  mute.type = "checkbox";
  mute.id = "bgm_mute";
  mute.onchange = () => { audio.muted = mute.checked; };

  const muteLabel = document.createElement("label");
  muteLabel.htmlFor = "bgm_mute";
  muteLabel.textContent = "Mute";

  // Display filename
  const fname = document.createElement("div");
  fname.style.maxWidth = "180px";
  fname.style.overflow = "hidden";
  fname.style.textOverflow = "ellipsis";
  fname.style.whiteSpace = "nowrap";

  // Quick remove button (clears selection)
  const clearBtn = document.createElement("button");
  clearBtn.textContent = "Clear";
  clearBtn.style.cursor = "pointer";
  clearBtn.onclick = () => {
    if (audio._objUrl) {
      URL.revokeObjectURL(audio._objUrl);
      audio._objUrl = null;
    }
    audio.pause();
    audio.src = "";
    fileInput.value = "";
    updateState();
  };

  // Assemble UI
  ui.appendChild(pickBtn);
  ui.appendChild(playBtn);
  ui.appendChild(loopBtn);
  ui.appendChild(vol);
  ui.appendChild(mute);
  ui.appendChild(muteLabel);
  ui.appendChild(clearBtn);
  ui.appendChild(fname);
  document.body.appendChild(ui);
  document.body.appendChild(fileInput);

  // Drag-and-drop support (drop audio files onto the UI)
  ui.addEventListener("dragover", e => { e.preventDefault(); ui.style.opacity = "0.9"; });
  ui.addEventListener("dragleave", e => { ui.style.opacity = "1"; });
  ui.addEventListener("drop", e => {
    e.preventDefault(); ui.style.opacity = "1";
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if (!f) return;
    if (!f.type.startsWith("audio/")) return alert("Please drop an audio file.");
    // load file
    if (audio._objUrl) URL.revokeObjectURL(audio._objUrl);
    audio._objUrl = URL.createObjectURL(f);
    audio.src = audio._objUrl;
    audio.play().catch(()=>{});
    fileInput.value = "";
    updateState();
  });

  // Small helper to update play button text and filename display
  function updateState(){
    playBtn.textContent = audio.paused ? "Play" : "Pause";
    fname.textContent = (audio._objUrl && audio.src) ? (audio._objUrlName || (audio.src.split("/").pop())) : "";
  }

  // Try to remember last selected file during this page session (object URLs are page-only)
  window.addEventListener("beforeunload", () => {
    if (audio._objUrl) URL.revokeObjectURL(audio._objUrl);
  });

  // Expose a quick toggler to the console if needed
  window.__sandboxels_bgm_toggle = function(){ playBtn.click(); };

  // initial update
  updateState();

  // Small integration: attempt to hide UI while the game's settings modal is open (best-effort)
  setInterval(()=>{
    const modal = document.querySelector(".modal, .settings, .dialog");
    if (modal && modal.offsetParent !== null) ui.style.display = "none";
    else ui.style.display = "flex";
  }, 800);

  console.log("Sandboxels BGM mod loaded — use the UI at bottom-right to choose local audio files.");
})();

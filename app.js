(function () {
  "use strict";
  if (window.__t2iEditorLoaded) return;
  window.__t2iEditorLoaded = true;

  const GAL_PREFIX = "localMediaGallery_.";
  const MAX_GALLERY_THUMBS = 60;
  const HISTORY_LIMIT = 40;

  const svg = (p, w) =>
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' +
    (w || 1.7) +
    '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    p +
    "</svg>";

  const ICON = {
    edit: svg(
      '<path d="M4.4 19.6h4.2L19 9.2a2.2 2.2 0 0 0-3.1-3.1L5.5 16.5z"/><path d="M14.3 7.6l2.6 2.6"/>'
    ),
    crop: svg('<path d="M6.6 2.6v14.8h14.8"/><path d="M2.6 6.6h14.8v14.8"/>'),
    rotateL: svg(
      '<path d="M4.8 9.6h9.7a5 5 0 0 1 0 10H8.4"/><path d="M8.3 5.4L4.5 9.6l3.8 4.2"/>'
    ),
    rotateR: svg(
      '<path d="M19.2 9.6H9.5a5 5 0 0 0 0 10h6.1"/><path d="M15.7 5.4l3.8 4.2-3.8 4.2"/>'
    ),
    flipH: svg(
      '<path d="M12 3.4v17.2" stroke-dasharray="2 2.6"/><path d="M9.2 7.6v8.8L4 12z"/><path d="M14.8 7.6v8.8L20 12z"/>'
    ),
    flipV: svg(
      '<path d="M3.4 12h17.2" stroke-dasharray="2 2.6"/><path d="M7.6 9.2h8.8L12 4z"/><path d="M7.6 14.8h8.8L12 20z"/>'
    ),
    undo: svg('<path d="M8.6 6.6H5.2V3.2"/><path d="M5.7 6.8a7.5 7.5 0 1 1-1.4 6"/>'),
    redo: svg('<path d="M15.4 6.6h3.4V3.2"/><path d="M18.3 6.8a7.5 7.5 0 1 0 1.4 6"/>'),
    reset: svg('<path d="M4.6 12a7.4 7.4 0 1 1 2.3 5.3"/><path d="M3.2 14.2l1.3-2.1 2.4 1"/>'),
    download: svg('<path d="M12 3.6v10.6"/><path d="M7.7 10.1l4.3 4.3 4.3-4.3"/><path d="M4.8 19.4h14.4"/>'),
    upload: svg('<path d="M12 20.4V9.8"/><path d="M7.7 14.1l4.3-4.3 4.3 4.3"/><path d="M4.8 4.6h14.4"/>'),
    gallery: svg(
      '<rect x="3.4" y="4.6" width="17.2" height="14.8" rx="2.2"/><path d="M3.9 16.3l4.3-4.3 3.3 3.3 2.5-2.5 5.1 4.8"/><circle cx="9" cy="9.3" r="1.4"/>'
    ),
    x: svg('<path d="M6.4 6.4l11.2 11.2M17.6 6.4L6.4 17.6"/>'),
    sliders: svg(
      '<path d="M5 6.6h14M5 12h14M5 17.4h14"/><circle cx="9.4" cy="6.6" r="1.8"/><circle cx="14.6" cy="12" r="1.8"/><circle cx="8" cy="17.4" r="1.8"/>'
    ),
    wand: svg(
      '<path d="M4.8 19.2l9.4-9.4"/><path d="M16.8 3.4l.9 2.4 2.4.9-2.4.9-.9 2.4-.9-2.4-2.4-.9 2.4-.9z"/><path d="M14.6 7.6l1.8 1.8"/>'
    ),
    transform: svg(
      '<path d="M4.6 8.6h14.8v10.8H4.6z"/><path d="M8.6 8.6V4.6h10.8v10.8h-4"/>'
    ),
    lock: svg(
      '<rect x="5.2" y="10.4" width="13.6" height="9.8" rx="2"/><path d="M8.6 10.4V7.8a3.4 3.4 0 0 1 6.8 0v2.6"/>'
    ),
    unlock: svg(
      '<rect x="5.2" y="10.4" width="13.6" height="9.8" rx="2"/><path d="M8.6 10.4V7.8a3.4 3.4 0 0 1 6.5-1.3"/>'
    ),
    orn: svg('<path d="M12 4.4l2.2 7.6L12 19.6 9.8 12z"/>', 1.2),
    image: svg(
      '<rect x="3.4" y="4.6" width="17.2" height="14.8" rx="2.2"/><circle cx="9" cy="9.4" r="1.5"/><path d="M4.2 17l4.4-4.4 3.3 3.3 2.4-2.4 5.1 4.5"/>'
    ),
    paste: svg(
      '<path d="M9 4.4h6v2.6H9z"/><path d="M15 5.6h2.3a1.7 1.7 0 0 1 1.7 1.7v10.9a1.7 1.7 0 0 1-1.7 1.7H6.7A1.7 1.7 0 0 1 5 18.2V7.3a1.7 1.7 0 0 1 1.7-1.7H9"/>'
    ),
    check: svg('<path d="M4.8 12.5l4.9 4.9L19.4 7.2"/>'),
  };

  function editorCss() {
    return "";
  }

  function injectCss() {
    if (document.getElementById("t2ie-css")) return;
    const st = document.createElement("style");
    st.id = "t2ie-css";
    st.textContent = editorCss();
    document.head.appendChild(st);
  }

  const DEFAULTS = {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    exposure: 0,
    warmth: 0,
    hue: 0,
    blur: 0,
    fade: 0,
    vignette: 0,
    grain: 0,
    sepia: 0,
    grayscale: 0,
  };

  const SLIDERS = [
    ["brightness", "Brightness", 0, 200, 1, 100, "%"],
    ["contrast", "Contrast", 0, 200, 1, 100, "%"],
    ["saturation", "Saturation", 0, 200, 1, 100, "%"],
    ["exposure", "Exposure", -100, 100, 1, 0, ""],
    ["warmth", "Warmth", -100, 100, 1, 0, ""],
    ["hue", "Hue", -180, 180, 1, 0, "deg"],
    ["blur", "Blur", 0, 20, 0.5, 0, "px"],
    ["fade", "Fade", 0, 100, 1, 0, ""],
    ["vignette", "Vignette", 0, 100, 1, 0, ""],
    ["grain", "Grain", 0, 100, 1, 0, ""],
    ["sepia", "Sepia", 0, 100, 1, 0, ""],
    ["grayscale", "Black & White", 0, 100, 1, 0, ""],
  ];

  const PRESETS = [
    { name: "Original", adj: {} },
    { name: "Art Deco", adj: { brightness: 106, contrast: 114, saturation: 120, warmth: 16, vignette: 26, grain: 12 } },
    { name: "Gilded", adj: { brightness: 108, contrast: 106, saturation: 114, warmth: 32, sepia: 28, vignette: 30 } },
    { name: "Noir", adj: { brightness: 98, contrast: 134, saturation: 0, grayscale: 100, vignette: 40, grain: 16 } },
    { name: "Vintage", adj: { contrast: 96, saturation: 84, sepia: 42, warmth: 14, fade: 16, vignette: 26, grain: 14 } },
    { name: "Cinematic", adj: { brightness: 98, contrast: 118, saturation: 110, warmth: -8, vignette: 34, fade: 6 } },
    { name: "Vivid", adj: { brightness: 104, contrast: 112, saturation: 152 } },
    { name: "Cool", adj: { warmth: -34, saturation: 106, contrast: 104 } },
    { name: "Warm", adj: { warmth: 36, brightness: 105, saturation: 112 } },
    { name: "Fade", adj: { contrast: 88, saturation: 88, fade: 30, brightness: 106 } },
    { name: "Drama", adj: { contrast: 142, brightness: 94, saturation: 96, vignette: 44 } },
    { name: "Mono", adj: { saturation: 0, grayscale: 100, contrast: 110 } },
  ];

  const ASPECTS = [
    { label: "Free", r: 0 },
    { label: "1:1", r: 1 },
    { label: "4:3", r: 4 / 3 },
    { label: "3:4", r: 3 / 4 },
    { label: "16:9", r: 16 / 9 },
    { label: "9:16", r: 9 / 16 },
  ];

  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const newCanvas = (w, h) => {
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.round(w));
    c.height = Math.max(1, Math.round(h));
    return c;
  };
  const cloneCanvas = (c) => {
    const n = newCanvas(c.width, c.height);
    n.getContext("2d").drawImage(c, 0, 0);
    return n;
  };
  const loadImg = (src) =>
    new Promise((res, rej) => {
      const im = new Image();
      im.onload = () => res(im);
      im.onerror = () => rej(new Error("Could not load that image"));
      im.src = src;
    });

  let noiseTile = null;
  function getNoise() {
    if (noiseTile) return noiseTile;
    const n = 300;
    const c = newCanvas(n, n);
    const ctx = c.getContext("2d");
    const data = ctx.createImageData(n, n);
    let seed = 1337;
    const rnd = () => {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    for (let i = 0; i < data.data.length; i += 4) {
      const v = 110 + Math.round(rnd() * 90);
      data.data[i] = v;
      data.data[i + 1] = v;
      data.data[i + 2] = v;
      data.data[i + 3] = 255;
    }
    ctx.putImageData(data, 0, 0);
    noiseTile = c;
    return c;
  }

  function filterString(a, scale) {
    const parts = [];
    const bright = a.exposure ? a.brightness * Math.pow(2, a.exposure / 200) : a.brightness;
    if (bright !== 100) parts.push("brightness(" + bright.toFixed(1) + "%)");
    if (a.contrast !== 100) parts.push("contrast(" + a.contrast + "%)");
    if (a.saturation !== 100) parts.push("saturate(" + a.saturation + "%)");
    if (a.sepia) parts.push("sepia(" + a.sepia + "%)");
    if (a.grayscale) parts.push("grayscale(" + a.grayscale + "%)");
    if (a.hue) parts.push("hue-rotate(" + a.hue + "deg)");
    if (a.blur) parts.push("blur(" + (a.blur * scale).toFixed(2) + "px)");
    return parts.length ? parts.join(" ") : "none";
  }

  function paint(ctx, W, H, a, scale, opt) {
    const o = opt || {};
    const f = filterString(a, scale);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    if (o.bg) {
      ctx.fillStyle = o.bg;
      ctx.fillRect(0, 0, W, H);
    } else {
      ctx.clearRect(0, 0, W, H);
    }
    if (ctx.filter !== undefined) ctx.filter = f;
    ctx.drawImage(o.img, o.dx, o.dy, o.dw, o.dh);
    if (ctx.filter !== undefined) ctx.filter = "none";
    if (a.warmth) {
      ctx.globalCompositeOperation = "soft-light";
      ctx.globalAlpha = Math.min(1, (Math.abs(a.warmth) / 100) * 0.85);
      ctx.fillStyle = a.warmth > 0 ? "#ffa43c" : "#3f8cff";
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
    }
    if (a.fade) {
      ctx.globalAlpha = (a.fade / 100) * 0.26;
      ctx.fillStyle = "#f0e6ca";
      ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = 1;
    }
    if (a.vignette) {
      const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.24, W / 2, H / 2, Math.max(W, H) * 0.74);
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(1, "rgba(0,0,0," + ((a.vignette / 100) * 0.88).toFixed(3) + ")");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }
    if (a.grain) {
      const tile = getNoise();
      ctx.globalCompositeOperation = "overlay";
      ctx.globalAlpha = Math.min(0.85, (a.grain / 100) * 0.72);
      for (let y = 0; y < H; y += tile.height) {
        for (let x = 0; x < W; x += tile.width) ctx.drawImage(tile, x, y);
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
    }
  }

  const state = {
    base: null,
    adj: Object.assign({}, DEFAULTS),
    crop: { x: 0, y: 0, w: 1, h: 1 },
    name: "image",
    preset: "Original",
    aspect: 0,
    lock: true,
    hist: [],
    hi: -1,
  };

  let modal = null;
  let els = {};
  let drag = null;
  let busy = false;

  function buildModal() {
    if (modal) return modal;
    injectCss();
    modal = document.createElement("div");
    modal.className = "t2ie-modal";
    modal.hidden = true;
    modal.innerHTML = `
      <div class="t2ie-sheet" role="dialog" aria-label="Image editor">
        <div class="t2ie-top">
          <div class="t2ie-brand">${ICON.orn}<span id="t2ie-brand-text">Image Editor</span></div>
          <div class="t2ie-top-actions">
            <button class="t2ie-ic" data-act="undo" title="Undo">${ICON.undo}</button>
            <button class="t2ie-ic" data-act="redo" title="Redo">${ICON.redo}</button>
            <button class="t2ie-ic" data-act="reset" title="Reset everything">${ICON.reset}</button>
            <button class="t2ie-ic" data-act="close" title="Close (Esc)">${ICON.x}</button>
          </div>
        </div>
        <div class="t2ie-main">
          <div class="t2ie-stage" id="t2ie-stage">
            <div class="t2ie-stage-in" id="t2ie-stage-in">
              <canvas id="t2ie-canvas"></canvas>
              <div class="t2ie-crop" id="t2ie-crop" hidden>
                <div class="t2ie-crop-box" id="t2ie-crop-box">
                  <span class="t2ie-h" data-h="nw"></span><span class="t2ie-h" data-h="n"></span><span class="t2ie-h" data-h="ne"></span>
                  <span class="t2ie-h" data-h="w"></span><span class="t2ie-h" data-h="e"></span>
                  <span class="t2ie-h" data-h="sw"></span><span class="t2ie-h" data-h="s"></span><span class="t2ie-h" data-h="se"></span>
                </div>
              </div>
            </div>
          </div>
          <aside class="t2ie-panel">
            <div class="t2ie-tabs">
              <button class="t2ie-tab on" data-tab="adjust">${ICON.sliders}<span>Adjust</span></button>
              <button class="t2ie-tab" data-tab="filters">${ICON.wand}<span>Looks</span></button>
              <button class="t2ie-tab" data-tab="transform">${ICON.transform}<span>Reshape</span></button>
              <button class="t2ie-tab" data-tab="export">${ICON.download}<span>Save</span></button>
            </div>
            <div class="t2ie-panes">
              <div class="t2ie-pane" data-pane="adjust">
                <div class="t2ie-sec"><div class="t2ie-sec-title">Light &amp; Colour</div>${SLIDERS.map(sliderRow).join("")}</div>
                <div class="t2ie-note">Double-click a slider to send it back to its default.</div>
              </div>
              <div class="t2ie-pane" data-pane="filters" hidden>
                <div class="t2ie-sec"><div class="t2ie-sec-title">Looks</div><div class="t2ie-grid" id="t2ie-presets"></div></div>
                <div class="t2ie-note">A look replaces the sliders above - tweak them afterwards to taste.</div>
              </div>
              <div class="t2ie-pane" data-pane="transform" hidden>
                <div class="t2ie-sec">
                  <div class="t2ie-sec-title">Rotate &amp; Flip</div>
                  <div class="t2ie-row four">
                    <button class="t2ie-btn" data-act="rotl" title="Rotate left">${ICON.rotateL}</button>
                    <button class="t2ie-btn" data-act="rotr" title="Rotate right">${ICON.rotateR}</button>
                    <button class="t2ie-btn" data-act="fliph" title="Flip horizontally">${ICON.flipH}</button>
                    <button class="t2ie-btn" data-act="flipv" title="Flip vertically">${ICON.flipV}</button>
                  </div>
                </div>
                <div class="t2ie-sec">
                  <div class="t2ie-sec-title">Crop</div>
                  <div class="t2ie-aspect" id="t2ie-aspects">${ASPECTS.map(
                    (a, i) => `<button class="t2ie-chip${i === 0 ? " on" : ""}" data-aspect="${i}" data-r="${a.r}">${a.label}</button>`
                  ).join("")}</div>
                  <div class="t2ie-row" style="margin-top:9px;">
                    <button class="t2ie-btn" data-act="croptoggle" id="t2ie-crop-toggle">${ICON.crop}<span>start crop</span></button>
                    <button class="t2ie-btn gold" data-act="cropapply" id="t2ie-crop-apply" disabled>${ICON.check}<span>apply</span></button>
                  </div>
                </div>
                <div class="t2ie-sec">
                  <div class="t2ie-sec-title">Resize</div>
                  <div class="t2ie-field"><label>Width</label><input type="number" id="t2ie-w" min="1" max="8000" step="1"><span class="t2ie-unit">px</span></div>
                  <div class="t2ie-field"><label>Height</label><input type="number" id="t2ie-hh" min="1" max="8000" step="1"><span class="t2ie-unit">px</span></div>
                  <div class="t2ie-row">
                    <button class="t2ie-btn" data-act="lock" id="t2ie-lock">${ICON.lock}<span>locked</span></button>
                    <button class="t2ie-btn gold" data-act="resize">${ICON.check}<span>resize</span></button>
                  </div>
                  <div class="t2ie-row" style="margin-top:7px;">
                    <button class="t2ie-btn" data-act="scale" data-v="50">50%</button>
                    <button class="t2ie-btn" data-act="scale" data-v="200">200%</button>
                  </div>
                </div>
              </div>
              <div class="t2ie-pane" data-pane="export" hidden>
                <div class="t2ie-sec">
                  <div class="t2ie-sec-title">Save</div>
                  <div class="t2ie-field"><label>Format</label>
                    <select id="t2ie-fmt" class="t2ie-sel">
                      <option value="image/png">PNG - lossless</option>
                      <option value="image/jpeg">JPEG - smaller</option>
                      <option value="image/webp">WebP</option>
                    </select>
                  </div>
                  <label class="t2ie-sld" id="t2ie-qwrap">
                    <span class="t2ie-sld-top"><span class="t2ie-sld-name">Quality</span><span class="t2ie-sld-val" id="t2ie-qv">92%</span></span>
                    <input type="range" class="t2ie-range" id="t2ie-q" min="40" max="100" step="1" value="92">
                  </label>
                  <div class="t2ie-row" style="margin-top:4px;">
                    <button class="t2ie-btn gold" data-act="download">${ICON.download}<span>download</span></button>
                    <button class="t2ie-btn" data-act="copy">${ICON.paste}<span>copy</span></button>
                  </div>
                  <button class="t2ie-btn wide" data-act="savegal" id="t2ie-savegal" style="margin-top:7px;" hidden>${ICON.gallery}<span>save to my gallery</span></button>
                  <div class="t2ie-note" id="t2ie-export-note"></div>
                </div>
              </div>
            </div>
            <div class="t2ie-foot">
              <span class="t2ie-dim" id="t2ie-dims">-</span>
              <button class="t2ie-link" data-act="picker">change image</button>
            </div>
          </aside>
        </div>
        <div class="t2ie-picker" id="t2ie-picker" hidden>
          <div class="t2ie-pk-head">
            <div class="t2ie-brand">${ICON.orn}<span>Choose An Image</span></div>
            <button class="t2ie-ic" data-act="pkclose" title="Back">${ICON.x}</button>
          </div>
          <div class="t2ie-pk-tabs">
            <button class="t2ie-tab on" data-pk="mine">${ICON.gallery}<span>my images</span></button>
            <button class="t2ie-tab" data-pk="upload">${ICON.upload}<span>upload</span></button>
          </div>
          <div class="t2ie-pk-body">
            <div data-pk-pane="mine">
              <div class="t2ie-pk-grid" id="t2ie-pk-grid"></div>
              <div class="t2ie-note" id="t2ie-pk-note"></div>
              <div class="t2ie-bar" id="t2ie-pk-bar" hidden><i></i></div>
            </div>
            <div data-pk-pane="upload" hidden>
              <label class="t2ie-drop" id="t2ie-drop">
                ${ICON.upload}
                <b>Drop an image here</b>
                <small>or click to browse your files, or paste one with Ctrl+V. Nothing is uploaded anywhere - all editing happens inside your browser.</small>
                <input type="file" accept="image/*" hidden id="t2ie-file">
              </label>
            </div>
          </div>
        </div>
      </div>`;
    document.body.appendChild(modal);

    els = {
      sheet: modal.querySelector(".t2ie-sheet"),
      stage: modal.querySelector("#t2ie-stage"),
      stageIn: modal.querySelector("#t2ie-stage-in"),
      canvas: modal.querySelector("#t2ie-canvas"),
      crop: modal.querySelector("#t2ie-crop"),
      cropBox: modal.querySelector("#t2ie-crop-box"),
      dims: modal.querySelector("#t2ie-dims"),
      brand: modal.querySelector("#t2ie-brand-text"),
      presets: modal.querySelector("#t2ie-presets"),
      aspects: modal.querySelector("#t2ie-aspects"),
      w: modal.querySelector("#t2ie-w"),
      h: modal.querySelector("#t2ie-hh"),
      lock: modal.querySelector("#t2ie-lock"),
      fmt: modal.querySelector("#t2ie-fmt"),
      q: modal.querySelector("#t2ie-q"),
      qv: modal.querySelector("#t2ie-qv"),
      qwrap: modal.querySelector("#t2ie-qwrap"),
      exNote: modal.querySelector("#t2ie-export-note"),
      picker: modal.querySelector("#t2ie-picker"),
      pkGrid: modal.querySelector("#t2ie-pk-grid"),
      pkNote: modal.querySelector("#t2ie-pk-note"),
      pkBar: modal.querySelector("#t2ie-pk-bar"),
      drop: modal.querySelector("#t2ie-drop"),
      file: modal.querySelector("#t2ie-file"),
      savegal: modal.querySelector("#t2ie-savegal"),
      cropToggle: modal.querySelector("#t2ie-crop-toggle"),
      cropApply: modal.querySelector("#t2ie-crop-apply"),
    };

    buildSliders();
    buildPresets();
    wire();
    els.savegal.hidden = !hasGallery();
    syncFormatUi();
    return modal;
  }

  function sliderRow(s) {
    return `<label class="t2ie-sld" data-k="${s[0]}" data-def="${s[5]}">
      <span class="t2ie-sld-top"><span class="t2ie-sld-name">${s[1]}</span><span class="t2ie-sld-val" data-v="${s[0]}">${fmtVal(s[0], s[5], s[6])}</span></span>
      <input type="range" class="t2ie-range" id="t2ie-s-${s[0]}" min="${s[2]}" max="${s[3]}" step="${s[4]}" value="${s[5]}">
    </label>`;
  }

  function fmtVal(k, v, unit) {
    const u = unit === "deg" ? "\u00b0" : unit;
    if (k === "blur") return v.toFixed(1).replace(/\.0$/, "") + u;
    if ((k === "exposure" || k === "warmth" || k === "hue") && v > 0) return "+" + v + u;
    return v + u;
  }

  function buildSliders() {
    SLIDERS.forEach((s) => {
      const input = modal.querySelector("#t2ie-s-" + s[0]);
      input.addEventListener("input", () => {
        state.adj[s[0]] = Number(input.value);
        modal.querySelector('[data-v="' + s[0] + '"]').textContent = fmtVal(s[0], state.adj[s[0]], s[6]);
        state.preset = "";
        markPreset();
        schedulePreview();
      });
      input.addEventListener("change", () => pushHistory());
      const row = modal.querySelector('.t2ie-sld[data-k="' + s[0] + '"]');
      row.addEventListener("dblclick", (e) => {
        if (e.target === input) return;
        state.adj[s[0]] = s[5];
        input.value = s[5];
        modal.querySelector('[data-v="' + s[0] + '"]').textContent = fmtVal(s[0], s[5], s[6]);
        schedulePreview();
        pushHistory();
      });
    });
  }

  function buildPresets() {
    els.presets.innerHTML = PRESETS.map(
      (p, i) => `<button class="t2ie-filt" data-preset="${i}"><canvas width="170" height="128"></canvas><span>${p.name}</span></button>`
    ).join("");
  }

  function renderPresetThumbs() {
    if (!state.base || !els.presets) return;
    const list = els.presets.querySelectorAll(".t2ie-filt");
    PRESETS.forEach((p, i) => {
      const cv = list[i] && list[i].querySelector("canvas");
      if (!cv) return;
      const a = Object.assign({}, DEFAULTS, p.adj);
      const s = Math.max(cv.width / state.base.width, cv.height / state.base.height);
      const dw = state.base.width * s;
      const dh = state.base.height * s;
      paint(cv.getContext("2d"), cv.width, cv.height, a, s, {
        img: state.base,
        dx: (cv.width - dw) / 2,
        dy: (cv.height - dh) / 2,
        dw,
        dh,
      });
    });
    markPreset();
  }

  function markPreset() {
    if (!els.presets) return;
    els.presets.querySelectorAll(".t2ie-filt").forEach((b, i) => b.classList.toggle("on", PRESETS[i].name === state.preset));
  }

  function soon(fn) {
    let done = false;
    const run = () => {
      if (done) return;
      done = true;
      fn();
    };
    if (window.requestAnimationFrame) requestAnimationFrame(run);
    setTimeout(run, 90);
  }

  let rafToken = 0;
  function schedulePreview() {
    if (rafToken) return;
    rafToken = 1;
    soon(() => {
      rafToken = 0;
      renderPreview();
    });
  }

  function fitPreview() {
    if (!state.base) return;
    const aw = Math.max(60, els.stage.clientWidth - 34);
    const ah = Math.max(60, els.stage.clientHeight - 34);
    const s = Math.min(aw / state.base.width, ah / state.base.height);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const cssW = Math.max(1, Math.round(state.base.width * s));
    const cssH = Math.max(1, Math.round(state.base.height * s));
    els.canvas.style.width = cssW + "px";
    els.canvas.style.height = cssH + "px";
    els.canvas.width = Math.round(cssW * dpr);
    els.canvas.height = Math.round(cssH * dpr);
    renderPreview();
    layoutCrop();
  }

  function renderPreview() {
    if (!state.base) return;
    const ctx = els.canvas.getContext("2d");
    const W = els.canvas.width;
    const H = els.canvas.height;
    const pad = state.adj.blur ? state.adj.blur * (W / state.base.width) * 2.4 : 0;
    if (pad > 0) {
      const s = Math.max((W + pad * 2) / W, (H + pad * 2) / H);
      const dw = W * s;
      const dh = H * s;
      paint(ctx, W, H, state.adj, W / state.base.width, {
        img: state.base,
        dx: (W - dw) / 2,
        dy: (H - dh) / 2,
        dw,
        dh,
      });
    } else {
      paint(ctx, W, H, state.adj, W / state.base.width, { img: state.base, dx: 0, dy: 0, dw: W, dh: H });
    }
    els.dims.textContent = state.base.width + " x " + state.base.height + " px";
    els.brand.textContent = state.name || "Image Editor";
  }

  function syncSizeInputs() {
    if (!state.base || !els.w) return;
    els.w.value = state.base.width;
    els.h.value = state.base.height;
  }

  function layoutCrop() {
    if (!els.crop || els.crop.hidden) return;
    const c = state.crop;
    const b = els.cropBox;
    b.style.left = c.x * 100 + "%";
    b.style.top = c.y * 100 + "%";
    b.style.width = c.w * 100 + "%";
    b.style.height = c.h * 100 + "%";
  }

  function setCropMode(on) {
    if (!els.crop) return;
    els.crop.hidden = !on;
    els.cropToggle.classList.toggle("gold", on);
    els.cropToggle.querySelector("span").textContent = on ? "cancel crop" : "start crop";
    els.cropApply.disabled = !on;
    if (on) {
      if (state.crop.w >= 0.999 && state.crop.h >= 0.999) {
        state.crop = { x: 0.1, y: 0.1, w: 0.8, h: 0.8 };
        applyAspectToCrop();
      }
      layoutCrop();
    }
  }

  function applyAspectToCrop() {
    const r = state.aspect;
    if (!r || !state.base) return;
    const c = state.crop;
    const px = c.w * state.base.width;
    const py = c.h * state.base.height;
    let nw = px;
    let nh = px / r;
    if (nh > py) {
      nh = py;
      nw = nh * r;
    }
    c.x = clamp(c.x + (px - nw) / 2 / state.base.width, 0, 1 - nw / state.base.width);
    c.y = clamp(c.y + (py - nh) / 2 / state.base.height, 0, 1 - nh / state.base.height);
    c.w = nw / state.base.width;
    c.h = nh / state.base.height;
  }

  function pushHistory() {
    if (!state.base) return;
    state.hist = state.hist.slice(0, state.hi + 1);
    state.hist.push({ base: cloneCanvas(state.base), adj: Object.assign({}, state.adj), name: state.name });
    if (state.hist.length > HISTORY_LIMIT) state.hist.shift();
    state.hi = state.hist.length - 1;
    syncHistoryButtons();
  }

  function syncHistoryButtons() {
    if (!modal) return;
    const u = modal.querySelector('[data-act="undo"]');
    const r = modal.querySelector('[data-act="redo"]');
    if (u) u.disabled = state.hi <= 0;
    if (r) r.disabled = state.hi >= state.hist.length - 1;
  }

  function undo() {
    if (state.hi <= 0) return;
    state.hi--;
    restore();
  }
  function redo() {
    if (state.hi >= state.hist.length - 1) return;
    state.hi++;
    restore();
  }
  function restore() {
    const s = state.hist[state.hi];
    if (!s) return;
    state.base = cloneCanvas(s.base);
    state.adj = Object.assign({}, s.adj);
    state.name = s.name;
    state.preset = "";
    state.crop = { x: 0, y: 0, w: 1, h: 1 };
    syncSliders();
    markPreset();
    setCropMode(false);
    syncSizeInputs();
    fitPreview();
    scheduleThumbs();
  }

  function syncSliders() {
    if (!modal) return;
    SLIDERS.forEach((s) => {
      const input = modal.querySelector("#t2ie-s-" + s[0]);
      if (!input) return;
      input.value = state.adj[s[0]];
      modal.querySelector('[data-v="' + s[0] + '"]').textContent = fmtVal(s[0], state.adj[s[0]], s[6]);
    });
  }

  let thumbsTimer = 0;
  function scheduleThumbs() {
    clearTimeout(thumbsTimer);
    thumbsTimer = setTimeout(renderPresetThumbs, 90);
  }

  function applyStatic(fn) {
    if (!state.base) return;
    fn();
    state.crop = { x: 0, y: 0, w: 1, h: 1 };
    setCropMode(false);
    syncSizeInputs();
    fitPreview();
    scheduleThumbs();
    pushHistory();
  }

  function rotate(dir) {
    applyStatic(() => {
      const b = state.base;
      const n = newCanvas(b.height, b.width);
      const ctx = n.getContext("2d");
      ctx.translate(n.width / 2, n.height / 2);
      ctx.rotate((dir * Math.PI) / 2);
      ctx.drawImage(b, -b.width / 2, -b.height / 2);
      state.base = n;
    });
  }

  function flip(axis) {
    applyStatic(() => {
      const b = state.base;
      const n = newCanvas(b.width, b.height);
      const ctx = n.getContext("2d");
      ctx.translate(axis === "h" ? n.width : 0, axis === "v" ? n.height : 0);
      ctx.scale(axis === "h" ? -1 : 1, axis === "v" ? -1 : 1);
      ctx.drawImage(b, 0, 0);
      state.base = n;
    });
  }

  function applyCrop() {
    if (!state.base) return;
    const c = state.crop;
    const x = Math.round(c.x * state.base.width);
    const y = Math.round(c.y * state.base.height);
    const w = Math.max(1, Math.round(c.w * state.base.width));
    const h = Math.max(1, Math.round(c.h * state.base.height));
    if (w === state.base.width && h === state.base.height && x === 0 && y === 0) {
      flash("", "Nothing to crop yet - drag the gold box first.", "bad");
      return;
    }
    applyStatic(() => {
      const n = newCanvas(w, h);
      n.getContext("2d").drawImage(state.base, x, y, w, h, 0, 0, w, h);
      state.base = n;
    });
    flash("", "Cropped to " + w + " x " + h + " px.", "ok");
  }

  function scaleTo(w, h, msg) {
    applyStatic(() => {
      const n = newCanvas(w, h);
      const ctx = n.getContext("2d");
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(state.base, 0, 0, w, h);
      state.base = n;
    });
    flash("", msg, "ok");
  }

  function applyResize() {
    if (!state.base) return;
    const w = clamp(Math.round(Number(els.w.value) || state.base.width), 1, 8000);
    const h = clamp(Math.round(Number(els.h.value) || state.base.height), 1, 8000);
    scaleTo(w, h, "Resized to " + w + " x " + h + " px.");
  }

  function setBase(img, name) {
    buildModal();
    const c = newCanvas(img.naturalWidth || img.width, img.naturalHeight || img.height);
    c.getContext("2d").drawImage(img, 0, 0);
    state.base = c;
    state.name = name || "image";
    state.adj = Object.assign({}, DEFAULTS);
    state.preset = "Original";
    state.crop = { x: 0, y: 0, w: 1, h: 1 };
    state.aspect = 0;
    state.hist = [];
    state.hi = -1;
    pushHistory();
    syncSliders();
    syncSizeInputs();
    if (els.aspects) els.aspects.querySelectorAll(".t2ie-chip").forEach((b, i) => b.classList.toggle("on", i === 0));
    markPreset();
    flash("", "");
    modal.hidden = false;
    els.picker.hidden = true;
    soon(() => {
      setCropMode(false);
      fitPreview();
      renderPresetThumbs();
    });
  }

  function flash(title, msg, cls) {
    if (!els.exNote) return;
    els.exNote.className = "t2ie-note" + (cls ? " " + cls : "");
    els.exNote.textContent = msg || "";
  }

  function exportCanvas() {
    const out = newCanvas(state.base.width, state.base.height);
    const ctx = out.getContext("2d");
    const bg = els.fmt.value === "image/jpeg" ? "#ffffff" : null;
    const pad = state.adj.blur ? state.adj.blur * 2.4 : 0;
    if (pad > 0) {
      const s = Math.max((out.width + pad * 2) / out.width, (out.height + pad * 2) / out.height);
      const dw = out.width * s;
      const dh = out.height * s;
      paint(ctx, out.width, out.height, state.adj, 1, { img: state.base, dx: (out.width - dw) / 2, dy: (out.height - dh) / 2, dw, dh, bg });
    } else {
      paint(ctx, out.width, out.height, state.adj, 1, { img: state.base, dx: 0, dy: 0, dw: out.width, dh: out.height, bg });
    }
    return out;
  }

  function exportBlob() {
    const out = exportCanvas();
    const fmt = els.fmt.value;
    const q = clamp(Number(els.q.value) / 100, 0.05, 1);
    return new Promise((res, rej) => {
      out.toBlob(
        (b) => (b ? res({ blob: b, canvas: out }) : rej(new Error("Your browser could not encode this image."))),
        fmt,
        fmt === "image/png" ? undefined : q
      );
    });
  }

  function fileName(ext) {
    const base = (state.name || "image")
      .replace(/\.[a-z0-9]+$/i, "")
      .replace(/[^\w\-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60);
    return (base || "image") + "-edited." + ext;
  }

  function extFor(fmt) {
    return fmt === "image/png" ? "png" : fmt === "image/webp" ? "webp" : "jpg";
  }

  function syncFormatUi() {
    if (!els.fmt) return;
    const png = els.fmt.value === "image/png";
    els.q.disabled = png;
    els.qwrap.style.opacity = png ? "0.42" : "1";
  }

  function hasGallery() {
    return typeof root === "function" && !!root.kv && !!window.t2i_privateGallery;
  }

  async function download() {
    if (!state.base || busy) return;
    busy = true;
    flash("", "", "");
    els.exNote.innerHTML = '<span class="t2ie-spin"></span> Rendering at full resolution...';
    try {
      const { blob, canvas } = await exportBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName(extFor(els.fmt.value));
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
      const kb = Math.max(1, Math.round(blob.size / 1024));
      flash("", "Saved " + canvas.width + " x " + canvas.height + " " + extFor(els.fmt.value).toUpperCase() + " (" + kb.toLocaleString() + " KB).", "ok");
    } catch (e) {
      flash("", (e && e.message) || "Export failed.", "bad");
    }
    busy = false;
  }

  async function copyOut() {
    if (!state.base || busy) return;
    busy = true;
    els.exNote.innerHTML = '<span class="t2ie-spin"></span> Copying...';
    try {
      const { blob } = await exportBlob();
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      flash("", "Copied to your clipboard.", "ok");
    } catch (e) {
      flash("", "Your browser blocked the clipboard - try downloading instead.", "bad");
    }
    busy = false;
  }

  async function saveToGallery() {
    if (!state.base || busy || !hasGallery()) return;
    busy = true;
    els.exNote.innerHTML = '<span class="t2ie-spin"></span> Saving to your private gallery...';
    try {
      const { blob } = await exportBlob();
      await window.t2i_privateGallery.add(blob, { info: { prompt: "edited: " + (state.name || "image") } });
      flash("", "Added to your private gallery (Ctrl+Shift+G opens it).", "ok");
    } catch (e) {
      flash("", "Could not save to the gallery.", "bad");
    }
    busy = false;
  }

  function switchTab(name) {
    modal.querySelectorAll(".t2ie-tab[data-tab]").forEach((b) => b.classList.toggle("on", b.dataset.tab === name));
    modal.querySelectorAll(".t2ie-pane").forEach((p) => (p.hidden = p.dataset.pane !== name));
    if (name === "filters") renderPresetThumbs();
    if (name === "transform") syncSizeInputs();
  }

  function openPicker() {
    els.picker.hidden = false;
    if (!els.pkGrid.childElementCount) loadMyImages();
  }

  async function loadMyImages() {
    els.pkNote.className = "t2ie-note";
    els.pkNote.textContent = "";
    els.pkBar.hidden = true;
    els.pkGrid.innerHTML = "";
    const here = [];
    document.querySelectorAll(".t2i-image-ctn iframe").forEach((f) => {
      const out = f.textToImagePluginOutput;
      if (out && out.dataUrl) here.push({ kind: "page", src: out.dataUrl, label: "this page" });
    });
    addSection("Generated on this page", here);
    await loadGalleryItems();
    if (!els.pkGrid.querySelector(".t2ie-pk-item")) {
      els.pkNote.textContent =
        "No images here yet. Switch to the Upload tab to open an image from your device, or paste one with Ctrl+V.";
    }
  }

  function addSection(title, items) {
    if (!items.length) return;
    const h = document.createElement("div");
    h.className = "t2ie-pk-section";
    h.textContent = title;
    els.pkGrid.appendChild(h);
    items.forEach((it) => els.pkGrid.appendChild(pickerItem(it)));
  }

  function pickerItem(it) {
    const b = document.createElement("button");
    b.className = "t2ie-pk-item";
    b.type = "button";
    b.dataset.label = it.label || "";
    const im = document.createElement("img");
    im.alt = "";
    im.src = it.thumb || it.src;
    b.appendChild(im);
    b.addEventListener("click", () => pick(it));
    return b;
  }

  async function pick(it) {
    if (busy) return;
    busy = true;
    els.pkNote.className = "t2ie-note";
    els.pkNote.innerHTML = '<span class="t2ie-spin"></span> Opening image...';
    try {
      let src = it.src;
      let revoke = null;
      if (!src) {
        const rec = await root.kv[GAL_PREFIX + "blobs"].get(it.id);
        const buf = rec && (rec.buffer || (rec.blob && (await rec.blob.arrayBuffer())));
        if (!buf) throw new Error("That image could not be read from your browser storage.");
        const type = rec.type || (rec.blob && rec.blob.type) || "image/png";
        revoke = URL.createObjectURL(new Blob([buf], { type }));
        src = revoke;
      }
      const img = await loadImg(src);
      if (revoke) setTimeout(() => URL.revokeObjectURL(revoke), 1500);
      setBase(img, it.label === "this page" ? "generated image" : "gallery image");
      els.pkNote.textContent = "";
    } catch (e) {
      els.pkNote.className = "t2ie-note bad";
      els.pkNote.textContent = (e && e.message) || "Could not open that image.";
    }
    busy = false;
  }

  async function loadGalleryItems() {
    if (!hasGallery()) return;
    let names = ["general"];
    try {
      names = JSON.parse(localStorage.getItem(GAL_PREFIX + "names") || '["general"]');
    } catch (e) {}
    let metas = [];
    for (const g of names) {
      try {
        const es = await root.kv[GAL_PREFIX + g].entries();
        for (const [id, m] of es) metas.push({ id, g, date: (m && m.date) || 0 });
      } catch (e) {}
    }
    metas.sort((a, b) => b.date - a.date);
    metas = metas.slice(0, MAX_GALLERY_THUMBS);
    if (!metas.length) return;
    const h = document.createElement("div");
    h.className = "t2ie-pk-section";
    h.textContent = "Saved to your private gallery";
    els.pkGrid.appendChild(h);
    els.pkBar.hidden = false;
    const fill = els.pkBar.querySelector("i");
    let added = 0;
    for (let i = 0; i < metas.length; i++) {
      fill.style.width = Math.round(((i + 1) / metas.length) * 100) + "%";
      try {
        const rec = await root.kv[GAL_PREFIX + "blobs"].get(metas[i].id);
        const buf = rec && (rec.buffer || (rec.blob && (await rec.blob.arrayBuffer())));
        if (!buf) continue;
        const type = rec.type || (rec.blob && rec.blob.type) || "image/png";
        const url = URL.createObjectURL(new Blob([buf], { type }));
        const thumb = await makeThumb(url);
        URL.revokeObjectURL(url);
        els.pkGrid.appendChild(pickerItem({ kind: "gal", id: metas[i].id, g: metas[i].g, label: "saved", thumb }));
        added++;
      } catch (e) {}
      if (i % 4 === 3) await new Promise((r) => setTimeout(r, 0));
    }
    els.pkBar.hidden = true;
    if (!added) h.remove();
  }

  async function makeThumb(src) {
    const img = await loadImg(src);
    const size = 220;
    const c = newCanvas(size, size);
    const ctx = c.getContext("2d");
    const s = Math.max(size / img.width, size / img.height);
    ctx.drawImage(img, (size - img.width * s) / 2, (size - img.height * s) / 2, img.width * s, img.height * s);
    try {
      return c.toDataURL("image/jpeg", 0.75);
    } catch (e) {
      return c.toDataURL();
    }
  }

  function openWith(loader, label) {
    buildModal();
    modal.hidden = false;
    document.documentElement.style.overflow = "hidden";
    soon(() => {
      if (loader) {
        loader()
          .then((img) => {
            if (img) setBase(img, label || "generated image");
          })
          .catch(() => {
            els.picker.hidden = false;
            loadMyImages();
          });
      } else if (state.base) {
        fitPreview();
      } else {
        openPicker();
      }
    });
  }

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    els.picker.hidden = true;
    document.documentElement.style.overflow = "";
  }

  function rectFromDrag(hh, c0, dx, dy) {
    const MIN = 0.04;
    if (!state.aspect) {
      let l = c0.x;
      let t = c0.y;
      let r = c0.x + c0.w;
      let b = c0.y + c0.h;
      if (hh.indexOf("w") !== -1) l = clamp(c0.x + dx, 0, r - MIN);
      if (hh.indexOf("e") !== -1) r = clamp(c0.x + c0.w + dx, l + MIN, 1);
      if (hh.indexOf("n") !== -1) t = clamp(c0.y + dy, 0, b - MIN);
      if (hh.indexOf("s") !== -1) b = clamp(c0.y + c0.h + dy, t + MIN, 1);
      return { x: l, y: t, w: r - l, h: b - t };
    }
    const W = state.base.width;
    const H = state.base.height;
    const R = state.aspect;
    const west = hh.indexOf("w") !== -1;
    const north = hh.indexOf("n") !== -1;
    const horiz = west || hh.indexOf("e") !== -1;
    const ax = west ? c0.x + c0.w : c0.x;
    const ay = north ? c0.y + c0.h : c0.y;
    let wpx;
    let hpx;
    if (horiz) {
      const edge = west ? ax - (c0.x + dx) : c0.x + c0.w + dx - ax;
      wpx = clamp(edge * W, MIN * W, W);
      hpx = wpx / R;
    } else {
      const edge = north ? ay - (c0.y + dy) : c0.y + c0.h + dy - ay;
      hpx = clamp(edge * H, MIN * H, H);
      wpx = hpx * R;
    }
    const availW = (west ? ax : 1 - ax) * W;
    const availH = (north ? ay : 1 - ay) * H;
    if (wpx > availW) {
      wpx = availW;
      hpx = wpx / R;
    }
    if (hpx > availH) {
      hpx = availH;
      wpx = hpx * R;
    }
    const w = wpx / W;
    const h = hpx / H;
    return { x: west ? ax - w : ax, y: north ? ay - h : ay, w, h };
  }

  function wire() {
    modal.addEventListener("click", (e) => {
      const tab = e.target.closest(".t2ie-tab[data-tab]");
      if (tab) return switchTab(tab.dataset.tab);
      const pk = e.target.closest(".t2ie-tab[data-pk]");
      if (pk) {
        modal.querySelectorAll(".t2ie-tab[data-pk]").forEach((b) => b.classList.toggle("on", b === pk));
        modal.querySelectorAll("[data-pk-pane]").forEach((p) => (p.hidden = p.dataset.pkPane !== pk.dataset.pk));
        if (pk.dataset.pk === "mine" && !els.pkGrid.childElementCount) loadMyImages();
        return;
      }
      const chip = e.target.closest(".t2ie-chip[data-aspect]");
      if (chip) {
        state.aspect = Number(chip.dataset.r) || 0;
        els.aspects.querySelectorAll(".t2ie-chip").forEach((c) => c.classList.toggle("on", c === chip));
        if (state.aspect && !els.crop.hidden) {
          applyAspectToCrop();
          layoutCrop();
        }
        return;
      }
      const pre = e.target.closest(".t2ie-filt[data-preset]");
      if (pre) {
        const p = PRESETS[Number(pre.dataset.preset)];
        state.adj = Object.assign({}, DEFAULTS, p.adj);
        state.preset = p.name;
        syncSliders();
        schedulePreview();
        pushHistory();
        markPreset();
        return;
      }
      const act = e.target.closest("[data-act]");
      if (!act) {
        if (e.target === modal) closeModal();
        return;
      }
      const a = act.dataset.act;
      if (a === "close") return closeModal();
      if (a === "pkclose") return (els.picker.hidden = true);
      if (a === "undo") return undo();
      if (a === "redo") return redo();
      if (a === "reset") return resetAll();
      if (a === "rotl") return rotate(-1);
      if (a === "rotr") return rotate(1);
      if (a === "fliph") return flip("h");
      if (a === "flipv") return flip("v");
      if (a === "croptoggle") return setCropMode(els.crop.hidden);
      if (a === "cropapply") return applyCrop();
      if (a === "resize") return applyResize();
      if (a === "lock") {
        state.lock = !state.lock;
        els.lock.classList.toggle("gold", state.lock);
        els.lock.innerHTML = (state.lock ? ICON.lock : ICON.unlock) + "<span>" + (state.lock ? "locked" : "free") + "</span>";
        return;
      }
      if (a === "scale") {
        const f = Number(act.dataset.v) / 100;
        if (!state.base) return;
        const w = clamp(Math.round(state.base.width * f), 1, 8000);
        const h = clamp(Math.round(state.base.height * f), 1, 8000);
        return scaleTo(w, h, "Resized to " + w + " x " + h + " px.");
      }
      if (a === "download") return download();
      if (a === "copy") return copyOut();
      if (a === "savegal") return saveToGallery();
      if (a === "picker") return openPicker();
    });

    document.addEventListener("keydown", (e) => {
      if (!modal || modal.hidden) return;
      if (e.key !== "Escape" && e.key !== "Esc") return;
      if (!els.picker.hidden) els.picker.hidden = true;
      else closeModal();
    });

    els.fmt.addEventListener("change", syncFormatUi);
    els.q.addEventListener("input", () => (els.qv.textContent = els.q.value + "%"));
    els.w.addEventListener("input", () => {
      if (!state.lock || !state.base) return;
      const w = Number(els.w.value) || 0;
      if (w > 0) els.h.value = Math.max(1, Math.round((w / state.base.width) * state.base.height));
    });
    els.h.addEventListener("input", () => {
      if (!state.lock || !state.base) return;
      const h = Number(els.h.value) || 0;
      if (h > 0) els.w.value = Math.max(1, Math.round((h / state.base.height) * state.base.width));
    });

    els.file.addEventListener("change", () => {
      if (els.file.files && els.file.files[0]) loadFile(els.file.files[0]);
    });
    ["dragenter", "dragover"].forEach((ev) =>
      els.drop.addEventListener(ev, (e) => {
        e.preventDefault();
        els.drop.classList.add("hot");
      })
    );
    ["dragleave", "drop"].forEach((ev) =>
      els.drop.addEventListener(ev, (e) => {
        e.preventDefault();
        els.drop.classList.remove("hot");
      })
    );
    els.drop.addEventListener("drop", (e) => {
      const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (f && /^image\//.test(f.type)) loadFile(f);
    });

    window.addEventListener("paste", (e) => {
      if (!modal || modal.hidden || !e.clipboardData) return;
      for (const it of e.clipboardData.items) {
        if (it.type && it.type.indexOf("image") === 0) {
          const f = it.getAsFile();
          if (f) {
            loadFile(f);
            e.preventDefault();
          }
          return;
        }
      }
    });

    window.addEventListener("resize", () => {
      if (modal && !modal.hidden && state.base) fitPreview();
    });
    if (window.ResizeObserver) {
      new ResizeObserver(() => {
        if (modal && !modal.hidden && state.base && !drag) fitPreview();
      }).observe(els.stage);
    }

    const cv = els.canvas;
    const ptr = (e) => {
      const r = cv.getBoundingClientRect();
      return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
    };
    els.cropBox.addEventListener("pointerdown", (e) => {
      const h = (e.target.dataset && e.target.dataset.h) || "";
      drag = { mode: h ? "resize" : "move", h, start: ptr(e), c0: Object.assign({}, state.crop) };
      try {
        els.cropBox.setPointerCapture(e.pointerId);
      } catch (err) {}
      e.preventDefault();
      e.stopPropagation();
    });
    window.addEventListener("pointermove", (e) => {
      if (!drag || !state.base) return;
      const p = ptr(e);
      const dx = p.x - drag.start.x;
      const dy = p.y - drag.start.y;
      const c0 = drag.c0;
      if (drag.mode === "move") {
        state.crop = { x: clamp(c0.x + dx, 0, 1 - c0.w), y: clamp(c0.y + dy, 0, 1 - c0.h), w: c0.w, h: c0.h };
      } else {
        state.crop = rectFromDrag(drag.h, c0, dx, dy);
      }
      layoutCrop();
      e.preventDefault();
    });
    window.addEventListener("pointerup", () => {
      drag = null;
    });
  }

  function resetAll() {
    if (!state.base) return;
    if (state.hist.length) state.base = cloneCanvas(state.hist[0].base);
    state.adj = Object.assign({}, DEFAULTS);
    state.preset = "Original";
    state.crop = { x: 0, y: 0, w: 1, h: 1 };
    state.aspect = 0;
    if (els.aspects) els.aspects.querySelectorAll(".t2ie-chip").forEach((b, i) => b.classList.toggle("on", i === 0));
    setCropMode(false);
    syncSliders();
    syncSizeInputs();
    markPreset();
    fitPreview();
    scheduleThumbs();
    pushHistory();
    flash("", "Back to the original image.", "ok");
  }

  async function loadFile(file) {
    if (!/^image\//.test(file.type) && !/\.(png|jpe?g|webp|gif|bmp|avif)$/i.test(file.name || "")) {
      flash("", "That file is not an image.", "bad");
      return;
    }
    busy = true;
    els.pkNote.className = "t2ie-note";
    els.pkNote.innerHTML = '<span class="t2ie-spin"></span> Opening ' + (file.name || "image") + "...";
    try {
      const url = URL.createObjectURL(file);
      const img = await loadImg(url);
      setBase(img, (file.name || "image").replace(/\.[a-z0-9]+$/i, ""));
      setTimeout(() => URL.revokeObjectURL(url), 2500);
    } catch (e) {
      els.pkNote.className = "t2ie-note bad";
      els.pkNote.textContent = "That image could not be opened.";
    }
    busy = false;
  }

  function imageFromCtn(ctn) {
    const f = ctn.querySelector("iframe");
    const out = f && f.textToImagePluginOutput;
    if (!out || !out.dataUrl) return Promise.reject(new Error("no image"));
    return loadImg(out.dataUrl);
  }

  let openBtnTries = 0;
  let injectQueued = false;
  function injectOpeners() {
    injectCss();
    const gen = document.getElementById("generateButtonEl");
    if (gen && !document.getElementById("t2ieOpenBtn")) {
      const b = document.createElement("button");
      b.id = "t2ieOpenBtn";
      b.type = "button";
      b.title = "Crop, filter, retouch and export an image you already have";
      b.innerHTML = ICON.edit + "<span>edit image</span>";
      b.addEventListener("click", () => openWith(null));
      gen.insertAdjacentElement("afterend", b);
    } else if (!gen && openBtnTries < 80) {
      openBtnTries++;
      setTimeout(injectOpeners, 400);
    }
    document.querySelectorAll(".t2i-image-ctn").forEach((ctn) => {
      const under = ctn.querySelector(".t2i-under-each-image-ctn");
      if (under && !under.querySelector(".t2ie-edit-btn")) {
        const b = document.createElement("button");
        b.className = "t2ie-edit-btn";
        b.type = "button";
        b.title = "Edit this image";
        b.innerHTML = ICON.edit + "<span>edit</span>";
        b.addEventListener("click", () => openWith(() => imageFromCtn(ctn)));
        under.appendChild(b);
      }
    });
  }

  function queueInject() {
    if (injectQueued) return;
    injectQueued = true;
    setTimeout(() => {
      injectQueued = false;
      injectOpeners();
    }, 60);
  }

  function hookImageMenu() {
    if (typeof window.t2i_toggleImageMenu !== "function") return setTimeout(hookImageMenu, 300);
    if (window.t2i_toggleImageMenu.__t2ieWrapped) return;
    const orig = window.t2i_toggleImageMenu;
    const wrapped = function (btn, ctn) {
      const existed = !!ctn.querySelector(".t2i-image-menu");
      const out = orig.apply(this, arguments);
      if (!existed) {
        const menu = ctn.querySelector(".t2i-image-menu");
        if (menu && !menu.querySelector(".t2ie-menu-edit")) {
          const b = document.createElement("button");
          b.className = "t2ie-menu-edit";
          b.type = "button";
          b.innerHTML = ICON.edit + "<span>edit image</span>";
          b.addEventListener("click", () => {
            menu.remove();
            openWith(() => imageFromCtn(ctn));
          });
          menu.insertBefore(b, menu.firstChild);
        }
      }
      return out;
    };
    wrapped.__t2ieWrapped = true;
    window.t2i_toggleImageMenu = wrapped;
  }

  function boot() {
    injectCss();
    const host = document.querySelector("[data-t2ie-open]");
    if (host) host.addEventListener("click", () => openWith(null));
  }

  window.t2iEditor = {
    open: (loader) => openWith(loader || null),
    close: closeModal,
    loadFile,
    loadSrc: (src, name) => loadImg(src).then((i) => setBase(i, name || "image")),
    state,
    render: renderPreview,
    fit: fitPreview,
    exportCanvas,
    exportBlob,
    picker: openPicker,
    _els: () => els,
    _modal: () => modal,
  };

  if (document.body) boot();
  else document.addEventListener("DOMContentLoaded", boot);
})();

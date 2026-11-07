// Reads the actual pixels of a drawing, so everything it reports is measured, not guessed.
// The paper border / white margin is detected and ignored, so only the drawing itself counts.
export function analyzeImage(src, maxW = 640) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onerror = reject;
    img.onload = () => {
      const scale = Math.min(1, maxW / img.naturalWidth);
      const w = Math.max(2, Math.round(img.naturalWidth * scale));
      const h = Math.max(2, Math.round(img.naturalHeight * scale));
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, w, h);
      const { data } = ctx.getImageData(0, 0, w, h);

      const N = w * h;
      const lum = new Float32Array(N);
      for (let i = 0; i < N; i++) {
        lum[i] = (0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2]) / 255;
      }

      // ── 1. Find the border: bright pixels connected to the image edge (flood fill) ──
      const BRIGHT = 0.55;
      const border = new Uint8Array(N);
      const stack = new Int32Array(N);
      let sp = 0;
      const seed = (i) => {
        if (!border[i] && lum[i] > BRIGHT) {
          border[i] = 1;
          stack[sp++] = i;
        }
      };
      for (let x = 0; x < w; x++) { seed(x); seed((h - 1) * w + x); }
      for (let y = 0; y < h; y++) { seed(y * w); seed(y * w + w - 1); }
      while (sp > 0) {
        const i = stack[--sp];
        const x = i % w;
        if (x > 0) seed(i - 1);
        if (x < w - 1) seed(i + 1);
        if (i >= w) seed(i - w);
        if (i < N - w) seed(i + w);
      }

      let borderCount = 0;
      for (let i = 0; i < N; i++) borderCount += border[i];
      // If the "border" swallowed most of the sheet, this is a light drawing: don't trust the mask
      const useMask = borderCount / N < 0.55;

      // ── 2. Grow the mask a few px (anti-aliased edge of the paper) + a hard outer margin ──
      let valid = new Uint8Array(N).fill(1);
      if (useMask) {
        const r = Math.max(4, Math.round(w * 0.014));
        let a = border;
        // separable dilation
        const tmp = new Uint8Array(N);
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            let hit = 0;
            for (let k = -r; k <= r && !hit; k++) {
              const xx = x + k;
              if (xx >= 0 && xx < w && a[y * w + xx]) hit = 1;
            }
            tmp[y * w + x] = hit;
          }
        }
        const grown = new Uint8Array(N);
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            let hit = 0;
            for (let k = -r; k <= r && !hit; k++) {
              const yy = y + k;
              if (yy >= 0 && yy < h && tmp[yy * w + x]) hit = 1;
            }
            grown[y * w + x] = hit;
          }
        }
        for (let i = 0; i < N; i++) valid[i] = grown[i] ? 0 : 1;
      }
      const m = Math.round(Math.min(w, h) * 0.03);
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          if (x < m || y < m || x >= w - m || y >= h - m) valid[y * w + x] = 0;
        }
      }

      // ── 3. Tonal histogram + dark share, drawing area only ──
      const BINS = 24;
      const hist = new Array(BINS).fill(0);
      let dark = 0;
      let count = 0;
      for (let i = 0; i < N; i++) {
        if (!valid[i]) continue;
        count++;
        hist[Math.min(BINS - 1, Math.floor(lum[i] * BINS))]++;
        if (lum[i] < 0.25) dark++;
      }

      // ── 4. Sobel edge map, drawing area only ──
      const out = ctx.createImageData(w, h);
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const i = y * w + x;
          if (!valid[i]) continue;
          const gx =
            -lum[i - w - 1] - 2 * lum[i - 1] - lum[i + w - 1] +
            lum[i - w + 1] + 2 * lum[i + 1] + lum[i + w + 1];
          const gy =
            -lum[i - w - 1] - 2 * lum[i - w] - lum[i - w + 1] +
            lum[i + w - 1] + 2 * lum[i + w] + lum[i + w + 1];
          const mag = Math.sqrt(gx * gx + gy * gy);
          const v = Math.max(0, Math.min(1, (mag - 0.1) * 3.2));
          const o = i * 4;
          out.data[o] = out.data[o + 1] = out.data[o + 2] = 255;
          out.data[o + 3] = v * 255;
        }
      }
      const oc = document.createElement('canvas');
      oc.width = w;
      oc.height = h;
      oc.getContext('2d').putImageData(out, 0, 0);

      // ── 5. Brightest area inside the drawing: cells that are fully valid ──
      const cell = Math.max(8, Math.round(w / 48));
      let best = { v: -1, x: 0.5, y: 0.5 };
      for (let cy = 0; cy + cell <= h; cy += cell) {
        for (let cx = 0; cx + cell <= w; cx += cell) {
          let sum = 0;
          let ok = true;
          for (let yy = 0; yy < cell && ok; yy++) {
            for (let xx = 0; xx < cell; xx++) {
              const i = (cy + yy) * w + cx + xx;
              if (!valid[i]) { ok = false; break; }
              sum += lum[i];
            }
          }
          if (!ok) continue;
          const mean = sum / (cell * cell);
          if (mean > best.v) best = { v: mean, x: (cx + cell / 2) / w, y: (cy + cell / 2) / h };
        }
      }

      const max = Math.max(1, ...hist);
      resolve({
        edgeUrl: oc.toDataURL('image/png'),
        hist: hist.map((n) => n / max),
        darkPct: count ? Math.round((dark / count) * 100) : 0,
        bright: { x: best.x * 100, y: best.y * 100 },
      });
    };
    img.src = src;
  });
}
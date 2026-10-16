/**
 * Margam: five converging pathways of shared life interests meeting at the
 * central heart pin summit on an isometric plinth. The pointer explores the
 * terrain, drawing paths upwards with spring physics towards the peak.
 */
const {
  Cam, clamp, facing, fit, prism, proj, rings, unproj, spring, stepS,
  mk, pointer, put, register, disposer, solid,
} = HL;

const N = 7, CELL = 18, FOOT = 14, HMAX = 48, EXT = N * CELL, PB = 6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.55);
  fit(C, [[-8, -8, -PB], [EXT + 8, EXT + 8, -PB], [EXT + 8, -8, -PB], [-8, EXT + 8, -PB], [0, 0, HMAX * 0.85]], 200, 160);
  const P = proj(C), front = facing(C);
  let R = value * CELL, over = null;

  const g = mk("g", {}, svg), cols = [];
  const [pr, pi] = rings(-8, -8, EXT + 8, EXT + 8, 10, 2.0);
  put(solid(g), prism(P, front, pr, pi, -PB, 0));

  // 7x7 grid of converging waypoints
  for (let s = 0; s <= 2 * (N - 1); s++) for (let i = 0; i < N; i++) {
    const j = s - i;
    if (j < 0 || j >= N) continue;
    const u = i / (N - 1), v = j / (N - 1);
    // Central peak elevation with converging diagonal ridges
    const dCenter = Math.hypot(u - 0.5, v - 0.5);
    const h0 = 4 + 32 * Math.exp(-(dCenter ** 2) / 0.08) + 10 * Math.exp(-((u - v) ** 2) / 0.03);
    const x0 = i * CELL + (CELL - FOOT) / 2, y0 = j * CELL + (CELL - FOOT) / 2;
    const [ring, inner] = rings(x0, y0, x0 + FOOT, y0 + FOOT, 3.0, 1.0);
    cols.push({ i, j, h0, ring, inner, sp: spring(h0, { eps: 0.04 }), el: solid(g), drawn: NaN });
  }

  const peak = cols.reduce((a, b) => (b.h0 > a.h0 ? b : a));
  let mc = peak;

  function drawCol(c) {
    const h = Math.max(0.6, c.sp.x);
    if (h === c.drawn) return;
    c.drawn = h;
    put(c.el, prism(P, front, c.ring, c.inner, 0, h));
    c.el.sil.classList.toggle("hi", h > HMAX * 0.55 || c === mc);
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const c of cols) {
      if (stepS(c.sp, dt)) m = true;
      drawCol(c);
    }
    return m;
  });
  bag.add(B.unregister);

  function retarget() {
    for (const c of cols) {
      if (!over) {
        c.sp.t = c.h0;
        continue;
      }
      const dx = (c.i + 0.5) * CELL - over[0], dy = (c.j + 0.5) * CELL - over[1];
      const dist = Math.hypot(dx, dy);
      const infl = Math.max(0, 1 - dist / (R * 1.5));
      c.sp.t = c.h0 + HMAX * 0.45 * (infl ** 2);
    }
    if (over) {
      const ci = clamp(Math.floor(over[0] / CELL), 0, N - 1);
      const cj = clamp(Math.floor(over[1] / CELL), 0, N - 1);
      mc = cols.find((col) => col.i === ci && col.j === cj) || peak;
      read.textContent = ci === 3 && cj === 3 ? "heart pin summit" : `margam waypoint ${ci}·${cj}`;
    } else {
      mc = peak;
      read.textContent = "converged at heart pin";
    }
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      over = unproj(C, p[0], p[1], 0);
      retarget();
    },
    leave: () => {
      over = null;
      retarget();
    },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => {
      R = v * CELL;
      if (over) retarget();
    },
    destroy: bag.dispose,
  };
}

hairline({
  name: "margam",
  means: "Converging pathways of shared life interests meeting at the Margam heart pin.",
  rules: [1, 4, 9],
  range: [1.2, 2.2, 3.8],
  tour: [[120, 190], [280, 190], [200, 130], null],
  mount,
});

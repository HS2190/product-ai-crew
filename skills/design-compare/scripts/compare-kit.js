// compare-kit — 시안 비교판 · 보관 공통 코드. scripts/figma-kit.js 바로 아래에 붙여 넣고 씀 (T · AL · solid · KIT · loadFonts · rightOf 필요).

// 페이지 바로 아래 최상위 노드 (섹션 · 프레임)
function topOf(node) { let n = node; while (n.parent && n.parent.type !== 'PAGE') n = n.parent; return n; }
// 기준 노드가 든 최상위 섹션 아래 빈 자리 — 같은 x 범위에 걸친 노드들 중 가장 아래 + gap
function spotBelow(anchor, gap = 400) {
  const top = topOf(anchor), page = top.parent, x0 = top.x, x1 = top.x + top.width;
  const bottoms = page.children.filter(n => n.visible !== false && n.x < x1 && n.x + n.width > x0).map(n => n.y + n.height);
  return { x: x0, y: Math.max(...bottoms) + gap };
}
// 섹션 크기를 안의 내용에 맞춤 (여백 pad)
function fitSection(sec, pad = 120) {
  const kids = sec.children.filter(n => n.visible !== false);
  if (!kids.length) return sec;
  const r = Math.max(...kids.map(n => n.x + n.width)), b = Math.max(...kids.map(n => n.y + n.height));
  sec.resizeWithoutConstraints(r + pad, b + pad);
  return sec;
}

// ── 비교판 ───────────────────────────────────────────────
// compareBoard(기준 노드, { title, basis, options: [{ name, screens, note, pros, cons, recommended, current }], at })
// - 섹션 '[title] — 시안 비교'를 기준 노드가 든 섹션 아래에 만들고, 안마다 열 하나: 안 이름(+ 추천) · 한 줄 설명 · 화면 복제 · 좋은 점 · 아쉬운 점
// - current: true = '지금' 기준안 (좋은 점 · 아쉬운 점 대신 note만)
// - 반환 columns[i].screens = 복제본 → 이걸 고쳐서 안을 만듦. 다 고친 뒤 fitBoard(section) 호출
async function compareBoard(anchor, { title, basis = '', options, at }) {
  await loadFonts();
  const page = topOf(anchor).parent;
  const sec = figma.createSection(); page.appendChild(sec); sec.name = `${title} — 시안 비교`;
  const board = AL(sec, 'VERTICAL', { name: 'Board', gap: 64, pad: [120, 120, 120, 120] });
  const head = AL(board, 'VERTICAL', { name: 'Head', gap: 12 });
  T(head, `${title} — 시안 비교`, { style: 'Bold', size: 40, color: KIT.ink, name: 'Title' });
  if (basis) T(head, basis, { size: 20, color: KIT.body, width: 1200, lh: 150, name: 'Basis' });
  const row = AL(board, 'HORIZONTAL', { name: 'Options', gap: 160 });
  const columns = [];
  for (const o of options) {
    const col = AL(row, 'VERTICAL', { name: `안 · ${o.name}`, gap: 24 });
    const h = AL(col, 'HORIZONTAL', { name: 'Option Head', gap: 12, align: 'CENTER' });
    T(h, o.name, { style: 'Bold', size: 28, color: KIT.ink, name: 'Option Name' });
    if (o.recommended) T(h, '추천', { style: 'SemiBold', size: 20, color: KIT.blue, name: 'Recommended' });
    const screensRow = AL(col, 'HORIZONTAL', { name: 'Screens', gap: 40 });
    const clones = (o.screens || []).map(s => { const c = s.clone(); screensRow.appendChild(c); return c; });
    const w = Math.max(400, screensRow.width);
    if (o.note) { const t = T(null, o.note, { size: 18, color: KIT.body, width: w, lh: 150, name: 'Note' }); col.insertChild(1, t); }
    if (!o.current) {
      for (const [label, items] of [['좋은 점', o.pros], ['아쉬운 점', o.cons]]) {
        if (!items || !items.length) continue;
        const box = AL(col, 'VERTICAL', { name: label, gap: 8 });
        T(box, label, { style: 'SemiBold', size: 18, color: KIT.ink });
        T(box, items.map(s => `· ${s}`).join('\n'), { size: 18, color: KIT.body, width: w, lh: 160 });
      }
    }
    columns.push({ name: o.name, column: col, screens: clones });
  }
  board.x = 0; board.y = 0; fitSection(sec, 0);
  const p = at || spotBelow(anchor); sec.x = p.x; sec.y = p.y;
  return { section: sec, columns };
}
// 복제본을 고친 뒤 설명 줄 폭 · 섹션 크기 다시 맞춤
function fitBoard(sec) {
  const board = sec.children.find(n => n.name === 'Board');
  for (const col of board.findAll(n => n.name.startsWith('안 · '))) {
    const sr = col.children.find(n => n.name === 'Screens'), w = Math.max(400, sr.width);
    for (const t of col.findAll(n => n.type === 'TEXT' && n.textAutoResize === 'HEIGHT')) t.resize(w, t.height);
  }
  return fitSection(sec, 0);
}

// ── 보관 ────────────────────────────────────────────────
// 방향을 바꿀 때 이전 안을 지우지 않고 페이지 맨 아래 보관 섹션으로 옮김. 보관 섹션은 흐름 · 개발 전달에서 빠짐
function archiveSection(page, name = '보관') {
  let s = page.children.find(n => n.type === 'SECTION' && n.name === name);
  if (!s) {
    const others = page.children.filter(n => n.visible !== false);
    s = figma.createSection(); page.appendChild(s); s.name = name;
    s.x = others.length ? Math.min(...others.map(n => n.x)) : 0;
    s.y = others.length ? Math.max(...others.map(n => n.y + n.height)) + 1000 : 0;
    s.resizeWithoutConstraints(1000, 1000);
  }
  return s;
}
// toArchive(노드 목록, { page, name }) — 보관 섹션 안 오른쪽 끝에 이어 붙이고 섹션 크기 맞춤
function toArchive(nodes, { page, name = '보관' } = {}) {
  const s = archiveSection(page || topOf(nodes[0]).parent, name);
  for (const n of nodes) {
    const x = s.children.length ? rightOf(s, 200) : 120;
    s.appendChild(n); n.x = x; n.y = 120;
  }
  return fitSection(s);
}

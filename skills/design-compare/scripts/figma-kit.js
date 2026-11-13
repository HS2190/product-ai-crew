// figma-kit — Figma 그리기 공통 코드. use_figma code 맨 위에 그대로 붙여 넣고 아래 함수만 씀.
// 매번 텍스트 · 오토레이아웃 · 화살표 · 주석을 새로 짜지 않게 하는 묶음 (모양 · 굵기 · 색이 세션마다 달라지지 않게).

// ── 색 · 글꼴 ─────────────────────────────────────────────
const rgb = h => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
const solid = (h, opacity = 1) => [{ type: 'SOLID', color: rgb(h), opacity }];
const KIT = { font: 'Pretendard', ink: '#000000', body: '#555555', blue: '#295CDC', red: '#E03131', line: '#E5E5E5' };
async function loadFonts(styles = ['Regular', 'Medium', 'SemiBold', 'Bold'], family = KIT.font) {
  for (const style of styles) await figma.loadFontAsync({ family, style });
}
// 기존 텍스트를 고치기 전: 그 텍스트가 쓰는 글꼴 전부 불러오기
async function loadTextFonts(t) {
  const names = t.fontName === figma.mixed ? t.getStyledTextSegments(['fontName']).map(s => s.fontName) : [t.fontName];
  for (const f of names) await figma.loadFontAsync(f);
}

// ── 만들기 ───────────────────────────────────────────────
// T(부모, '문구', { style, size, color, lh, width, name }) — width를 주면 줄바꿈 상자(HEIGHT 자동)
function T(parent, chars, o = {}) {
  const t = figma.createText();
  t.fontName = { family: o.family || KIT.font, style: o.style || 'Regular' };
  t.characters = chars; t.fontSize = o.size || 15; t.fills = solid(o.color || KIT.body);
  if (o.lh) t.lineHeight = { unit: 'PERCENT', value: o.lh };
  if (o.name) t.name = o.name;
  if (parent) parent.appendChild(t);
  if (o.width === 'fill') { t.layoutSizingHorizontal = 'FILL'; t.textAutoResize = 'HEIGHT'; }
  else if (o.width) { t.resize(o.width, t.height); t.textAutoResize = 'HEIGHT'; }
  return t;
}
// AL(부모, 'VERTICAL'|'HORIZONTAL', { name, gap, pad:[t,r,b,l], fill, radius, align }) — 내용에 맞춰 늘어나는 틀
function AL(parent, dir, o = {}) {
  const f = figma.createAutoLayout(dir, { name: o.name || 'Group', itemSpacing: o.gap || 0 });
  f.fills = o.fill ? solid(o.fill) : [];
  if (o.pad) [f.paddingTop, f.paddingRight, f.paddingBottom, f.paddingLeft] = o.pad;
  if (o.radius) f.cornerRadius = o.radius;
  if (o.align) f.counterAxisAlignItems = o.align;
  if (parent) parent.appendChild(f);
  return f;
}
// 페이지 · 섹션 맨 오른쪽 빈 자리 (새 최상위 노드가 (0,0)에 겹치지 않게)
function rightOf(container, gap = 200) {
  const kids = container.children.filter(n => n.visible !== false);
  return kids.length ? Math.max(...kids.map(n => n.x + n.width)) + gap : 0;
}

// ── 플로우 화살표 (굵기 2.5 · 끝 화살촉 · 같은 색 고정) ──────────
// arrow(부모, 출발 노드, 도착 노드, { label, color }) — 출발 오른쪽 가운데 → 도착 왼쪽 가운데. 부모 기준 좌표.
async function arrow(parent, from, to, o = {}) {
  const pb = parent.absoluteTransform, a = from.absoluteBoundingBox, b = to.absoluteBoundingBox;
  const ox = pb[0][2], oy = pb[1][2];
  const x1 = a.x + a.width - ox, y1 = a.y + a.height / 2 - oy, x2 = b.x - ox, y2 = b.y + b.height / 2 - oy;
  const v = figma.createVector(); parent.appendChild(v); v.name = `Arrow ${from.name} → ${to.name}`;
  const mx = (x1 + x2) / 2;
  const pts = y1 === y2 ? [[x1, y1], [x2, y2]] : [[x1, y1], [mx, y1], [mx, y2], [x2, y2]];
  // 촉은 도착 쪽 끝에만
  await v.setVectorNetworkAsync({
    vertices: pts.map(([x, y], i) => ({ x, y, strokeCap: i === pts.length - 1 ? 'ARROW_LINES' : 'NONE' })),
    segments: pts.slice(1).map((_, i) => ({ start: i, end: i + 1 })),
  });
  v.strokes = solid(o.color || KIT.ink); v.strokeWeight = 2.5; v.strokeJoin = 'ROUND';
  if (o.label) { const t = T(parent, o.label, { style: 'Medium', size: 15, color: o.color || KIT.ink, name: 'Arrow Label' }); t.x = mx - t.width / 2; t.y = Math.min(y1, y2) - 30; }
  return v;
}

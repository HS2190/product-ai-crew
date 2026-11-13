const TARGET_IDS = ['__TARGET__']; // ← 점검할 섹션 · 프레임 id (여러 개 가능, 같은 페이지 안)
// figma-qa 점검 스크립트 — 읽기 전용. use_figma code로 그대로 넘김. 캔버스를 바꾸지 않음.
// 레이어 이름에 [qa-ok] 를 넣으면 그 레이어와 하위는 점검에서 뺌 (의도한 잘림 · 겹침).
const OPT = { max: 25, tol: 1, minOverlap: 2, textGrow: 3 };
const SCREEN_W = [320, 360, 375, 390, 393, 412, 428, 430, 768, 800, 820, 834, 1024, 1080, 1194, 1280, 1366, 1440, 1536, 1920];
const OKTAG = /\[qa-ok\]/i;
const RAW_NAME = /(button|btn|버튼|chip|칩|badge|배지|뱃지|toast|토스트|\btab\b|탭바|input|입력창|toggle|토글|checkbox|체크박스|radio|라디오|modal|dialog|다이얼로그|팝업|bottom ?sheet|바텀시트|header|헤더|gnb)/i;
const OLD_NAME = /(old|legacy|deprecated|구버전|이전|보관|backup|\bv1\b)/i;
const OLD_PAGE = /(원본|old|legacy|보관|archive|이전)/i;
const PLACEHOLDER = /(lorem|ipsum|placeholder|텍스트를 입력|텍스트 입력|TODO|TBD|xxx|○○○)/i;
const OVERLAY = /(popover|팝오버|dropdown|드롭다운|modal|모달|dialog|다이얼로그|팝업|sheet|시트|toast|토스트|menu|메뉴|overlay|오버레이|tooltip|툴팁|\bdim\b|딤|panel|패널|search results|검색 결과)/i; // 위에 덮이는 층 — 아래 내용과 겹쳐도 정상
const ANNOT = /(수정 표시|확인 필요|marker|마커|highlight|하이라이트|edit mark|confirm card|state label|legend row|dev check)/i; // 화면 위에 일부러 올린 표시 (핸드오프 주석 컴포넌트 포함)
const ARROW = /(-->|^Arrow|^Arrow Label$)/; // 플로우 화살표 · 라벨 — 화면 안 누르는 곳에서 시작하므로 화면과 겹침이 정상
const FLOW_HEAD = new Set(['Header', 'Title', 'Use case']); // 흐름 머리 띠 · Use case — 규격상 4px 겹침(y 172)

const targets = [];
for (const id of TARGET_IDS) { const t = await figma.getNodeByIdAsync(id); if (t) targets.push(t); }
if (!targets.length) return { error: '대상 노드를 찾지 못함', TARGET_IDS };
let page = targets[0];
while (page && page.type !== 'PAGE') page = page.parent;
await figma.setCurrentPageAsync(page);
// 글꼴 없음은 실제로 쓸 수 없는 글꼴일 때만 (원격 실행 · 다른 페이지 인스턴스에서 잘못 잡히는 경우 제외)
const availFonts = new Set((await figma.listAvailableFontsAsync()).map(f => `${f.fontName.family}|${f.fontName.style}`));
const reallyMissing = t => (t.fontName === figma.mixed ? t.getStyledTextSegments(['fontName']).map(s => s.fontName) : [t.fontName]).some(f => !availFonts.has(`${f.family}|${f.style}`));

const issues = {}, counts = {};
const add = (type, item) => { counts[type] = (counts[type] || 0) + 1; (issues[type] = issues[type] || []); if (issues[type].length < OPT.max) issues[type].push(item); };
const r = v => Math.round(v);
const label = n => (n.name.length > 40 ? n.name.slice(0, 40) + '…' : n.name);
const box = n => n.absoluteBoundingBox;
const rbox = n => (n.type === 'TEXT' ? n.absoluteRenderBounds || n.absoluteBoundingBox : n.absoluteBoundingBox);
const inter = (a, b) => { const w = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x); const h = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y); return w > 0 && h > 0 ? { w, h } : null; };
const contains = (a, b, t = 0) => b.x >= a.x - t && b.y >= a.y - t && b.x + b.width <= a.x + a.width + t && b.y + b.height <= a.y + a.height + t;
const sticksOut = (a, b) => Math.max(a.x - b.x, a.y - b.y, b.x + b.width - (a.x + a.width), b.y + b.height - (a.y + a.height));
const isScreen = n => (n.type === 'FRAME' || n.type === 'INSTANCE' || n.type === 'COMPONENT') && n.height >= 480 && SCREEN_W.some(w => Math.abs(n.width - w) < 1);
const hex = c => '#' + [c.r, c.g, c.b].map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
const shown = p => p.visible !== false && (p.opacity == null || p.opacity > 0);
const visiblePaints = ps => Array.isArray(ps) && ps.some(shown);
const hasSolid = n => 'fills' in n && Array.isArray(n.fills) && n.fills.some(p => p.type === 'SOLID' && shown(p));
const missingFont = [];

const stats = { nodes: 0, screens: 0, texts: 0, instances: 0 };
const fonts = {}, colors = {}, compSrc = {};
const screenTexts = new Map(), screenIcons = new Map(), screenInfo = new Map();
const instQueue = [], sections = [];

function walk(n, ctx) {
  if (n.visible === false) return;
  if ('opacity' in n && n.opacity === 0) return;
  if (OKTAG.test(n.name)) return;
  stats.nodes++;
  let screen = ctx.screen;
  if (!screen && isScreen(n)) {
    screen = n; stats.screens++;
    screenTexts.set(n.id, []); screenIcons.set(n.id, []); screenInfo.set(n.id, { name: n.name, inst: 0 });
  }
  const where = screen ? label(screen) : '주석 영역';
  const b = box(n);
  let clipReported = ctx.clipReported;
  // 겹침 비교 단위: 덮이는 층(팝오버 · 모달 · 패널 등 — 이름 규칙 또는 화면 바로 아래 그림자 있는 레이어)
  const floating = screen && n !== screen && !ctx.overlay && (OVERLAY.test(n.name) ||
    (n.parent === screen && 'effects' in n && n.effects.some(e => e.type === 'DROP_SHADOW' && e.visible !== false)));
  const overlay = floating ? n.id : ctx.overlay || null;
  const painted = n.type === 'TEXT' || ['VECTOR', 'BOOLEAN_OPERATION', 'STAR', 'LINE', 'POLYGON', 'ELLIPSE'].includes(n.type) ||
    visiblePaints('fills' in n ? n.fills : null) || visiblePaints('strokes' in n ? n.strokes : null);

  // 잘림: 가장 가까운 clip 부모 밖으로 나간, 눈에 보이는 요소 (빈 컨테이너는 건너뛰고 안쪽을 봄)
  // 잘라내는 틀이 여러 겹이면 전부 기준 — 그중 가장 많이 벗어난 틀로 보고
  if (b && ctx.clips && ctx.clips.length && !clipReported && painted) {
    const rb = rbox(n);
    if (rb && rb.width > 0 && rb.height > 0 && ctx.clips.every(c => inter(c.b, rb))) {
      let worst = null;
      for (const c of ctx.clips) { const out = sticksOut(c.b, rb); if (out > OPT.tol && (!worst || out > worst.out)) worst = { c, out }; }
      if (worst) { add('잘림', { id: n.id, name: label(n), where, detail: `'${label(worst.c.n)}' 밖으로 ${r(worst.out)}px 나감` }); clipReported = true; }
    }
  }

  if (n.type === 'SECTION') sections.push(n);

  if (n.type === 'TEXT') {
    stats.texts++;
    const rb = n.absoluteRenderBounds;
    if (rb && b && n.textAutoResize !== 'WIDTH_AND_HEIGHT' && (rb.height - b.height > OPT.textGrow || rb.width - b.width > OPT.textGrow))
      add('텍스트 넘침', { id: n.id, name: label(n), where, detail: `글자 상자 ${r(b.width)}×${r(b.height)} → 실제 ${r(rb.width)}×${r(rb.height)}` });
    if (n.hasMissingFont && reallyMissing(n)) missingFont.push({ id: n.id, name: label(n), where });
    if (n.fontName === figma.mixed) { for (const s of n.getStyledTextSegments(['fontName'])) fonts[s.fontName.family] = (fonts[s.fontName.family] || 0) + 1; }
    else fonts[n.fontName.family] = (fonts[n.fontName.family] || 0) + 1;
    if (PLACEHOLDER.test(n.characters)) add('임시 문구', { id: n.id, name: label(n), where, detail: n.characters.slice(0, 40) });
    if (screen && rb) screenTexts.get(screen.id).push({ n, b: rb, overlay });
  }

  // 아이콘 후보 (텍스트와 겹침 점검용)
  let inIcon = ctx.inIcon;
  if (screen && !inIcon && n !== screen && b && b.width <= 40 && b.height <= 40 && b.width > 0 &&
      (n.type === 'INSTANCE' || n.type === 'VECTOR' || n.type === 'BOOLEAN_OPERATION' || n.type === 'ELLIPSE') &&
      !('findOne' in n && n.findOne(c => c.type === 'TEXT'))) { screenIcons.get(screen.id).push({ n, b, overlay }); inIcon = true; }

  // 변수 · 스타일에 연결 안 된 색 (화면 안, 인스턴스 밖)
  if (screen && !ctx.inInstance) {
    for (const prop of ['fills', 'strokes']) {
      if (!(prop in n)) continue;
      const paints = n[prop];
      if (paints === figma.mixed || !Array.isArray(paints)) continue;
      const sid = prop === 'fills' ? n.fillStyleId : n.strokeStyleId;
      if (sid && sid !== figma.mixed) continue;
      for (const p of paints) {
        if (p.type !== 'SOLID' || !shown(p)) continue;
        if (p.boundVariables && p.boundVariables.color) continue;
        const key = hex(p.color) + (p.opacity != null && p.opacity < 1 ? ` ${Math.round(p.opacity * 100)}%` : '');
        const c = (colors[key] = colors[key] || { count: 0, samples: [] });
        c.count++; if (c.samples.length < 3) c.samples.push({ id: n.id, name: label(n), where });
      }
    }
  }

  // 컴포넌트 아님 (이름은 버튼 · 칩 등인데 직접 그린 것)
  let rawReported = ctx.rawReported;
  if (screen && !ctx.inInstance && !rawReported && n !== screen && n.type !== 'INSTANCE' && n.type !== 'TEXT' && RAW_NAME.test(n.name)) {
    add('컴포넌트 아님', { id: n.id, name: label(n), where, detail: `${n.type} · 인스턴스가 아님` }); rawReported = true;
  }

  // 한쪽 색 띠 (금지 패턴) — 왼쪽 · 오른쪽만. 위 · 아래 밑줄(탭 등)은 정상
  if ('strokeLeftWeight' in n && visiblePaints(n.strokes)) {
    const L = n.strokeLeftWeight, R = n.strokeRightWeight, T = n.strokeTopWeight, B = n.strokeBottomWeight;
    if (T === 0 && B === 0 && ((L >= 2 && R === 0) || (R >= 2 && L === 0))) add('한쪽 색 띠', { id: n.id, name: label(n), where, detail: `${L >= 2 ? '왼쪽' : '오른쪽'}만 굵은 테두리` });
  }
  if ((n.type === 'RECTANGLE' || n.type === 'FRAME') && b && b.width <= 6 && b.height >= 20 && b.height / b.width >= 4 && hasSolid(n) && n.parent && n.parent.type !== 'PAGE' && n.parent.type !== 'SECTION') {
    const pb = box(n.parent);
    if (pb && pb.width > 60 && Math.abs(b.x - pb.x) <= 2 && (hasSolid(n.parent) || visiblePaints(n.parent.strokes))) add('한쪽 색 띠', { id: n.id, name: label(n), where, detail: '카드 왼쪽 세로 막대' });
  }

  if (n.type === 'INSTANCE' && !ctx.inInstance) { instQueue.push({ n, where }); stats.instances++; if (screen) screenInfo.get(screen.id).inst++; }

  if (!('children' in n)) return;
  const next = { screen, overlay, inInstance: ctx.inInstance || n.type === 'INSTANCE', inIcon, rawReported, clips: ctx.clips || [], clipReported };
  if (n.type !== 'SECTION' && 'clipsContent' in n && n.clipsContent && b && (!('overflowDirection' in n) || n.overflowDirection === 'NONE')) next.clips = next.clips.concat([{ n, b }]);
  for (const c of n.children) walk(c, next);
}

for (const t of targets) walk(t, {});

// 화면 안 텍스트끼리 · 텍스트와 아이콘 겹침
for (const [sid, texts] of screenTexts) {
  const where = label(screenInfo.get(sid) ? { name: screenInfo.get(sid).name } : { name: sid });
  const T = texts.slice(0, 600);
  const same = (a, b) => a.overlay === b.overlay;
  for (let i = 0; i < T.length; i++) for (let j = i + 1; j < T.length; j++) {
    if (!same(T[i], T[j])) continue;
    const x = inter(T[i].b, T[j].b);
    if (x && x.w >= OPT.minOverlap && x.h >= OPT.minOverlap) add('텍스트 겹침', { id: T[i].n.id, name: label(T[i].n), where, detail: `'${label(T[j].n)}'(${T[j].n.id})와 ${r(x.w)}×${r(x.h)}px` });
  }
  for (const ic of screenIcons.get(sid) || []) for (const t of T) {
    if (!same(ic, t)) continue;
    const x = inter(ic.b, t.b);
    if (x && x.w >= OPT.minOverlap && x.h >= OPT.minOverlap) add('텍스트 · 아이콘 겹침', { id: t.n.id, name: label(t.n), where, detail: `아이콘 '${label(ic.n)}'(${ic.n.id})와 ${r(x.w)}×${r(x.h)}px` });
  }
}

// 섹션 안 배치: 형제끼리 겹침 · 섹션 밖으로 나감
for (const s of sections) {
  const sb = box(s);
  const kids = s.children.filter(c => c.visible !== false && !OKTAG.test(c.name) && !ANNOT.test(c.name) && !ARROW.test(c.name) && box(c));
  for (const c of kids) { const cb = box(c); if (sb && !contains(sb, cb, OPT.tol)) add('섹션 밖으로 나감', { id: c.id, name: label(c), where: label(s), detail: `${r(sticksOut(sb, cb))}px` }); }
  for (let i = 0; i < kids.length; i++) for (let j = i + 1; j < kids.length; j++) {
    if (FLOW_HEAD.has(kids[i].name) && FLOW_HEAD.has(kids[j].name)) continue;
    const a = box(kids[i]), bb = box(kids[j]);
    if (contains(a, bb) || contains(bb, a)) { if (kids[i].type !== 'SECTION' && kids[j].type !== 'SECTION') add('배치 겹침', { id: kids[j].id, name: label(kids[j]), where: label(s), detail: `'${label(kids[i])}'(${kids[i].id}) 안에 통째로 겹침` }); continue; }
    const x = inter(a, bb);
    if (x && x.w >= OPT.minOverlap && x.h >= OPT.minOverlap) add('배치 겹침', { id: kids[j].id, name: label(kids[j]), where: label(s), detail: `'${label(kids[i])}'(${kids[i].id})와 ${r(x.w)}×${r(x.h)}px` });
  }
}

// 인스턴스 원본 출처 · 옛 컴포넌트
for (let i = 0; i < instQueue.length; i += 50) {
  const chunk = instQueue.slice(i, i + 50);
  const mains = await Promise.all(chunk.map(q => q.n.getMainComponentAsync().catch(() => null)));
  chunk.forEach((q, k) => {
    const mc = mains[k];
    if (!mc) { add('원본 컴포넌트 없음', { id: q.n.id, name: label(q.n), where: q.where }); return; }
    const set = mc.parent && mc.parent.type === 'COMPONENT_SET' ? mc.parent : mc;
    let p = set; while (p && p.type !== 'PAGE') p = p.parent;
    const src = mc.remote ? '외부 라이브러리' : p ? p.name.trim() : '(삭제된 컴포넌트)';
    compSrc[src] = (compSrc[src] || 0) + 1;
    if (OLD_NAME.test(set.name) || (p && OLD_PAGE.test(p.name)) || (!mc.remote && !p))
      add('옛 컴포넌트 의심', { id: q.n.id, name: label(q.n), where: q.where, detail: `원본 '${label(set)}' · ${src}` });
  });
}

const colorTop = Object.entries(colors).sort((a, b) => b[1].count - a[1].count).slice(0, 12).map(([hex, v]) => ({ hex, count: v.count, samples: v.samples }));
counts['연결 안 된 색'] = Object.values(colors).reduce((s, v) => s + v.count, 0);
// 모든 텍스트가 글꼴 없음이면 실행 환경(원격 MCP) 문제라 판단 불가로만 알림
let fontNote = null;
if (missingFont.length && missingFont.length === stats.texts) fontNote = `텍스트 ${stats.texts}개 전부 글꼴 없음으로 읽힘 → 실행 환경 글꼴 문제로 보임. 글꼴 점검 · 텍스트 넘침 점검 결과는 화면 스크린샷으로 다시 확인`;
else for (const m of missingFont) add('글꼴 없음', m);
return {
  scope: { page: page.name.trim(), targets: targets.map(t => ({ id: t.id, name: t.name })) },
  stats, summary: counts, issues, fontNote,
  unboundColors: { distinct: Object.keys(colors).length, top: colorTop },
  fonts, componentSources: compSrc,
  screensWithoutInstances: [...screenInfo].filter(([, v]) => v.inst === 0).map(([id, v]) => ({ id, name: v.name })).slice(0, 20),
};

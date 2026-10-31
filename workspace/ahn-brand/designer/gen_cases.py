"""케이스 스터디 HTML 생성기 — Wepair 케이스(case-wepair.html)의 스타일을 공통으로 쓴다.
사용: python3 gen_cases.py <이미지 루트> <출력 폴더>
이미지 루트 = ahn 레포의 src/assets/cases
"""
import base64, re, sys, pathlib

HERE = pathlib.Path(__file__).parent
IMG_ROOT = pathlib.Path(sys.argv[1])
OUT = pathlib.Path(sys.argv[2])
OUT.mkdir(parents=True, exist_ok=True)

base = (HERE / 'case-wepair.html').read_text()
CSS = re.search(r'<style>(.*?)</style>', base, re.S).group(1)
CSS += """
.dm{display:block;flex:none}
.spec b{text-transform:none}
body{word-break:keep-all}
html{background:#EAE8E3}body{margin:0 auto!important}
.flow .w{min-width:24px}
.rows{border:2px solid #111;background:#F2F1EC;margin-top:24px}
.rows .hd{background:#111;color:#EAE8E3;padding:9px 16px;display:flex;justify-content:space-between}
.rw{display:grid;grid-template-columns:126px 230px 1fr;align-items:baseline;padding:22px 16px;border-bottom:1px solid #111}
.rw:last-child{border-bottom:0}
.rw h3{font-size:26px;font-weight:900;letter-spacing:-.05em;line-height:1.3}
.rw p{font-size:19px;line-height:1.55;letter-spacing:-.02em}
.rw .on{background:#D2FF3D}
.cz{display:grid;grid-template-columns:126px auto 1fr;align-items:center;column-gap:0;padding:26px 24px 30px 16px;border-top:1px solid #111}
.cz .big{font-size:34px;font-weight:900;letter-spacing:-.06em;line-height:1.3;padding-right:56px}
.cmp{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:24px}
.drow{display:grid;grid-template-columns:420px 1fr;border:2px solid #111;background:#F2F1EC;margin-top:24px}
.drow .tx{padding:22px;border-right:1px solid #111;display:flex;flex-direction:column;gap:16px}
.drow .tx h3{font-size:34px;font-weight:900;letter-spacing:-.05em;line-height:1.25}
.drow .tx p{font-size:17px;line-height:1.6}
.drow .tx .q{margin-top:auto;padding-top:16px;border-top:1px solid #111;font-size:16px;color:#3A3936}
.drow .ims{display:grid;grid-template-columns:1fr 1fr}
.drow .ims>div{display:flex;flex-direction:column}
.drow .ims>div+div{border-left:1px solid #111}
.drow .ims .lb{padding:9px 14px;border-bottom:1px solid #111;display:flex;justify-content:space-between}
.drow .ims .to .lb{background:#111;color:#EAE8E3}
.drow .ims .im{padding:24px;display:flex;justify-content:center;flex:1;align-items:flex-start}
.drow .ims img{display:block;border:1.5px solid #111;max-width:100%}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:24px}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:24px}
.box{border:2px solid #111;background:#F2F1EC;display:flex;flex-direction:column}
.box .hd{display:flex;justify-content:space-between;padding:9px 14px;border-bottom:2px solid #111}
.box .hd.dk{background:#111;color:#EAE8E3}
.box .bd{padding:18px 18px 22px;display:flex;flex-direction:column;gap:12px;flex:1}
.box h3{font-size:28px;font-weight:900;letter-spacing:-.05em;line-height:1.3}
.box p{font-size:17px;line-height:1.6}
.box .im{padding:18px;display:flex;justify-content:center;border-bottom:1px solid #111}
.box .im img{display:block;border:1.5px solid #111;max-width:100%}
.box.on{background:#D2FF3D}
.box.ink{background:#111;color:#EAE8E3}
.box.ink .hd{border-color:#444}
.tbl2{border:2px solid #111;background:#F2F1EC;margin-top:24px}
.tbl2 .tr{display:grid;border-bottom:1px solid #111}
.tbl2 .tr:last-child{border-bottom:0}
.tbl2 .tr>*{padding:16px 16px;border-right:1px solid #111;font-size:17px;line-height:1.55}
.tbl2 .tr>*:last-child{border-right:0}
.tbl2 .th{background:#111;color:#EAE8E3}
.tbl2 .th>*{border-color:#444;font-family:'Space Mono',monospace;font-size:12px;letter-spacing:.08em;text-transform:uppercase;padding:10px 16px}
.tbl2 b{font-weight:900;font-size:19px;letter-spacing:-.03em}
.days{display:grid;grid-template-columns:200px repeat(16,1fr);border:2px solid #111;background:#F2F1EC;margin-top:24px}
.days>div{border-right:1px solid #C9C6BE;border-bottom:1px solid #111;padding:10px 6px;min-height:52px;font-size:14px;display:flex;align-items:center}
.days .hdc{background:#111;color:#EAE8E3;border-color:#444;justify-content:center;min-height:36px}
.days .nm{padding-left:14px;font-weight:700;border-right:1px solid #111}
.days .bar{background:#111;color:#EAE8E3;font-weight:700;font-size:13px;justify-content:center;border-right:1px solid #111}
.days .bar.o{background:#D2FF3D;color:#111}
.lvl{display:grid;grid-template-columns:repeat(3,1fr);border:2px solid #111;margin-top:24px}
.lvl>div{padding:20px 20px 24px;border-right:1px solid #111;display:flex;flex-direction:column;gap:12px;background:#F2F1EC}
.lvl>div:last-child{border-right:0}
.lvl b{font-family:'Archivo Black';font-weight:400;font-size:72px;letter-spacing:-.05em;line-height:.9}
.lvl h3{font-size:28px;font-weight:900;letter-spacing:-.05em}
.lvl p{font-size:16px;line-height:1.6}
.lvl .o{background:#D2FF3D}.lvl .k{background:#111;color:#EAE8E3}
.nums6{display:grid;grid-template-columns:repeat(3,1fr);border:2px solid #111;background:#F2F1EC;margin-top:24px}
.nums6>div{padding:20px;border-right:1px solid #111;border-bottom:1px solid #111;display:flex;flex-direction:column;gap:10px}
.nums6>div:nth-child(3n){border-right:0}
.nums6>div:nth-last-child(-n+3){border-bottom:0}
.nums6 b{font-family:'Archivo Black';font-weight:400;font-size:64px;letter-spacing:-.05em;line-height:1}
.nums6 p{font-size:16px;font-weight:700}
.shot{border:2px solid #111;background:#F2F1EC;margin-top:24px}
.shot .hd{display:flex;justify-content:space-between;padding:9px 14px;border-bottom:2px solid #111;background:#111;color:#EAE8E3}
.shot .im{padding:32px;display:flex;justify-content:center}
.shot .im img{display:block;border:1.5px solid #111}
.shot .cap{padding:12px 16px;border-top:1px solid #111;display:flex;justify-content:space-between;font-size:15px}
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:24px}
.steps .box .im img{width:100%}
.note{margin-top:14px;font-size:15px;color:#3A3936}
"""

def img(case, name):
    p = IMG_ROOT / case / f'{name}.png'
    return 'data:image/png;base64,' + base64.b64encode(p.read_bytes()).decode()

DM = '<svg class="dm" width="18" height="18" viewBox="0 0 18 18"><path d="M9 1.5L16.5 9L9 16.5L1.5 9Z" fill="#D2FF3D" stroke="#111" stroke-width="1.5"/></svg>'

def flow(nodes, last_dark=True):
    out = []
    for i, n in enumerate(nodes):
        dark = last_dark and i == len(nodes) - 1
        st = ' style="background:#111;color:#EAE8E3"' if dark else ''
        out.append(f'<span class="node"{st}>{n}</span>')
        if i < len(nodes) - 1:
            out.append(f'<span class="w"></span>{DM}<span class="w"></span>')
    return '<div class="flow">' + ''.join(out) + '</div>'

def tag(t):
    return f'<span class="tag">{t}</span>'

def sh(title, num, sub):
    return f'<div class="sh"><h2>{title}</h2><div class="r"><span class="mono">{num}</span><p>{sub}</p></div></div>'

def page(c):
    nav_on = c['nav']
    nav = ''.join(f'<span class="on">{n}</span>' if n == nav_on else f'<span>{n}</span>' for n in ['Index', 'Off the clock', 'Cases', 'Built'])
    spec = ''.join(f'<div><span>{k}</span><b>{v}</b></div>' for k, v in c['spec'])
    keys = ''
    for i, (lab, num, desc, tg) in enumerate(c['keys']):
        last = i == len(c['keys']) - 1
        st = ' style="color:#111"' if last else ''
        d = f'<p class="tagrow"{st}>{tag(tg)}{desc}</p>' if tg else f'<p>{desc}</p>'
        keys += f'<div><span class="mono">{lab}</span><b>{num}</b>{d}</div>'
    title = c['title']
    body = '\n'.join(c['sections'])
    nxt_name, nxt_meta, nxt_idx = c['next']
    return f'''<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><title>Case · {c["name"]}</title>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Noto+Sans+KR:wght@400;700;900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>{CSS}</style></head><body><div class="page">
<div class="bar"><span class="logo">ahn.</span><div class="nav mono">{nav}</div><span class="mono" style="text-transform:none">hs2190.an@gmail.com</span></div>
<div class="crumb mono"><span>{c["crumb"]}</span><span>Case · {c["label"]}</span></div>
<div class="spec mono">{spec}</div>
<section class="hero">
  <h1 class="h1">{title}</h1>
  <p class="lead">{c["lead"]}</p>
  <p class="sub">{c["sub"]}</p>
</section>
<div class="keys">{keys}</div>
{body}
<section class="next">
  <div class="t"><h2>Next case.</h2><span class="mono">{nxt_idx}</span></div>
  <div class="band"><b>{nxt_name}</b><span class="mono">{nxt_meta}</span></div>
</section>
<div class="foot mono"><span>ahn. From screens to systems</span><span>Ref. AHN-2026 / {c["ref"]}</span><span>© 2026 Ahn Hyeonseo</span></div>
</div></body></html>'''

def rows(head_l, head_r, items, cause=None):
    h = f'<div class="hd mono"><span>{head_l}</span><span>{head_r}</span></div>'
    r = ''.join(f'<div class="rw"><span class="mono">{k}</span><h3>{t}</h3><p>{d}</p></div>' for k, t, d in items)
    cz = ''
    if cause:
        txt, fl = cause
        cz = f'<div class="cz"><span class="mono">Cause</span><p class="big">{txt}</p>{fl}</div>'
    return f'<div class="rows">{h}{r}{cz}</div>'

def cmp(case, before, after, w, cap_b, cap_a, screen):
    def pn(cls, lab, src, k, cap):
        return f'<div class="pn{cls}"><div class="hd mono"><span>{lab}</span><span>{screen}</span></div><div class="im"><img src="{img(case, src)}" style="width:{w}px"></div><div class="ft"><span class="mono">{k}</span><p>{cap}</p></div></div>'
    return '<div class="cmp">' + pn('', 'As-is · 리뉴얼 전', before, 'Problem', cap_b) + pn(' to', 'To-be · 리뉴얼 후', after, 'Decision', cap_a) + '</div>'

def drow(case, code, title, text, quote, before, after, w, screen):
    return f'''<div class="drow"><div class="tx"><span class="mono">{code}</span><h3>{title}</h3><p>{text}</p>{f'<p class="q">{quote}</p>' if quote else ''}</div>
<div class="ims"><div><div class="lb mono"><span>As-is</span><span>{screen}</span></div><div class="im"><img src="{img(case, before)}" style="width:{w}px"></div></div>
<div class="to"><div class="lb mono"><span>To-be</span><span>{screen}</span></div><div class="im"><img src="{img(case, after)}" style="width:{w}px"></div></div></div></div>'''

def proof(items, contrib):
    def num(n, big):
        return f'<b>{n}</b>' if big else f'<span class="kr">{n}</span>'
    r = ''.join(f'<div class="pr">{tag(tg)}{num(n, big)}<p>{t}<small>{s}</small></p></div>' for tg, n, big, t, s in items)
    r = r.replace('<span class="tag">', '<span class="tag" style="justify-self:start">')
    return f'<div class="proof">{r}</div><div class="contrib"><span class="mono">Contribution</span><p>{contrib}</p></div>'

def limits(left, right):
    return f'<div class="lim"><div><span class="mono">Not measured</span><p>{left}</p></div><div class="o"><span class="mono">Since then</span><h3>{right}</h3></div></div>'

def tbl2(cols, head, rows_):
    tpl = f'grid-template-columns:{cols}'
    h = '<div class="tr th" style="%s">%s</div>' % (tpl, ''.join(f'<span>{x}</span>' for x in head))
    b = ''.join('<div class="tr" style="%s">%s</div>' % (tpl, ''.join(f'<span>{x}</span>' for x in r)) for r in rows_)
    return f'<div class="tbl2">{h}{b}</div>'

CASES = {}

# ---------------- Dr's Solution ----------------
days = list(range(7, 23))
def gantt():
    rows_ = [
        ('현황 파악', [(7, 12, '이관 · 점검', '')]),
        ('기준 세우기', [(13, 13, '기준 5', '')]),
        ('위험 정리', [(16, 16, '반영', '')]),
        ('메뉴별 리뉴얼', [(19, 19, '홈', ''), (20, 20, '예약 · 고객', ''), (21, 21, '상담 · 관리', ''), (22, 22, '로그인', '')]),
        ('문구', [(13, 13, 'v1.0', 'o'), (16, 16, 'v1.1', 'o'), (22, 22, 'v1.2', 'o')]),
        ('디자인 방향', [(19, 19, '무드보드', 'o')]),
    ]
    h = '<div class="hdc mono" style="justify-content:flex-start;padding-left:14px">10월</div>' + ''.join(f'<div class="hdc mono">{d}</div>' for d in days)
    body = ''
    for name, bars in rows_:
        cells = f'<div class="nm">{name}</div>'
        d = 7
        while d <= 22:
            hit = next((b for b in bars if b[0] == d), None)
            if hit:
                s, e, l, o = hit
                span = e - s + 1
                cells += f'<div class="bar {o}" style="grid-column:span {span}">{l}</div>'
                d = e + 1
            else:
                cells += '<div></div>'
                d += 1
        body += cells
    return f'<div class="days">{h}{body}</div>'

CASES['drs'] = dict(
    name="Dr's Solution", nav='Cases', crumb="Cases / 01 · Dr's Solution", label='Commissioned', ref='Case 01',
    spec=[('Client', '티엘씨헬스케어'), ('Type', 'B2B 운영 웹 리뉴얼'), ('Period', '2026.10 · 2주'), ('Role', '리뉴얼 기획 · UX/UI · UX 라이팅'), ('Team', '개발 1명 · 기획자 없음'), ('For', '메디컬 웰니스 센터 운영 도구')],
    title="Dr's<br><span class=\"hl\">solution.</span>",
    lead='기준 없이 만들어진 운영 도구에<br>기준부터.',
    sub='정책 문서도, 용어 기준도, 디자인 시스템도 없던 운영 웹. 2주 동안 기준부터 다시.',
    keys=[('기간', '2주', '현황 파악부터 디자인까지', ''), ('기준', '5', '미결 정책 15건 결정', '실측'), ('메뉴 리뉴얼', '6', '메뉴별 작업 나흘', '실측'), ('문구 분석', '1,060', '라이팅 가이드 v1.2로', '실측')],
    sections=[
        sh('What was missing.', '01 · Missing', '무엇이 없었나.'),
        rows('점검 · 화면 389장 · 팝업 71개', '실측', [
            ('Lost', '사라지는 기록', '자동 저장 없음. 로그인 45분이 지나면 안내 없이 사라지는 작성 내용.'),
            ('Unchecked', '확인 없는 실수', '되돌릴 수 없는 작업 9개에 확인 없음. [수행 완료]를 누르면 바로 이용횟수 차감.'),
            ('Mixed', '같은 일, 다른 말', '뒤섞인 확정 · 반려 · 거절, 4곳에서 다른 뜻으로 쓰인 "중지".'),
        ], cause=('정책 문서 · 업무 흐름 · 용어 기준 ·<br>디자인 시스템 없이 만든 도구.', flow(['정책', '흐름', '용어', '시스템'], False))),
        sh('Before / after.', '02 · As-is / To-be', '같은 화면, 같은 크기로.'),
        cmp('drs', 'home-before', 'home-after', 600, '스크롤해야 보이는 다음 일,<br>여러 곳에 흩어진 알림.', '스크롤 없는 한 화면에<br>다음 고객과 상태 탭.', '홈'),
        '<p class="note">홈 1차 점검은 가상 사용자 3명. 실제 사용자 검증 아님.</p>',
        sh('Process.', '03 · 2 weeks', '기준을 먼저 세우고, 메뉴 6개는 나흘에.'),
        gantt(),
        sh('Decisions.', '04 · Decision', '영향이 클수록 한 단계씩 더 확인.'),
        '''<div class="lvl"><div><span class="mono">Level</span><b>1</b><h3>바로 실행</h3><p>되돌릴 수 있는 작업. 토스트로만 안내.<br>예) 판매 종료 · 계정 정지</p></div>
<div class="o"><span class="mono">Level</span><b>2</b><h3>결과 확인</h3><p>"○○할까요?"와 결과 1~2줄.<br>예) 수행 완료 · 예약 취소 · 노쇼</p></div>
<div class="k"><span class="mono">Level</span><b>3</b><h3>이름 확인</h3><p>영향 목록과 사유, 이름 입력.<br>예) 고객 삭제 · 계정 삭제</p></div></div>''',
        tbl2('126px 260px 1fr', ['Device', '공통 장치', '쓰이는 곳'], [
            ('<span class="mono">A</span>', '<b>결과 확인 팝업</b>', '[수행 완료] · 임시 비밀번호 · 계정 삭제 · 휴일 · 영업시간'),
            ('<span class="mono">B</span>', '<b>입력 보호</b>', '상담 · 수행기록 입력 · 녹음'),
            ('<span class="mono">C</span>', '<b>로그인 만료 안내</b>', '5분 전 안내, 다시 로그인하면 쓰던 화면으로 복귀'),
        ]),
        drow('drs', 'DEC-01 · Consult', '상담 작성', '예약 등록을 열던 [상담 작성]을, 상담 화면에서 바로 작성 · 녹음으로.', '', 'consult-before', 'consult-after', 400, '상담'),
        drow('drs', 'DEC-02 · Customer', '고객 상세', '이름 없는 표를 이름 · 기본정보 · 특이사항 · 프로그램 순서로.', '', 'cust-before', 'cust-after', 400, '고객'),
        drow('drs', 'DEC-03 · Booking', '예약 상세', '시간표를 가리던 팝업을 오른쪽 시트로.', '', 'detail-before', 'detail-after', 400, '예약'),
        sh('Words.', '05 · Words', '같은 말, 같은 모양.'),
        tbl2('126px 1fr 1fr', ['', 'Before', 'After'], [
            ('<span class="mono">01</span>', '알람', '<b>알림 · 알림 소리</b>'),
            ('<span class="mono">02</span>', '계정이 없으신가요?', '<b>계정이 없나요?</b>'),
            ('<span class="mono">03</span>', '~했습니다', '<b>~했어요</b>'),
        ]),
        '<p class="note">고유 문구 1,060개 분석, 라이팅 가이드 v1.2와 교체표 v1.1.</p>',
        sh('Proof.', '06 · Proof', '숫자마다 근거 표시.'),
        proof([
            ('실측', '5', True, '기준 수립, 미결 정책 15건 결정.', '확인 3단계 · 공통 장치 3개 · 홈 한 화면 · 문구 기준.'),
            ('실측', '6', True, '메뉴 6개 리뉴얼.', '홈 · 예약 · 고객 · 상담 · 관리 · 로그인.'),
            ('실측', '1,060', True, '고유 문구 분석.', '라이팅 가이드 v1.2 · 교체표 v1.1.'),
        ], '기획 · 디자인 담당. Crew로 단계를 나눠 진행, 판단은 직접.'),
        sh('Limits.', '07 · Limits', '확인하지 못한 것.'),
        limits('실사용 데이터와 인터뷰 없이 진행. 홈은 가상 사용자 3명으로 1차 점검만. 실제 사용자 검증 아님.', '그래서 결정마다 근거를<br>화면 옆에.'),
    ],
    next=('Wepair', 'B2B 공업사 현장 앱 · 2025–26', 'Case 02'),
)

# ---------------- Gocha ----------------
CASES['gocha'] = dict(
    name='Gocha', nav='Cases', crumb='Cases / 03 · Gocha', label='Commissioned', ref='Case 03',
    spec=[('Client', 'AJ메인터넌스파트너스'), ('Type', 'B2C 방문정비 앱'), ('Period', '2022–23'), ('Role', 'UX/UI · 리뉴얼 · 광고 소재 디자인'), ('Team', '개발 협업'), ('Platform', 'iOS · Android')],
    title='<span class="hl">Gocha.</span>',
    lead='믿음이 안 가던 앱의 재설계,<br>흩어진 기능 정리.',
    sub='신뢰 · 발견 · 행동 세 기준으로 다시 짠 홈과 메뉴 구조.',
    keys=[('사내 MVP 테스트', '29', '실사용 테스트 인원', '관찰'), ('더보기 메뉴', '15→8', '차량 중심으로 재구성', '실측'), ('예약 탭', '+1', '없던 화면 신설', ''), ('광고 CPI', '−63%', '광고 소재 디자인 기준', '실측')],
    sections=[
        sh('What was missing.', '01 · Missing', '무엇이 없었나.'),
        rows('사내 MVP 실사용 테스트 29명 · 스토어 리뷰', '관찰', [
            ('Credibility', '신뢰 부족', '"앱이 너무 부실해 보여요." 보이는 완성도가 낮아, 화면 자체에 대한 불신.'),
            ('Discovery', '발견 실패', '"뭐 하는 앱인지 모르겠어요." 밖에서 보이지 않던 기능.'),
            ('First look', '첫인상', '무엇을 말할지 정해지지 않은 첫 화면.'),
        ], cause=('기능은 있었지만,<br>보이는 곳에는 없음.', flow(['신뢰', '발견', '행동'], True))),
        sh('Before / after.', '02 · As-is / To-be', '같은 화면, 같은 크기로.'),
        cmp('gocha', 'home-before', 'home-after', 380, '무엇을 말할지<br>정해지지 않은 첫 화면.', '홈을 열면<br>가장 먼저 보이는 내 차 상태.', '홈'),
        sh('Decisions.', '03 · Decision', '보이는 곳부터, 쓰는 순서대로.'),
        tbl2('220px 260px 1fr', ['Item', 'Before', 'After'], [
            ('<b>예약내역</b>', '화면 없음', '예약 탭 신설, 예약하기와 예약내역 통합'),
            ('<b>차계부 · 점검리포트</b>', '더보기에 묻힌 중복 진입', '차량관리로 일원화, 차량 상세에서 바로 진입'),
            ('<b>이벤트</b>', '팝업과 메뉴에 묻힌 이벤트', '홈 배너와 이벤트 허브로 상시 노출'),
        ]),
        drow('gocha', 'DEC-01 · Garage log', '차계부', '쌓인 기록 대신 다음 정비 시점. 교체 주기 게이지에서 예약으로 바로.', '"과거 기록보다 다음에 무엇을 언제 정비할지 알고 싶었어요."', 'log-before', 'log-after', 280, '차계부'),
        drow('gocha', 'DEC-02 · Event', '이벤트', '묻혀 있던 혜택을 홈 상설 배너와 이벤트 허브로. 마감은 D-day로 표시.', '"혜택이 보이면 반응하지만, 안 보이면 존재조차 몰라요."', 'event-before', 'event-after', 270, '이벤트'),
        sh('Proof.', '04 · Proof', '제품과 광고는 따로.'),
        proof([
            ('실측', '15→8', True, '더보기 메뉴를 차량 중심으로 재구성.', '7개 정리, 예약 탭 신설.'),
            ('실측', '−63%', True, '광고 CPI, 5월 19,070원에서 10월 6,962원으로.', '광고 운영 지표. 채널별 광고 소재 직접 디자인.'),
            ('실측', '4,027', True, '8개월 누적 앱 설치.', '광고 운영 지표.'),
        ], '앱 리뉴얼 디자인과 광고 소재 디자인 담당. 개발팀과 함께 출시.'),
        sh('Limits.', '05 · Limits', '확인하지 못한 것.'),
        limits('제품 개편과 광고가 함께 바뀐 같은 8개월. 그래서 광고 지표는 제품 효과와 분리. 홈 · 차계부 · 이벤트 개편의 이용 변화는 수치 없음.', '그 뒤로는 바꾸기 전에<br>전후 비교 기준부터.'),
    ],
    next=('Sensicon', '키오스크 · 테이블오더 · 2020–22', 'Case 04'),
)

# ---------------- Sensicon ----------------
steps = [('01', '대기', '화면 터치로 시작'), ('02', '식사 장소 · 언어', '매장 · 포장, 한국어 · 영어 선택'), ('03', '메뉴 탐색', '대분류와 소분류 2단'), ('04', '옵션 선택', '금액 실시간 갱신'), ('05', '결제', '카드 안내와 30초 타이머'), ('06', '완료', '호출 번호는 크게, 영수증 발송')]
step_html = '<div class="steps">' + ''.join(
    f'<div class="box{" on" if i == 5 else ""}"><div class="hd mono"><span>Step {n}</span><span>{"Done" if i == 5 else "Order"}</span></div><div class="im"><img src="{img("sensicon", n)}"></div><div class="bd"><h3>{t}</h3><p>{d}</p></div></div>'
    for i, (n, t, d) in enumerate(steps)) + '</div>'
CASES['sensicon'] = dict(
    name='Sensicon', nav='Cases', crumb='Cases / 04 · Sensicon', label='Commissioned', ref='Case 04',
    spec=[('Client', '센시콘'), ('Type', '키오스크 · 테이블오더'), ('Period', '2020–22'), ('Role', 'UX/UI · 디바이스 규칙 · 주문 플로우'), ('Team', '개발 협업'), ('Device', '키오스크(세로) · 테이블오더(가로)')],
    title='<span class="hl">Sensicon.</span>',
    lead='두 기기,<br>하나의 주문 규칙.',
    sub='제품 목표는 "두 기기를 하나의 프로그램처럼". 하지만 서로 다른 기기.',
    keys=[('기기', '2', '키오스크와 테이블오더', ''), ('주문 플로우', '6', '터치부터 완료까지', '관찰'), ('예외 상태', '2', '무응답과 결제 실패', '관찰'), ('무응답 기준', '30초', '그 뒤 대기 화면으로', '관찰')],
    sections=[
        sh('What was missing.', '01 · Missing', '무엇이 없었나.'),
        rows('제품 목표', '두 기기를 하나의 프로그램처럼', [
            ('Kiosk', '키오스크', '세로 화면. 서서, 멀리서 조작. 한 화면에 많이.'),
            ('Table', '테이블오더', '가로 화면. 앉아서, 가까이서 조작. 한 화면에 적게.'),
        ], cause=('같은 규칙과 다른 규칙을<br>먼저 나누지 않은 상태.', flow(['공유 축', '분기 축'], True))),
        sh('Rules.', '02 · Shared / Branch', '공유할 규칙과 다를 규칙부터 구분.'),
        '''<div class="grid2"><div class="box"><div class="hd dk mono"><span>Shared · 컴포넌트로 고정</span><span>3</span></div><div class="bd"><h3>컬러 · 타이포 · 버튼</h3><h3>주문 플로우 6단계</h3><h3>상태 배지 규칙</h3></div></div>
<div class="box"><div class="hd mono"><span>Branch · 레이아웃에서만</span><span>3</span></div>''' + tbl2('1fr 1fr 1fr', ['', '키오스크', '테이블오더'], [('<b>열 구성</b>', '쌓기', '펼침'), ('<b>한 화면 항목 수</b>', '많음', '적음'), ('<b>조작 자세</b>', '서서 · 원거리', '앉아서 · 근거리')]).replace('class="tbl2"', 'class="tbl2" style="margin:0;border:0"') + '</div></div>',
        sh('Order flow.', '03 · 6 steps', '터치 한 번으로 시작해, 혼자서 끝내는 주문.'),
        step_html,
        sh('States.', '04 · State & recovery', '멈췄을 때 할 일까지.'),
        tbl2('220px 160px 1fr 1fr', ['상황', '상태', '안내', '복구'], [
            ('<b>30초 무응답</b>', '타임아웃', '남은 시간 안내 후 종료', '장바구니를 비우고 대기 화면으로'),
            ('<b>결제 실패</b>', '실패', '사유를 문장으로 안내', '결제 수단 재선택, 주문은 유지'),
        ]),
        '<p class="note">상태를 정하지 않으면, 멈춘 화면 앞에서 직원을 찾는 사용자.</p>',
        sh('Proof.', '05 · Proof', '숫자마다 근거 표시.'),
        proof([
            ('관찰', '6', True, '주문 플로우 6단계.', '대기 · 장소와 언어 · 메뉴 · 옵션 · 결제 · 완료.'),
            ('관찰', '2', True, '예외 상태 2종과 복구 규칙을 먼저.', '30초 무응답 · 결제 실패.'),
        ], 'UX/UI 디자인과 디바이스 규칙 담당. 개발팀과 함께 출시.'),
        sh('Limits.', '06 · Limits', '확인하지 못한 것.'),
        limits('성과를 잰 수치 없음. 그래서 숫자 없이.', '그 뒤로는 성공보다<br>실패를 먼저 설계.'),
    ],
    next=('Iris', '디자인 시스템 · 2026', 'Case 05'),
)

# ---------------- Iris ----------------
CASES['iris'] = dict(
    name='Iris', nav='Cases', crumb='Cases / 05 · Iris', label='Self-initiated', ref='IRS-02',
    spec=[('Project', '개인 프로젝트'), ('Type', '디자인 시스템'), ('Period', '2026'), ('Role', '설계 · 구현 · npm 배포'), ('Team', 'Crew로 단계를 나눠 진행'), ('License', 'MIT · npm 0.2.0')],
    title='<span class="hl">Iris.</span>',
    lead='Figma에서 끝나지 않고<br>코드와 배포까지 이어지는 디자인 시스템.',
    sub='위페어 · 고챠 · 센시콘에서 세 번, 처음부터. 네 번째는 다시 쓰이게.',
    keys=[('컴포넌트 세트', '117', 'Figma 기준', '실측'), ('변수', '293', '8 컬렉션', '실측'), ('배포 컴포넌트', '44', 'npm 0.2.0', '실측'), ('Figma ↔ 코드 대조', '1,012', '건 하나씩 대조', '실측')],
    sections=[
        sh('What was missing.', '01 · Missing', '무엇이 없었나.'),
        rows('세 번의 0→1', '위페어 · 고챠 · 센시콘', [
            ('Problem', '매번 처음부터', '세 프로젝트에서 디자인 시스템을 세 번, 처음부터.'),
            ('Cause', '그 안에서만 사용', '같은 판단이었지만 그 프로젝트 안에서만.'),
            ('Decision', '코드까지 연결', 'Figma 변수를 원본으로, 설치해서 쓰는 코드까지 연결.'),
        ]),
        sh('Token layers.', '02 · Raw / Role', '컴포넌트는 역할 이름만.'),
        '<div class="grid2"><div class="box"><div class="hd dk mono"><span>Why</span><span>Dark mode</span></div><div class="bd"><h3>다크 모드를 붙이려다<br>하루 만에 멈춤.</h3><p>색 하나를 컴포넌트가 직접 부르면, 다크 모드는 컴포넌트를 전부 고쳐야 적용. 그래서 원료와 역할의 두 층 분리. 어느 원료를 가리킬지는 역할 층에서.</p></div></div>'
        + '<div class="box">' + tbl2('1.4fr 1fr 1fr', ['Role', 'Light', 'Dark'], [('<b>label/normal</b>', 'cN/10', 'cN/99'), ('<b>background/normal</b>', 'common/100', 'cN/15'), ('<b>primary/normal</b>', 'violet/50', 'violet/60')]).replace('class="tbl2"', 'class="tbl2" style="margin:0;border:0"') + '</div></div>',
        sh('Pipeline.', '03 · Figma to npm', '파이프라인 위의 핸드오프.'),
        '<div class="rows"><div class="hd mono"><span>Pipeline</span><span>Figma가 원본, 코드는 빌드 결과</span></div><div class="cz" style="border-top:0"><span class="mono">Flow</span><p class="big">문서 수치는<br>손으로 쓰지 않기.</p>' + flow(['Figma 원본', '빌드 · CSS', 'npm 배포', '문서 사이트'], True) + '</div></div>',
        tbl2('126px 220px 1fr', ['', 'Guard', ''], [
            ('<span class="mono">입력</span>', '<b>규칙 파일</b>', '토큰 이름 규칙 · 산출 형식 · 검수 기준부터 문서화'),
            ('<span class="mono">검증</span>', '<b>1,012건 대조</b>', 'Figma 변수를 원본으로, 컴포넌트와 코드 하나씩 대조 · 타입체크'),
            ('<span class="mono">방향</span>', '<b>직접 고친 3번</b>', '토큰 2층 분리 · 아이콘 30종 폐기 · 플랫폼 분기 이관'),
        ]),
        sh('Proof.', '04 · Proof', '숫자마다 근거 표시.'),
        '''<div class="nums6"><div><span class="mono">컴포넌트 세트</span><b>117</b><p class="tagrow">''' + tag('실측') + '''Figma</p></div><div><span class="mono">변수</span><b>293</b><p class="tagrow">''' + tag('실측') + '''8 컬렉션</p></div><div><span class="mono">배포 컴포넌트</span><b>44</b><p class="tagrow">''' + tag('실측') + '''npm 0.2.0</p></div>
<div><span class="mono">CSS 변수</span><b>335</b><p class="tagrow">''' + tag('실측') + '''빌드 결과</p></div><div><span class="mono">아이콘</span><b>72×2</b><p class="tagrow">''' + tag('실측') + '''line · fill</p></div><div style="background:#D2FF3D"><span class="mono">공개</span><b>MIT</b><p class="tagrow" style="color:#111">''' + tag('출처') + '''npm · 문서 사이트</p></div></div>''',
        '<div class="contrib"><span class="mono">Contribution</span><p>설계부터 배포까지 직접. 실행은 Crew 6단계, 방향은 직접.</p></div>',
        sh('Limits.', '05 · Limits', '확인하지 못한 것.'),
        limits('혼자 만든 시스템. 여러 사람이 함께 쓰며 생기는 마찰은 아직 미확인.', '다음은 팀의 피드백으로<br>기준이 고쳐지는 구조.'),
    ],
    next=('GitMate', 'AI 도구 · 2026.08', 'Case 06'),
)

# ---------------- GitMate ----------------
CASES['gitmate'] = dict(
    name='GitMate', nav='Cases', crumb='Cases / 06 · GitMate', label='Self-initiated', ref='GTM-03',
    spec=[('Project', '개인 프로젝트'), ('Type', 'AI 도구 · 웹'), ('Period', '2026.08'), ('Role', '기획 · 디자인 · 개발 · 배포'), ('Team', 'Crew로 단계를 나눠 진행'), ('Status', 'Live · gitmate-navy.vercel.app')],
    title='<span class="hl">GitMate.</span>',
    lead='GitHub 자료를 내게 맞게 정리해,<br>AI에 다시 묻지 않아도 되는 도구.',
    sub='한국어 핵심과 내 상황에 맞는 쓰는 법을 한 장에.',
    keys=[('시작하는 길', '3', '역할 · 키워드 · 주소', ''), ('한 장에 담은 것', '4', '핵심 · 적용 · 막힘 · 원본', ''), ('폴백 경로', '5/5', '직접 재현해 확인', '실측'), ('콘솔 앱 에러', '0', '헤드리스 브라우저 기준', '실측')],
    sections=[
        sh('What was missing.', '01 · Missing', '무엇이 없었나.'),
        rows('내가 겪은 불편', '본인', [
            ('Find', '매번 다시 찾기', '모아 둔 자료도 필요할 때마다 다시 찾기.'),
            ('English', '영어 번역', '영어와 개발 용어라 매번 번역부터 하던 README.'),
            ('Apply', '내 일에 맞추기', '읽고 나서도 내 상황에 맞는 쓰임을 AI에 다시 질문.'),
        ], cause=('한 번에 정리되지 않아<br>반복되던 같은 질문.', flow(['찾기', '번역', '되묻기'], True))),
        sh('Three ways.', '02 · Entry', '세 가지 길 중 편한 것으로 시작.'),
        tbl2('126px 300px 1fr', ['', 'Way', ''], [
            ('<span class="mono">01</span>', '<b>역할 · 상황으로 추천</b>', '역할 · 지금 하는 일 · 목적 · 난이도를 고르면 맞는 자료 추천'),
            ('<span class="mono">02</span>', '<b>키워드로 찾기</b>', '"영상 자막", "무드보드 이미지"처럼 하고 싶은 일로 검색'),
            ('<span class="mono">03</span>', '<b>GitHub 주소로 알아보기</b>', '주소만 넣으면 실제 README를 읽어 바로 정리'),
        ]),
        f'<div class="shot"><div class="hd mono"><span>Fig. 01 · Onboarding</span><span>어떻게 시작할까요?</span></div><div class="im"><img src="{img("gitmate", "onboarding")}" style="width:1000px"></div></div>',
        sh('One card.', '03 · Resource', '자료 한 장에 핵심 · 적용 · 막힘까지.'),
        f'<div class="shot"><div class="hd mono"><span>Fig. 02 · Resource</span><span>openai / whisper</span></div><div class="im"><img src="{img("gitmate", "resource")}" style="width:1000px"></div></div>',
        tbl2('126px 300px 1fr', ['', 'Part', ''], [
            ('<span class="mono">01</span>', '<b>한눈에 · 한국어</b>', '영어 README를 세 줄 한국어 핵심으로'),
            ('<span class="mono">02</span>', '<b>나에게 적용하면</b>', '고른 역할과 목적 기준으로 바로 쓸 방법 두 가지'),
            ('<span class="mono">03</span>', '<b>여기서 막힐 수 있어요</b>', '설치 · 라이선스처럼 실제로 걸리는 지점'),
            ('<span class="mono">04</span>', '<b>이 자료로 가기</b>', 'GitHub 원본으로 바로 이동'),
        ]),
        sh('Fallback.', '04 · Live & fallback', '실패해도 앱은 멈추지 않게.'),
        '<div class="rows"><div class="hd mono"><span>Live</span><span>실시간 분석</span></div><div class="cz" style="border-top:0"><span class="mono">Flow</span><p class="big">실패하면<br>캐시 매칭으로 바로 전환.</p>' + flow(['주소 입력', 'README 수집', '정제 · 8,000자', 'Claude Haiku', '한국어 정리'], True) + '</div></div>',
        tbl2('126px 300px 1fr', ['', 'Fallback', '확인'], [
            ('<span class="mono">01</span>', '<b>no_key</b>', 'API 키 없음'),
            ('<span class="mono">02</span>', '<b>bad_url</b>', '잘못된 주소'),
            ('<span class="mono">03</span>', '<b>repo_not_found</b>', '없는 레포'),
            ('<span class="mono">04</span>', '<b>rate_limited_ip</b>', '하루 5회 초과'),
            ('<span class="mono">05</span>', '<b>parse_failed</b>', '정리 결과 해석 실패'),
        ]),
        f'<div class="shot"><div class="hd mono"><span>Fig. 03 · Fallback</span><span>캐시 매칭 · 비슷한 자료</span></div><div class="im"><img src="{img("gitmate", "similar")}" style="width:1000px"></div></div>',
        '''<div class="grid3"><div class="box ink"><div class="hd mono"><span>Limit 01</span><span>IP</span></div><div class="bd"><h3>IP당 하루 5회</h3><p>위조할 수 있는 x-forwarded-for 대신 x-real-ip 기준.</p></div></div>
<div class="box"><div class="hd mono"><span>Limit 02</span><span>Total</span></div><div class="bd"><h3>전체 하루 200회</h3><p>서비스 전체 총량의 상한.</p></div></div>
<div class="box"><div class="hd mono"><span>Limit 03</span><span>Cache</span></div><div class="bd"><h3>결과 캐시</h3><p>같은 주소 · 역할 · 목적이면 Claude 재호출 없음.</p></div></div></div>''',
        sh('Proof.', '05 · Proof', '검증한 것과 가설은 따로.'),
        proof([
            ('실측', '5/5', True, '폴백 경로 다섯 개 모두 직접 재현해 확인.', '키 없음 · 주소 · 레포 · 횟수 · 해석.'),
            ('실측', '4', True, '실제 호출로 끝까지 확인한 자료.', 'whisper · excalidraw · tldraw · lucide.'),
            ('실측', '0', True, '콘솔 앱 에러.', '헤드리스 브라우저 캡처 기준.'),
            ('출처', 'Live', True, '라이브 배포.', 'gitmate-navy.vercel.app'),
        ], '기획부터 배포까지 직접. Crew로 단계를 나눠 진행, 판단은 직접.'),
        sh('Limits.', '06 · Limits', '확인하지 못한 것.'),
        limits('"되묻기가 줄어든다"는 실사용 데이터로 검증하지 않은 가설. 따로 알리지 않아 방문 데이터도 의미 있는 규모 아님.', '다음은 실제 사용자에게서<br>되묻기가 줄어드는지 확인하는 것.'),
    ],
    next=("Dr's Solution", 'B2B 운영 웹 · 2026', 'Case 01'),
)

for key, c in CASES.items():
    (OUT / f'case-{key}.built.html').write_text(page(c))
    print(key, (OUT / f'case-{key}.built.html').stat().st_size // 1024, 'KB')

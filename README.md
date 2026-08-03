# 삼척 1박 2일 여행 대시보드

2026.08.11(화) ~ 08.12(수) · 모바일 웹앱

🔗 **배포 주소** — https://samcheok-trip-iota.vercel.app
📦 **저장소** — https://github.com/parkdohhan/samcheok-trip

## 구조

```
index.html          화면 뼈대 (카테고리별 view 7개)
assets/data.js      ← 여행 정보 전부 (여기만 고치면 됨)
assets/style.css    디자인
assets/app.js       렌더링 · 탭 전환 로직
vercel.json         배포 설정
```

## 화면 구성

한 페이지에 전부 나열하지 않고, **하단 탭 바**로 카테고리를 나눠 놓았습니다.

| 탭 | 내용 |
|---|---|
| 🏠 한눈에 | 히어로 · D-DAY · 확정 예약 · 카테고리 바로가기 + 준비 현황 |
| 🗓️ 일정 | Day 1 / Day 2 타임라인 |
| 🗺️ 지도 | Leaflet 지도 · 날짜/카테고리 필터 · 장소 목록 |
| 🏨 숙박 | 숙소 상세 · 전화 · 카카오맵 · 주소 복사 |
| 🍜 맛집 | 대표 음식 표 · 후보 목록 |
| 💰 예산 | 항목별 표 · 합계 |
| 🎒 준비물 | 체크리스트 (localStorage 저장) |

- 탭은 주소창 해시로 기억됩니다 (`#plan`, `#map` …) — 링크로 특정 탭 바로 공유 가능
- 탭 목록을 바꾸려면 `assets/app.js` 의 `VIEWS` 배열 + `index.html` 의 `data-view` 섹션을 같이 수정
- 지도는 '지도' 탭을 처음 열 때 초기화됩니다 (숨겨진 채로 만들면 크기가 깨져서)

## 로컬에서 보기

```bash
npx serve .
```

또는 `index.html` 을 브라우저로 바로 열어도 됩니다.

## 배포 (설정 완료됨)

GitHub 저장소가 Vercel 프로젝트 `samcheok-trip` 에 연결돼 있습니다.
**`main` 에 push 하면 자동으로 프로덕션 재배포됩니다.**

```bash
cd e:\Trip_plan
# assets/data.js 수정 후
git add -A
git commit -m "일정 추가"
git push
```

수동으로 즉시 배포하고 싶으면:

```bash
vercel --prod
```

빌드 설정은 없습니다 (정적 사이트, Framework Preset = **Other**). `vercel.json` 이 캐시 헤더만 잡아줍니다.

### 참고

- 무료 도메인: `https://samcheok-trip-iota.vercel.app`
- 폰에서 열고 **홈 화면에 추가** 하면 앱처럼 전체화면으로 뜹니다
- `.vercel/`, `.env.local` 은 `.gitignore` 로 제외됩니다 (Vercel 토큰 포함되므로 커밋 금지)

## 비밀번호

`assets/data.js` → `meta.password` (현재 `0811`)

> 클라이언트 사이드 잠금이라 진짜 보안은 아닙니다. 링크를 아는 사람만 막는 용도.
> 소스를 보면 비밀번호가 그대로 보이니, 민감한 정보(카드번호 등)는 넣지 마세요.
> 한 번 입력하면 브라우저에 기억됩니다(localStorage).

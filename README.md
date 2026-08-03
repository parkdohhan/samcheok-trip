# 삼척 1박 2일 여행 대시보드

2026.08.11(화) ~ 08.12(수) · 모바일 웹앱

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

## Vercel 배포

### 방법 A — CLI (git 저장소 없이 바로 올리기, 제일 빠름)

```bash
npm i -g vercel     # 최초 1회
cd e:\Trip_plan
vercel login        # 이메일/깃허브 계정으로 로그인
vercel              # 미리보기 URL 생성
vercel --prod       # 실서비스 URL로 배포
```

`vercel` 첫 실행 시 물어보는 것들 — 전부 기본값(엔터)으로 넘기면 됩니다.

```
Set up and deploy? ................ Y
Which scope? ...................... (본인 계정 선택)
Link to existing project? ......... N
Project name? ..................... trip-plan   (URL이 됨)
In which directory is your code? .. ./
Modify these settings? ............ N
```

Framework Preset 은 **Other**, 빌드 명령·아웃풋 디렉터리는 비워둡니다 (정적 사이트라 빌드 없음).

### 방법 B — GitHub 연동 (푸시할 때마다 자동 배포)

```bash
cd e:\Trip_plan
git init
git add .
git commit -m "삼척 여행 대시보드"
git branch -M main
git remote add origin https://github.com/<계정>/<저장소>.git
git push -u origin main
```

그다음 [vercel.com/new](https://vercel.com/new) → 저장소 Import → Framework Preset **Other** → Deploy.
이후 `git push` 만 하면 자동 재배포됩니다.

### 배포 후

- 무료 도메인: `https://<프로젝트명>.vercel.app`
- 내용 수정은 `assets/data.js` 만 고치고 → `vercel --prod` (또는 `git push`)
- 폰에서 열고 **홈 화면에 추가** 하면 앱처럼 전체화면으로 뜹니다

## 비밀번호

`assets/data.js` → `meta.password` (현재 `0811`)

> 클라이언트 사이드 잠금이라 진짜 보안은 아닙니다. 링크를 아는 사람만 막는 용도.
> 소스를 보면 비밀번호가 그대로 보이니, 민감한 정보(카드번호 등)는 넣지 마세요.
> 한 번 입력하면 브라우저에 기억됩니다(localStorage).

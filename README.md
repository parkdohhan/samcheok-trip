# 여행 대시보드

여행별 모바일 웹앱.

| 여행 | 주소 | 기간 |
|---|---|---|
| ♨️ **후쿠오카·벳푸 3박 4일** (가족 27명) | https://tripeasys.com | 2026.12.03(목) ~ 12.06(일) |
| 🐠 세부 5박 6일 (지난 여행) | https://tripeasys.com/cebu/ | 2026.10.01(목) ~ 10.07(수) |
| 🌺 오키나와 3박 4일 (지난 여행) | https://tripeasys.com/okinawa/ | 2026.08.31(월) ~ 09.03(목) |
| 🌊 삼척 1박 2일 (지난 여행) | https://tripeasys.com/samcheok/ | 2026.08.11(화) ~ 08.12(수) |

> 오키나와는 `okinawa` 브랜치에도 당시 상태 그대로 스냅샷이 있습니다.

📦 **저장소** — https://github.com/parkdohhan/samcheok-trip

> 저장소·Vercel 프로젝트 이름은 처음 만든 삼척 여행에서 온 것이라 `samcheok-trip` 그대로이고,
> `samcheok-trip-iota.vercel.app` 로도 같은 사이트가 뜹니다.
> 루트(`/`)가 현재 진행 중인 여행, 지난 여행은 하위 폴더로 내려갑니다.

## 구조

```
index.html          ← 현재 여행(후쿠오카) 화면 뼈대
data.js             ← 후쿠오카 여행 정보 전부 (여기만 고치면 됨)
app/app.js          후쿠오카 전용 로직 — 이름 로그인 · Supabase 개인 준비물/메모
app/style.css       후쿠오카 전용 디자인 (공용 + 추가분)
reference/          더데이투어 견적서 · 참석자 명단 원본 이미지

assets/app.js       지난 여행 3개가 함께 쓰는 공용 로직
assets/style.css    지난 여행 공용 디자인
cebu/               세부 (지난 여행 · ../assets/ 참조)
okinawa/            오키나와 (지난 여행 · ../assets/ 참조)
samcheok/           삼척 (지난 여행 · ../assets/ 참조)
serve.js            로컬 미리보기 서버
vercel.json         배포 설정
```

`assets/` 는 끝난 여행 3개가 같이 쓰는 공용 파일이라 건드릴 일이 거의 없습니다.
현재 여행은 `app/` 에 자기 로직을 따로 들고 있습니다 — 이름 로그인과 Supabase 때문입니다.

### 새 여행 추가하기

1. 지금 루트에 있는 여행을 `이전여행이름/` 폴더로 옮기고, 그 `index.html` 의 경로를
   `../assets/style.css` · `./data.js` · `../assets/app.js` 로 바꿉니다
   (현재 여행이 `app/` 을 쓰고 있었다면 공용 `assets/` 를 가리키게 바꿔주면 됩니다)
2. 새 여행의 `index.html` 과 `data.js` 를 루트에 둡니다
3. `vercel.json` 에 새 하위 폴더의 캐시 헤더·리다이렉트 규칙을 추가합니다
4. `data.js` 의 `meta.storeKey` 를 **여행마다 다르게** 지정합니다
   (안 그러면 체크리스트 체크 상태가 다른 여행과 섞입니다)

## 후쿠오카만 다른 점 — 이름 로그인 + Supabase

다른 여행은 비밀번호 하나를 같이 쓰지만, 후쿠오카는 **본인 이름으로 들어갑니다.**
준비물과 메모가 사람마다 따로 저장돼야 해서입니다.

```
fukuoka_people      참석자 명단 27명 (이름 · 가족번호 · 별칭)
fukuoka_checklist   사람별 준비물 (추가 · 삭제 · 체크)
fukuoka_memo        사람별 메모 (입력 멈추면 자동 저장)
```

- Supabase 프로젝트 `Dohhani_Thinker` (서울 리전) 안에 `fukuoka_` 접두사로 들어 있습니다
- 처음 들어온 사람에게는 `data.js` 의 `prepDefaults` 가 한 번만 복사됩니다
- 그 뒤 추가·삭제·체크는 **그 사람 행에만** 반영됩니다
- `data.js` 의 `meta.authMode: "name"` 이 이름 로그인 스위치입니다

> ⚠️ 이름 입력은 **인증이 아니라 선택**입니다. 링크를 아는 사람은 누구 이름으로든 들어가
> 그 사람 준비물과 메모를 보고 고칠 수 있습니다. 가족끼리 쓰는 용도라 이렇게 뒀습니다 —
> 민감한 내용은 적지 마세요. 브라우저에 들어가는 키도 공개(publishable)용 키입니다.

도메인 `tripeasys.com` 이 이 프로젝트에 연결돼 있고, 루트가 곧 후쿠오카 화면입니다.
예전에 공유한 `/fukuoka/` 링크는 `vercel.json` 리다이렉트로 루트로 넘어갑니다.

## 화면 구성

한 페이지에 전부 나열하지 않고, **하단 탭 바**로 카테고리를 나눠 놓았습니다.

| 탭 | 내용 |
|---|---|
| 🏠 한눈에 | 히어로 · D-DAY · 확정 예약 · 카테고리 바로가기 + 준비 현황 |
| 🗓️ 일정 | Day별 타임라인 |
| 🗺️ 지도 | Leaflet 지도 · 날짜/카테고리 필터 · 장소 목록 |
| 🏨 숙박 | 숙소 상세 · 전화 · 지도 · 주소 복사 |
| 🍜 맛집 | 대표 음식 표 · 후보 목록 |
| 🎒 준비물 | 체크리스트 (localStorage 저장) |

- 탭은 주소창 해시로 기억됩니다 (`#plan`, `#map` …) — 링크로 특정 탭 바로 공유 가능
- 상단바 왼쪽 `‹` 버튼으로 이전 화면 복귀 — 앱 안에 이력이 없으면 홈으로 (페이지 밖으로 나가지 않음)
- 탭 목록을 바꾸려면 `assets/app.js` 의 `VIEWS` 배열 + `index.html` 의 `data-view` 섹션을 같이 수정
- 지도는 '지도' 탭을 처음 열 때 초기화됩니다 (숨겨진 채로 만들면 크기가 깨져서)

## 로컬에서 보기

```bash
node serve.js
```

- 후쿠오카 → http://localhost:5173
- 세부 → http://localhost:5173/cebu/
- 오키나와 → http://localhost:5173/okinawa/
- 삼척 → http://localhost:5173/samcheok/

`index.html` 을 브라우저로 바로 열어도(`file://`) 동작합니다.

## 배포 (설정 완료됨)

GitHub 저장소가 Vercel 프로젝트 `samcheok-trip` 에 연결돼 있습니다.
**`main` 에 push 하면 자동으로 프로덕션 재배포됩니다.**

```bash
# data.js 수정 후
git add -A
git commit -m "일정 추가"
git push
```

빌드 설정은 없습니다 (정적 사이트, Framework Preset = **Other**). `vercel.json` 이 캐시 헤더만 잡아줍니다.

### 참고

- 폰에서 열고 **홈 화면에 추가** 하면 앱처럼 전체화면으로 뜹니다
- `.vercel/`, `.env.local` 은 `.gitignore` 로 제외됩니다 (Vercel 토큰 포함되므로 커밋 금지)

## 비밀번호

각 여행의 `data.js` → `meta.password` (세부 `1001`, 오키나와 `0831`, 삼척 `0811`)

후쿠오카는 비밀번호가 없습니다 — 명단에 있는 **본인 이름**을 입력합니다.

> 클라이언트 사이드 잠금이라 진짜 보안은 아닙니다. 링크를 아는 사람만 막는 용도.
> 소스를 보면 비밀번호가 그대로 보이니, 민감한 정보(카드번호·여권번호 등)는 넣지 마세요.
> 한 번 입력하면 브라우저에 기억됩니다(localStorage).

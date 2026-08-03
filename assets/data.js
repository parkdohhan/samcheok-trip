/* =========================================================
   삼척 여행 데이터
   ─ 여기 값만 고치면 화면이 전부 바뀝니다.
   ─ 아직 안 정해진 항목은 빈 배열 [] / 빈 문자열 "" 로 두세요.
   ========================================================= */

const TRIP = {

  /* ---------- 1. 기본 정보 ---------- */
  meta: {
    password: "0811",                 // 접근 비밀번호
    badge: "2026 SUMMER",             // 히어로 상단 작은 라벨
    title: "삼척 1박 2일",            // 큰 제목 (줄바꿈은 \n)
    subtitle: "",                     // 제목 둘째 줄 (예: "바다 & 휴식")
    desc: "",                         // 한 줄 소개 — 아직 미정
    startDate: "2026-08-11",          // 출발일
    endDate:   "2026-08-12",          // 도착일
    departText: "",                   // 예: "출발일 · 2026년 8월 11일 (화) · 서울 07:00 출발"
    chips: [                          // 요약 칩 (히어로 하단)
      "8/11(화) ~ 8/12(수)",
      "1박 2일",
      "삼척 코아페바다펜션 1박"
    ],
    files: []                         // 예: [{ icon:"🗓️", name:"일정표" }] — 안 쓰면 빈 배열
  },

  /* ---------- 2. 확정 예약 ---------- */
  /* type: flight | hotel | car | parking | train | etc  */
  bookings: [
    {
      type: "hotel",
      title: "삼척 코아페바다펜션",
      lines: [
        "2026-08-11 ~ 08-12 · 체크인 15:00 / 체크아웃 11:00 · 1박",
        "강원 삼척시 근덕면 용화길 27-34",
        "☎ 0507-0380-2075"
      ],
      price: "",                      // 예: "₩150,000"
      tel: "050703802075",
      addr: "강원 삼척시 근덕면 용화길 27-34"
    }
  ],

  /* ---------- 3. 일정 ---------- */
  /* items: { time, text, tag }  tag → 아래 CATEGORIES 키 */
  days: [
    {
      id: "d1",
      label: "Day 1",
      date: "2026-08-11",
      dow: "화",
      title: "",                      // 예: "출발 & 용화 바다"
      summary: "",                    // 한 줄 요약
      items: []                       // 예: [{ time:"07:00", text:"서울 출발", tag:"transport" }]
    },
    {
      id: "d2",
      label: "Day 2",
      date: "2026-08-12",
      dow: "수",
      title: "",
      summary: "",
      items: []
    }
  ],

  /* ---------- 4. 지도 장소 ---------- */
  /* { name, cat, day:["d1"], lat, lng, memo } */
  places: [
    {
      name: "삼척 코아페바다펜션",
      cat: "stay",
      day: ["d1", "d2"],
      lat: 37.3186,                   // ※ 대략 좌표 — 정확한 핀은 확인 후 수정
      lng: 129.2648,
      memo: "강원 삼척시 근덕면 용화길 27-34 · 입실 15:00 / 퇴실 11:00"
    }
  ],
  mapNote: "",                        // 예: "전체 여행 동선 · 약 000km · 1박 2일"

  /* ---------- 5. 맛집 ---------- */
  food: {
    localTitle: "삼척 대표 음식",
    local: [],                        // [{ name:"곰치국", desc:"해장 국물" }]
    candidates: [],                   // [{ name:"○○식당", cat:"식당", memo:"물회" }]
    note: ""
  },

  /* ---------- 6. 예산 ---------- */
  budget: {
    rows: [],                         // [{ name:"숙소", amount:150000, memo:"1박" }]
    total: ""                         // 비워두면 rows 합계 자동 계산
  },

  /* ---------- 7. 준비물 ---------- */
  checklist: [
    {
      group: "📄 필수",
      icon: "",
      items: ["신분증", "운전면허증", "예약 확인 문자"]
    },
    {
      group: "💳 결제 수단",
      items: ["신용카드", "현금 약간"]
    },
    {
      group: "🏖️ 바다 준비물",
      items: []
    },
    {
      group: "🧳 개인 물품",
      items: []
    }
  ],

  /* ---------- 8. 푸터 ---------- */
  footer: "🌊 삼척 1박 2일 · 2026.08.11 ~ 08.12"
};

/* 카테고리 정의 (지도 필터 · 일정 태그 공용) */
const CATEGORIES = {
  food:      { label: "식당",     icon: "🍽️", color: "#e8734a" },
  cafe:      { label: "카페",     icon: "☕",  color: "#8b6b4f" },
  spot:      { label: "관광",     icon: "🌸",  color: "#e05c8a" },
  drive:     { label: "드라이브", icon: "🚗",  color: "#5b7fd4" },
  shop:      { label: "쇼핑",     icon: "🛍️", color: "#c76fd4" },
  stay:      { label: "숙소",     icon: "🏨",  color: "#2f9e8f" },
  point:     { label: "시작/종료", icon: "🏠", color: "#6b7a90" },
  transport: { label: "교통",     icon: "🚆",  color: "#3b8fd4" },
  parking:   { label: "주차",     icon: "🅿️", color: "#4a6fa5" },
  gas:       { label: "주유",     icon: "⛽",  color: "#d4574a" },
  beach:     { label: "바다",     icon: "🏖️", color: "#20a4c9" },
  rest:      { label: "휴게소",   icon: "🛣️", color: "#7a8a99" }
};

/* =========================================================
   오키나와 3박 4일 여행 데이터
   ─ 여기 값만 고치면 화면이 전부 바뀝니다.
   ─ 아직 안 정해진 항목은 빈 배열 [] / 빈 문자열 "" 로 두세요.
   ========================================================= */

const TRIP = {

  /* ---------- 1. 기본 정보 ---------- */
  meta: {
    storeKey: "okinawa-2026-08",      // localStorage 네임스페이스 (여행마다 달라야 함)
    password: "0831",                 // 접근 비밀번호
    mapProvider: "google",            // 일본 주소는 카카오맵이 못 찾습니다
    emoji: "🌺",                      // 배너·타이틀용
    badge: "2026 OKINAWA",
    title: "오키나와 3박 4일",
    subtitle: "바다 & 드라이브",
    desc: "나하에서 이틀, 남부 바닷가에서 하루 — 렌터카로 도는 오키나와 본섬",
    startDate: "2026-08-31",
    endDate:   "2026-09-03",
    departText: "출발일 · 2026년 8월 31일 (월) · 인천 T2 09:20 출발 → 나하 11:50 도착 (KE2147)",
    chips: [
      "8/31(월) ~ 9/3(목)",
      "3박 4일",
      "KE2147 / KE5490",
      "나하 2박 · 난조 1박",
      "렌터카 + 일부 투어",
      "🤿 존만비치 · 케라마 · 푸른동굴"
    ],
    files: []
  },

  /* ---------- 2. 확정 예약 ---------- */
  /* type: flight | hotel | car | parking | train | etc  */
  bookings: [
    {
      type: "flight",
      title: "가는 편 · KE2147 (대한항공)",
      lines: [
        "8/31(월) 09:20 인천 T2 (ICN) → 11:50 나하 (OKA) · 2시간 30분",
        "일반석 · Q 클래스 · 에어버스 A321neo (중형) · 기내식",
        "※ 모든 시간은 현지 시간 기준"
      ],
      price: "",
      tel: "",
      addr: ""
    },
    {
      type: "flight",
      title: "오는 편 · KE5490 (아시아나 OZ171 운항)",
      lines: [
        "9/3(목) 18:15 나하 (OKA) → 20:35 인천 T2 (ICN) · 2시간 20분",
        "일반석 · U 클래스 · 에어버스 A321neo (중형) · 기내식",
        "공동운항편 — 체크인 카운터는 아시아나 기준으로 확인"
      ],
      price: "",
      tel: "",
      addr: ""
    },
    {
      type: "parking",
      title: "인천공항 T2 장기주차장",
      lines: [
        "차량번호 215소3377 · 발렛은 불가라 장기주차장 이용 (예약 없이 현장 입차)",
        "8/31(월) 07:00 입차 → 9/3(목) 20:35 출차 · 4일",
        "주차 후 셔틀버스로 T2 터미널까지 약 10분 — 출발 2시간 전 체크인 감안해 07:00 도착",
        "⚠️ 주차 위치(구역·기둥 번호) 사진 찍어두기 · 요금은 출차 때 정산",
        "성수기라 만차 가능성 — 만차면 안내에 따라 예비 주차장 + 셔틀"
      ],
      price: "",
      tel: "",
      addr: "인천국제공항 제2여객터미널"
    },
    {
      type: "car",
      title: "렌터카 · FlightRent-a-Car (플라이트 렌터카)",
      lines: [
        "도요타 야리스 크로스 또는 동급 · 콤팩트 SUV · 자동 · 5인승 · 캐리어 3개",
        "인수 8/31(월) 13:00 → 반납 9/3(목) 15:00 · 4일",
        "Out Of Naha Airport — 259-57 Nakachi, Tomigusuku (名嘉地) · 공항 밖",
        "터미널 외부에서 무료 셔틀 약 15분 ⚠️ 사전 연락 필요",
        "영업 08:00~20:00 · 19:01~20:00 인수/반납은 사전 문의 + 약 ¥10,000 별도",
        "항공편 지연 시 예약은 인수 당일 16:00까지 유지",
        "포함: 무제한 주행거리 · 가득 채워 대여&반납 · 추가 운전자 1명 · GPS · 휴대폰 거치대 · 긴급출동",
        "인수 시: 여권 + 국제운전면허증 + 본국 면허증 + 주 운전자 명의 신용카드 + 예약 바우처 ❗",
        "좌측통행 ⚠️"
      ],
      price: "",
      tel: "",
      addr: "259-57 Nakachi, Tomigusuku, Okinawa 901-0235, Japan"
    },
    {
      type: "ferry",
      title: "케라마 · 토카시키섬 당일 투어 (조인 투어)",
      lines: [
        "9/1(화) 08:40 집합 → 17:10 해산 · 나하 미에구스쿠항(三重城港)",
        "배 편도 약 1시간 10분 · 섬 체류 약 5시간 · 항구↔해변 셔틀 15분 / 복귀 전용 차량 20분",
        "포함: 점심(일식 카레라이스) · 스노클링은 신청자 대상",
        "조인 투어 · 최대 66명 · 접수 언어 중국어/일본어/영어 (한국어 불가)",
        "⚠️ 배·셔틀에 큰 짐 둘 공간 없음 — 작은 가방만",
        "⚠️ 기상으로 체류 단축·변경·연기 시 환불 불가"
      ],
      price: "",
      tel: "",
      addr: "三重城港, 那覇市西3丁目"
    },
    {
      type: "dive",
      title: "청의 동굴 체험 다이빙 & 스노클링 (마에다곶)",
      lines: [
        "9/2(수) 10:00 시작 · 2시간 · 성인 2명 · 영어 강사 · 해변 입수",
        "✅ 예약 확정 (샵 컨펌 완료)",
        "집합은 시작 20분 전(09:40) · 전자 바우처 또는 예약자 성함으로 체크인",
        "예약번호 1400828757260740 · 조건부 취소 가능",
        "샵 연락은 메신저(WhatsApp/WeChat/LINE) · +82 10 2288 0416",
        "⚠️ 픽업/샌딩 미포함 — 렌터카로 직접 이동",
        "불포함: 수중 카메라 대여(약 3,000엔) · 식사 등 개인 경비"
      ],
      price: "₩230,516 (₩115,258 x2 · BC카드)",
      tel: "",
      addr: "真栄田岬, 恩納村"
    }
  ],

  /* ---------- 2-1. 숙소 상세 (숙박 탭) ---------- */
  /* rows 의 value 가 "" 이면 화면에 '미확정' 으로 흐리게 표시됩니다 */
  stayNote: "3박 · 나하 2박 + 난조(남부) 1박",
  stays: [
    {
      nights: "1~2박째 · 8/31(월) ~ 9/2(수)",
      title: "宿「휴일」(宿「休日」) · 에어비앤비",
      addr: "1-chome-24-1 Matsuyama, Naha, Okinawa 900-0032, Japan",
      tel: "",
      rows: [
        { label: "주소",   value: "〒900-0032 沖縄県那覇市松山1-24-1 · 宿「休日」" },
        { label: "객실",   value: "게스트 정원 8명 (2명 이용) · 금연 · 반려동물 불가 · 가족탕(개인 욕조) 있음" },
        { label: "체크인", value: "16:00 이후 / 체크아웃 11:00 이전 · 셀프 체크인 (스마트 도어록)" },
        { label: "예약",   value: "에어비앤비 · 실제 거주 중인 집이라 시설 조심히 사용" },
        { label: "연락처", value: "" },
        { label: "주차",   value: "" },
        { label: "규칙",   value: "❗ 욕조 물을 빼지 말 것 — 순환식이라 물이 없으면 고장납니다 (체크인 전 청소 완료됨) · 소음 제한 22:00~06:00 · 금연" },
        { label: "접근",   value: "유이레일 현청앞역(県庁前駅) 도보권 · 국제거리 도보 10분 내외" },
        { label: "메모",   value: "" }
      ]
    },
    {
      nights: "3박째 · 9/2(수) ~ 9/3(목)",
      title: "햐쿠나가란 (百名伽藍) ★5",
      addr: "沖縄県南城市玉城字百名山下原1299-1",
      tel: "+81989491011",
      rows: [
        { label: "주소",   value: "〒901-0603 沖縄県南城市玉城字百名山下原1299-1 (난조시 다마구스쿠 햐쿠나 야마시타바루)" },
        { label: "객실",   value: "프레지덴셜 스위트 · 바다 전망(센가이) · 단독 사용 스위트룸 · 금연 · 정원 4명 (성인 2명 예약)" },
        { label: "체크인", value: "15:00 ~ 21:30 / 체크아웃 11:00까지" },
        { label: "식사",   value: "조식 + 석식 모두 요금에 포함 ✅ — 9/2 저녁·9/3 아침은 따로 안 잡아도 됩니다" },
        { label: "예약",   value: "성인 2명 · 1박 · 객실 1개 · 투숙객명 park sojung" },
        { label: "연락처", value: "+81 98-949-1011" },
        { label: "주차",   value: "" },
        { label: "설비",   value: "전용 욕실 · 발코니 · 테라스 · 바다 전망 · 안뜰 전망 · 목욕 가운 · 욕조/샤워 · 비데 · 에어컨 · 안전 금고 · 침대 근처 콘센트" },
        { label: "접근",   value: "나하공항에서 차로 약 35분 · 전 객실 오션프론트 (18실)" },
        { label: "메모",   value: "" }
      ]
    }
  ],

  /* ---------- 3. 일정 ---------- */
  days: [
    {
      id: "d1",
      label: "Day 1",
      date: "2026-08-31",
      dow: "월",
      title: "나하 도착 & 슈리성 · 국제거리",
      summary: "인천 09:20 → 나하 11:50 → 슈리성 → 16:10 체크인 → 국제거리·마키시 밤 산책 → 21:00 류큐노우시",
      items: [
        { time: "07:00", text: "인천공항 T2 장기주차장 입차 → 셔틀버스로 터미널 (약 10분) · 주차 위치 사진", tag: "car" },
        { time: "07:20", text: "T2 체크인 · 수하물 위탁 (출발 2시간 전)", tag: "transport" },
        { time: "09:20", text: "인천 T2 출발 — KE2147", tag: "transport" },
        { time: "11:50", text: "나하공항 도착 · 입국 수속", tag: "transport" },
        { time: "13:00", text: "렌터카 수령 — 터미널 밖에서 무료 셔틀 15분 ⚠️ 사전 연락 필요\n주 운전자 명의 신용카드 + 국제·본국 면허증 + 여권 + 바우처 지참", tag: "car" },
        { time: "13:30", text: "슈리로 이동 (약 30분) — 첫 운전이니 천천히 · 주차는 슈리성 공원 首里杜館(스이무이칸) 지하 주차장\n⚠️ 캐리어는 트렁크에 넣고 잠그기 (체크인 16시 이후)", tag: "car" },
        { time: "14:00", text: "늦은 점심 (미정 — 슈리 일대 오키나와 소바 · 인기집은 14시 전후 품절이 잦아 대안 필요, 맛집 탭 참고)", tag: "food" },
        { time: "14:40", text: "🏯 슈리성 — 슈레이몬 → 정전 구역 약 1시간 · 정전 복원 막바지라 개방 범위는 당일 확인 · 유료 구역 입장은 폐관 30분 전까지", tag: "spot" },
        { time: "15:50", text: "슈리 → 마츠야마 숙소 (약 20분) · 숙소 주차 미확정 — 근처 코인파킹", tag: "car" },
        { time: "16:10", text: "숙소 체크인 (16:00 이후 · 스마트 도어록 셀프 체크인) · 짐 풀고 휴식", tag: "stay" },
        { time: "19:00", text: "🧺 국제거리 · 마키시 공설시장 밤 산책 (숙소에서 도보 10분) — 돈키호테 구경", tag: "market" },
        { time: "", text: "🍎 링고도 국제거리점 — 사과사탕 (돈키호테 안)", tag: "cafe" },
        { time: "21:00", text: "류큐노우시 (琉球の牛) 나하 국제거리점 — 저녁 ✅ 확정 · 예약 필수", tag: "food" }
      ]
    },
    {
      id: "d2",
      label: "Day 2",
      date: "2026-09-01",
      dow: "화",
      title: "케라마 · 토카시키섬 당일 투어",
      summary: "미에구스쿠항 08:40 집합 → 17:10 해산 · 섬 체류 약 5시간 · 점심 포함 · 저녁 19:00 샤브샤브 류큐",
      items: [
        { time: "08:20", text: "숙소 출발 → 미에구스쿠항 (도보 15분 · 차 5분) · 투어 집합이라 렌터카는 두고 가도 됩니다", tag: "car" },
        { time: "08:40", text: "⛴️ 미에구스쿠항 집합 ❗ 예약 바우처 지참 · 접수는 중국어/일본어/영어\n⚠️ 배·셔틀에 큰 짐 둘 공간 없음 — 작은 가방만", tag: "ferry" },
        { time: "", text: "⛴️ 토카시키섬으로 — 배 약 1시간 10분", tag: "ferry" },
        { time: "10:00경", text: "토카시키항 도착 → 셔틀버스 약 15분 → 해변", tag: "ferry" },
        { time: "10:15경", text: "🤿 해변 자유시간 약 5시간 — 해수욕·스노클링(신청자 대상) · 케라마 블루", tag: "beach" },
        { time: "", text: "🍛 점심 ✅ 투어 포함 — 섬에서 일식 카레라이스 (약 20분)", tag: "food" },
        { time: "15:30경", text: "철수 · 샤워 · 전용 차량 약 20분 → 토카시키항", tag: "beach" },
        { time: "", text: "⛴️ 나하로 복귀 — 배 약 1시간", tag: "ferry" },
        { time: "17:10", text: "미에구스쿠항 도착 · 해산 → 숙소 도보 15분", tag: "ferry" },
        { time: "19:00", text: "저녁 ✅ 확정 — 킨아구와 야마시로규 샤브샤브 류큐 본관 (금무아구·산조규)\n예약자 JUHO LEE · 좌석만 예약(코스는 현장 선택) · 테이블석 2~3인 금연석\n⚠️ 전용 주차장 없음 — 숙소에 차 대고 오거나 근처 코인파킹", tag: "food" },
        { time: "", text: "🍎 링고도 국제거리점 — 나하 복귀 후 (숙소 도보권, 2번째)", tag: "cafe" }
      ]
    },
    {
      id: "d3",
      label: "Day 3",
      date: "2026-09-02",
      dow: "수",
      title: "청의 동굴 다이빙 → 남부, 햐쿠나가란",
      summary: "청의 동굴 10:00 체험 다이빙 2시간 → 남부로 이동 · 햐쿠나가란 1박 (석식 포함)",
      items: [
        { time: "08:30", text: "나하 숙소 체크아웃 · 출발 (짐은 차에 · 마에다곶까지 약 1시간)", tag: "stay" },
        { time: "09:40", text: "🤿 집합 ❗ 시작 20분 전 · 전자 바우처 또는 예약자 성함으로 체크인\n⚠️ 픽업 미포함 — 렌터카로 직접", tag: "beach" },
        { time: "10:00", text: "🤿 청의 동굴(마에다곶) 체험 다이빙 & 스노클링 2시간 ✅ 예약 — 영어 강사 · 해변 입수라 멀미 걱정 없음 · 수중 카메라는 별도(약 3,000엔)", tag: "beach" },
        { time: "12:00", text: "종료 · 샤워", tag: "beach" },
        { time: "12:30", text: "점심 (미정 — 온나손 일대 · 맛집 탭 참고)", tag: "food" },
        { time: "14:00", text: "남부로 이동 (약 1시간 20분)", tag: "car" },
        { time: "15:30", text: "햐쿠나가란 체크인 (체크인 가능 15:00~21:30) — 프레지덴셜 스위트 · 바다 전망", tag: "stay" },
        { time: "", text: "숙소에서 석양 · 노천탕", tag: "beach" },
        { time: "", text: "저녁 — 숙소 석식 ✅ 요금에 포함 (따로 예약 불필요)", tag: "food" }
      ]
    },
    {
      id: "d4",
      label: "Day 4",
      date: "2026-09-03",
      dow: "목",
      title: "존만비치 & 귀국",
      summary: "다이빙 스팟 ③ 존만비치 (바다거북) → 렌터카 반납 → 나하 18:15 출발",
      items: [
        { time: "", text: "아침 — 숙소 조식 ✅ 요금에 포함", tag: "food" },
        { time: "09:00", text: "미바루 비치 산책 (숙소 앞, 가볍게)", tag: "beach" },
        { time: "10:30", text: "햐쿠나가란 체크아웃 (조금 일찍)", tag: "stay" },
        { time: "11:10", text: "🤿 존만비치 (오도하마 해안, 차 약 40분) — 바다거북 스노클링 · 물때표 확인 · ⚠️ 저녁 비행이라 수면 위주, 깊은 프리다이빙 금지", tag: "beach" },
        { time: "13:30", text: "철수 · 샤워 후 늦은 점심 (미정)", tag: "food" },
        { time: "14:20", text: "주유 만탱(満タン) — 유종은 주유구 스티커 확인 (가득 채워 반납 조건)", tag: "car" },
        { time: "15:00", text: "렌터카 반납 ❗ 예약 반납 시각 · 늦으면 추가 요금", tag: "car" },
        { time: "15:30", text: "셔틀 15분 → 나하공항 도착 · 체크인 · 출국 수속", tag: "transport" },
        { time: "18:15", text: "나하 출발 — KE5490 (아시아나 OZ171 운항)", tag: "transport" },
        { time: "20:35", text: "인천 T2 도착 → 셔틀버스로 장기주차장 · 출차 정산", tag: "car" }
      ]
    }
  ],

  /* ---------- 4. 지도 장소 ---------- */
  places: [
    /* seq: Day 별 방문 순서. 지도에서 Day 를 고르면 이 순서로 번호가 붙고 동선이 이어집니다.
       한 장소가 여러 Day 에 걸치면 Day 마다 순서가 다를 수 있어서 배열 순서가 아니라 여기서 정합니다.
       time: 그 Day 에 여기 도착하는 시각. 지도에서 번호 아래에 붙습니다 — 일정표에 시각이 없으면 생략하세요. */
    {
      name: "나하공항 (那覇空港)",
      cat: "transport",
      day: ["d1", "d4"],
      seq: { d1: 1, d4: 6 },
      time: { d1: "11:50", d4: "15:30" },
      lat: 26.1967,
      lng: 127.6490,
      memo: "도착 · 렌터카 수령 / 반납 · 출발"
    },
    {
      name: "렌터카 영업소 (FlightRent-a-Car)",
      cat: "car",
      day: ["d1", "d4"],
      seq: { d1: 2, d4: 5 },
      time: { d1: "13:00", d4: "15:00" },
      lat: 26.1783,                   // ※ 名嘉地 기준 대략 좌표
      lng: 127.6665,
      memo: "Out Of Naha Airport · 259-57 Nakachi, Tomigusuku · 공항에서 무료 셔틀 15분(사전 연락) · 영업 08:00~20:00"
    },
    {
      name: "나하 마츠야마 숙소",
      cat: "stay",
      day: ["d1", "d2", "d3"],
      seq: { d1: 4, d2: 1, d3: 1 },
      time: { d1: "16:10", d2: "08:20", d3: "08:30" },
      lat: 26.2170,                   // ※ 마츠야마 1가 기준 대략 좌표
      lng: 127.6790,
      memo: "那覇市松山1-24-1 · 8/31~9/2 2박 · 현청앞역 도보권"
    },
    {
      name: "🥩 샤브샤브 류큐 본관 (しゃぶしゃぶ琉球 本館)",
      cat: "food",
      day: ["d2"],
      seq: { d2: 5 },
      time: { d2: "19:00" },
      lat: 26.2153,                   // ※ 牧志3丁目 기준 대략 좌표
      lng: 127.6902,
      memo: "9/1 19:00 · 금무아구 + 산조규 샤브샤브 · 那覇市牧志3-11-2-102 · 17:00~23:00(L.O.22:00) · 52석 · ⚠️ 주차장 없음 · 마키시·미에바시역 도보 9분"
    },
    {
      name: "🍎 링고도 (林檎堂) 국제거리점",
      cat: "cafe",
      day: ["d1", "d2", "d4"],
      seq: { d1: 6, d2: 6, d4: 4 },
      time: { d1: "19:30" },
      lat: 26.2151,                   // ※ 돈키호테 국제거리점 기준
      lng: 127.6840,
      memo: "사과사탕(りんご飴) 전문점 · 돈키호테 국제거리점 안 · 국제거리 지나갈 때마다 들르기"
    },
    {
      name: "🧺 마키시 공설시장 (第一牧志公設市場)",
      cat: "market",
      day: ["d1"],
      seq: { d1: 5 },
      time: { d1: "19:00" },
      lat: 26.2143,                   // ※ 대략 좌표
      lng: 127.6886,
      memo: "국제거리에서 도보 3분 · 1층 해산물·2층 식당가(산 것 바로 조리) · 코인파킹은 시장 주변에 여럿"
    },
    {
      name: "🏯 슈리성 (首里城)",
      cat: "spot",
      day: ["d1"],
      seq: { d1: 3 },
      time: { d1: "14:40" },
      lat: 26.2170,                   // ※ 首里杜館 주차장 기준 대략 좌표
      lng: 127.7160,
      memo: "렌터카 영업소에서 차 30분 · 주차는 首里杜館 지하(유료) · 정전 복원 막바지 — 개방 범위 당일 확인 · 숙소까지 차 20분"
    },
    {
      name: "류큐노우시 (琉球の牛) 나하 국제거리점",
      cat: "food",
      day: ["d1"],
      seq: { d1: 7 },
      time: { d1: "21:00" },
      lat: 26.2163,
      lng: 127.6892,
      memo: "8/31 21:00 · 아구돼지·오키나와 와규 야키니쿠 · 국제거리(마키시 2가) · 예약 필수"
    },
    {
      name: "🤿 푸른동굴 · 마에다곶 (真栄田岬)",
      cat: "beach",
      day: ["d3"],
      seq: { d3: 2 },
      time: { d3: "10:00" },
      lat: 26.4453,
      lng: 127.7716,
      memo: "다이빙 스팟 ③ · 온나손 · 나하에서 차 약 1시간 · 9/2 10:00 체험 다이빙 2시간(집합 09:40) · 픽업 미포함 · 파도 시 계단 폐쇄 → 보트 입수"
    },
    {
      name: "햐쿠나가란 (百名伽藍)",
      cat: "stay",
      day: ["d3", "d4"],
      seq: { d3: 3, d4: 1 },
      time: { d3: "15:30" },
      lat: 26.1378,                   // ※ 百名ビーチ 기준 대략 좌표
      lng: 127.7945,
      memo: "南城市玉城字百名山下原1299-1 · 9/2~9/3 1박 · 전 객실 오션프론트"
    },
    {
      name: "미바루 비치 (新原ビーチ)",
      cat: "beach",
      day: ["d4"],
      seq: { d4: 2 },
      time: { d4: "09:00" },
      lat: 26.1337,
      lng: 127.7891,
      memo: "햐쿠나가란 바로 앞 해변 · 글라스보트 · 체크아웃 후 바로"
    },
    {
      name: "⛴️ 미에구스쿠항 (三重城港·Miegusuku Port)",
      cat: "ferry",
      day: ["d2"],
      seq: { d2: 2 },
      time: { d2: "08:40" },
      lat: 26.2183,                   // ※ 那覇市西3丁目 기준 대략 좌표
      lng: 127.6672,
      memo: "케라마 투어 집합·해산 · 08:40 집합 / 17:10 복귀 · 숙소에서 도보 15분(차 5분)"
    },
    {
      name: "⛴️ 토카시키항 (渡嘉敷港)",
      cat: "ferry",
      day: ["d2"],
      seq: { d2: 3 },
      time: { d2: "10:00경" },
      lat: 26.1991,
      lng: 127.3695,
      memo: "투어 배 도착 10:00경 · 해변까지 셔틀버스 약 15분 / 복귀는 전용 차량 약 20분"
    },
    {
      name: "🤿 아하렌 비치 (阿波連ビーチ·토카시키섬)",
      cat: "beach",
      day: ["d2"],
      seq: { d2: 4 },
      time: { d2: "10:15경" },
      lat: 26.1691,
      lng: 127.3472,
      memo: "다이빙 스팟 ② · 케라마 · 800m 백사장 · 투어 자유시간 약 5시간 · 스노클링은 신청자 대상 · ※ 바우처에 해변명이 없어 아하렌으로 추정 — 당일 확인"
    },
    {
      name: "🤿 존만비치 · 오도하마 해안 (大度浜海岸)",
      cat: "beach",
      day: ["d4"],
      seq: { d4: 3 },
      time: { d4: "11:10" },
      lat: 26.0794,
      lng: 127.6837,
      memo: "다이빙 스팟 ① · 이토만 · 개인 입수 OK (장비 지참) · 무료주차(대수 적음)·샤워 300엔·화장실 · 나하에서 차 35분 · 만조에 투명도 최상 · 자연 해변이라 안전요원 없음, 이안류 주의"
    }
  ],
  mapNote: "나하 2박 → 난조(남부) 1박 · 8월 말~9월 초는 태풍 시즌이라 당일 아침 입수 가능 여부 확인 필수",

  /* ---------- 5. 맛집 ---------- */
  food: {
    localTitle: "오키나와 대표 음식",
    local: [],                        // [{ name:"오키나와 소바", desc:"설명" }]
    /* 행선지 기준으로 묶었습니다. memo 앞 【 】 가 지역입니다. */
    candidates: [
      /* ── 나하 · 국제거리 — 예약 완료 ── */
      { name: "류큐노우시 (琉球の牛) 나하 국제거리점", cat: "food",
        memo: "【나하·국제거리】✅ 8/31(월) 21:00 예약 · 아구돼지·오키나와 와규 야키니쿠 · 마키시 3-2-3 3F · 16:30~23:00 (L.O.22:15)" },
      { name: "샤브샤브 류큐 본관 (しゃぶしゃぶ琉球 本館)", cat: "food",
        memo: "【나하·국제거리】✅ 9/1(화) 19:00 예약 · 금무아구 + 산조규 샤브샤브 · 마키시 3-11-2-102 · 17:00~23:00 (L.O.22:00) · ⚠️ 주차장 없음" },

      /* ── 슈리 — Day 1 점심 (슈리성 근처) ── */
      { name: "슈리소바 (首里そば)", cat: "food",
        memo: "【슈리】Day 1 점심 후보 · 슈리성 도보권 · 오키나와 소바 대표 노포 — 품절 마감이 잦아 14시 도착이면 어려울 수 있음" },
      { name: "슈리 호리카와 (首里ほりかわ)", cat: "food",
        memo: "【슈리】Day 1 점심 후보 · 슈리성 공원 옆 골목 · 소바·쥬시(오키나와식 영양밥) · 슈리소바가 마감이면 여기" },

      /* ── 케라마 · 토카시키 아하렌 — 점심은 투어 포함, 아래는 참고용 ── */
      { name: "Bon's キッチン (본즈 키친)", cat: "food",
        memo: "【케라마·아하렌】참고용 (점심은 투어 포함) · 阿波連 177 · 아하렌 비치 도보권" },
      { name: "Octopus Garden (옥토퍼스 가든)", cat: "food",
        memo: "【케라마·아하렌】참고용 (점심은 투어 포함) · 阿波連 176 · 아하렌 비치 도보권" },
      { name: "HARVEL KITCHEN & GUEST HOUSE GRAND BLUE", cat: "food",
        memo: "【케라마·아하렌】참고용 (점심은 투어 포함) · 阿波連 182-5 · 아하렌 비치 도보권" },

      /* ── 온나손 마에다 — Day 3 푸른동굴 바로 앞 (차 1분) ── */
      { name: "沖縄そば & BBQ 레몬식당 (レモン食堂)", cat: "food",
        memo: "【온나손·마에다】Day 3 푸른동굴에서 차 1분 · 恩納村前田 190 · 오키나와 소바 & BBQ" },
      { name: "Pizzeria da Enzo (피체리아 다 엔조)", cat: "food",
        memo: "【온나손·마에다】Day 3 푸른동굴에서 차 1분 · 恩納村前田 715-3 · 화덕피자" },
      { name: "COFFEE PEOPLE (커피 피플)", cat: "cafe",
        memo: "【온나손·마에다】Day 3 푸른동굴에서 차 1분 · 恩納村前田 1458 · 입수 후 커피" },

      /* ── 온나손 야마다 — 푸른동굴에서 차 4분 ── */
      { name: "沖縄ダイニング & カフェ CHOPPiN (촙핀)", cat: "food",
        memo: "【온나손·야마다】Day 3 푸른동굴에서 차 4분 · 恩納村山田 505-4 · 오키나와 다이닝" },
      { name: "The Bros. Sandwich Stand (더 브로스)", cat: "food",
        memo: "【온나손·야마다】Day 3 푸른동굴에서 차 4분 · 恩納村山田 590-1 · 샌드위치, 테이크아웃" }
    ],
    note: "예약된 두 곳(류큐노우시 8/31 21:00 · 샤브샤브 류큐 9/1 19:00)은 확정입니다. 나머지는 후보이고, 【 】 안의 지역이 그날 행선지와 붙어 있는 곳입니다 — Day 2 케라마 점심은 투어에 포함(일식 카레라이스)이라 아하렌 식당은 참고용이고, 온나손은 Day 3 푸른동굴 전후로 쓰시면 됩니다."
  },

  /* ---------- 5-1. 운전 매뉴얼 ---------- */
  /* 이 데이터가 있으면 하단에 '운전' 탭이 생깁니다 (없는 여행은 탭 자체가 안 뜸).
     figure 는 인라인 SVG 문자열 — 외부 이미지 없이 그려서 오프라인에서도 보입니다. */
  driveGuide: {
    sections: [
      {
        title: "1 · 좌측통행 — 모든 것의 기본",
        figure: "<svg viewBox='0 0 320 160' xmlns='http://www.w3.org/2000/svg' font-family='inherit'>" +
          "<rect x='70' y='0' width='180' height='160' rx='6' fill='#eef4f8'/>" +
          "<line x1='76' y1='0' x2='76' y2='160' stroke='#c9d8e2' stroke-width='2'/>" +
          "<line x1='244' y1='0' x2='244' y2='160' stroke='#c9d8e2' stroke-width='2'/>" +
          "<line x1='160' y1='6' x2='160' y2='154' stroke='#e8b93b' stroke-width='3' stroke-dasharray='14 10'/>" +
          "<rect x='96' y='78' width='34' height='58' rx='9' fill='#1f92b5'/>" +
          "<rect x='101' y='88' width='24' height='12' rx='3' fill='#d9f0f8'/>" +
          "<rect x='101' y='116' width='24' height='9' rx='3' fill='#d9f0f8'/>" +
          "<polygon points='113,48 103,66 123,66' fill='#1f92b5'/>" +
          "<rect x='188' y='24' width='34' height='58' rx='9' fill='#8aa3b0'/>" +
          "<rect x='193' y='36' width='24' height='9' rx='3' fill='#e7eef2'/>" +
          "<rect x='193' y='58' width='24' height='12' rx='3' fill='#e7eef2'/>" +
          "<polygon points='205,110 195,92 215,92' fill='#8aa3b0'/>" +
          "<text x='113' y='152' text-anchor='middle' font-size='12' font-weight='700' fill='#15718f'>내 차</text>" +
          "<text x='205' y='16' text-anchor='middle' font-size='11' fill='#6b7a90'>반대 방향</text>" +
          "<text x='34' y='84' text-anchor='middle' font-size='11' fill='#6b7a90'>왼쪽</text>" +
          "<text x='286' y='84' text-anchor='middle' font-size='11' fill='#6b7a90'>오른쪽</text>" +
          "</svg>",
        caption: "핸들은 오른쪽, 차는 왼쪽 차선",
        points: [
          "역주행 실수는 대부분 주차장·골목에서 큰길로 나올 때 나옵니다 — 진입 직전 '왼쪽!' 하고 소리 내 확인",
          "회전을 마친 뒤에도 반드시 왼쪽 차선으로 들어갑니다",
          "8/31 렌터카 인수 직후 30분이 가장 위험한 시간대 — 영업소 → 나하 시내 구간은 천천히"
        ]
      },
      {
        title: "2 · 교차로 — 좌회전은 작게, 우회전은 크게",
        figure: "<svg viewBox='0 0 320 230' xmlns='http://www.w3.org/2000/svg' font-family='inherit'>" +
          "<rect x='118' y='0' width='84' height='230' fill='#eef4f8'/>" +
          "<rect x='0' y='73' width='320' height='84' fill='#eef4f8'/>" +
          "<line x1='160' y1='0' x2='160' y2='66' stroke='#fff' stroke-width='3' stroke-dasharray='10 8'/>" +
          "<line x1='160' y1='164' x2='160' y2='230' stroke='#fff' stroke-width='3' stroke-dasharray='10 8'/>" +
          "<line x1='0' y1='115' x2='110' y2='115' stroke='#fff' stroke-width='3' stroke-dasharray='10 8'/>" +
          "<line x1='210' y1='115' x2='320' y2='115' stroke='#fff' stroke-width='3' stroke-dasharray='10 8'/>" +
          "<rect x='124' y='186' width='30' height='40' rx='8' fill='#1f92b5'/>" +
          "<path d='M139 192 C139 150 120 136 60 136' fill='none' stroke='#2f9e8f' stroke-width='5' stroke-linecap='round'/>" +
          "<polygon points='42,136 62,127 62,145' fill='#2f9e8f'/>" +
          "<text x='14' y='172' font-size='12' font-weight='800' fill='#2f9e8f'>좌회전 = 작게</text>" +
          "<path d='M139 192 C139 130 150 96 256 94' fill='none' stroke='#e8734a' stroke-width='5' stroke-linecap='round'/>" +
          "<polygon points='276,94 256,85 256,103' fill='#e8734a'/>" +
          "<text x='212' y='76' font-size='12' font-weight='800' fill='#e8734a'>우회전 = 크게</text>" +
          "<rect x='166' y='16' width='30' height='40' rx='8' fill='#8aa3b0'/>" +
          "<polygon points='181,72 172,58 190,58' fill='#8aa3b0'/>" +
          "<text x='166' y='112' font-size='15'>⚠️</text>" +
          "<text x='240' y='36' text-anchor='middle' font-size='11.5' font-weight='800' fill='#d4574a'>대향 직진차 먼저!</text>" +
          "</svg>",
        caption: "우회전이 반대 차선을 가로지릅니다 — 한국과 반대",
        points: [
          "좌회전이 가까운 회전, 우회전이 맞은편 차선을 가로지르는 큰 회전 — 한국과 반대입니다",
          "빨간불엔 어느 방향으로도 진행 금지 — 한국식 '빨간불 우회전' 개념 자체가 없습니다",
          "우회전 화살표(→) 신호가 있는 교차로가 많습니다 — 화살표가 켜질 때만 진행",
          "유턴은 '転回禁止(전회금지)' 표지가 없으면 우회전 대기 위치에서 가능"
        ]
      },
      {
        title: "3 · 깜빡이와 와이퍼가 반대",
        figure: "<svg viewBox='0 0 320 150' xmlns='http://www.w3.org/2000/svg' font-family='inherit'>" +
          "<circle cx='160' cy='82' r='44' fill='none' stroke='#1b3a4b' stroke-width='9'/>" +
          "<circle cx='160' cy='82' r='11' fill='#1b3a4b'/>" +
          "<line x1='121' y1='82' x2='199' y2='82' stroke='#1b3a4b' stroke-width='7'/>" +
          "<line x1='160' y1='93' x2='160' y2='122' stroke='#1b3a4b' stroke-width='7'/>" +
          "<line x1='122' y1='68' x2='58' y2='54' stroke='#8aa3b0' stroke-width='8' stroke-linecap='round'/>" +
          "<text x='58' y='34' text-anchor='middle' font-size='12.5' font-weight='800' fill='#6b7a90'>와이퍼</text>" +
          "<text x='52' y='80' text-anchor='middle' font-size='11' fill='#8aa3b0'>왼쪽 레버</text>" +
          "<line x1='198' y1='68' x2='262' y2='54' stroke='#e8734a' stroke-width='8' stroke-linecap='round'/>" +
          "<text x='262' y='34' text-anchor='middle' font-size='12.5' font-weight='800' fill='#e8734a'>방향지시등</text>" +
          "<text x='268' y='80' text-anchor='middle' font-size='11' fill='#e8734a'>오른쪽 레버</text>" +
          "</svg>",
        caption: "방향지시등 레버가 오른쪽 — 한국과 반대",
        points: [
          "깜빡이를 켜려다 와이퍼가 움직이면 정상적인 적응 과정입니다 — 당황하지 말고 다시",
          "출발 전에 두 레버를 한 번씩 만져보고 출발하면 금방 익습니다"
        ]
      },
      {
        title: "4 · 止まれ(토마레) = 완전 정지 3초",
        figure: "<svg viewBox='0 0 320 140' xmlns='http://www.w3.org/2000/svg' font-family='inherit'>" +
          "<polygon points='100,16 220,16 160,124' fill='#d4574a'/>" +
          "<polygon points='113,26 207,26 160,106' fill='none' stroke='#fff' stroke-width='4'/>" +
          "<text x='160' y='58' text-anchor='middle' font-size='19' font-weight='800' fill='#fff'>止まれ</text>" +
          "<text x='272' y='54' text-anchor='middle' font-size='12.5' font-weight='800' fill='#1b3a4b'>완전 정지</text>" +
          "<text x='272' y='72' text-anchor='middle' font-size='12' fill='#6b7a90'>3초 멈춤</text>" +
          "<rect x='240' y='96' width='64' height='10' rx='3' fill='#1b3a4b'/>" +
          "<text x='272' y='124' text-anchor='middle' font-size='10.5' fill='#8aa3b0'>정지선</text>" +
          "</svg>",
        caption: "역삼각형 표지 — 일본 경찰 단속 1순위",
        points: [
          "정지선 앞에서 바퀴가 완전히 멈춘 뒤 좌우 확인하고 출발 — '슬금슬금'도 위반입니다",
          "철길 건널목은 표지가 없어도 무조건 일시정지",
          "주택가 좁은 교차로에 많고, 노면에 쓰인 '止まれ' 글자도 같은 효력입니다"
        ]
      },
      {
        title: "5 · 버스 전용차선 (나하 시내)",
        figure: "<svg viewBox='0 0 320 170' xmlns='http://www.w3.org/2000/svg' font-family='inherit'>" +
          "<rect x='55' y='0' width='210' height='170' fill='#eef4f8'/>" +
          "<rect x='55' y='0' width='105' height='170' fill='#e8734a' opacity='0.10'/>" +
          "<line x1='61' y1='0' x2='61' y2='170' stroke='#c9d8e2' stroke-width='2'/>" +
          "<line x1='259' y1='0' x2='259' y2='170' stroke='#c9d8e2' stroke-width='2'/>" +
          "<line x1='160' y1='4' x2='160' y2='166' stroke='#fff' stroke-width='3' stroke-dasharray='12 9'/>" +
          "<rect x='88' y='14' width='40' height='64' rx='7' fill='#d49a3b'/>" +
          "<rect x='94' y='22' width='28' height='10' rx='2' fill='#fff6e3'/>" +
          "<rect x='94' y='62' width='28' height='10' rx='2' fill='#fff6e3'/>" +
          "<text text-anchor='middle' font-size='16' font-weight='800' fill='#d4574a'>" +
          "<tspan x='108' y='102'>バ</tspan><tspan x='108' y='120'>ス</tspan><tspan x='108' y='138'>専</tspan><tspan x='108' y='156'>用</tspan></text>" +
          "<rect x='193' y='84' width='32' height='54' rx='9' fill='#1f92b5'/>" +
          "<rect x='198' y='92' width='22' height='11' rx='3' fill='#d9f0f8'/>" +
          "<polygon points='209,60 199,76 219,76' fill='#1f92b5'/>" +
          "<text x='209' y='156' text-anchor='middle' font-size='11.5' font-weight='700' fill='#15718f'>이쪽으로</text>" +
          "<text x='27' y='60' text-anchor='middle' font-size='11' font-weight='800' fill='#d4574a'>평일</text>" +
          "<text x='27' y='76' text-anchor='middle' font-size='10' fill='#d4574a'>출퇴근</text>" +
          "<text x='27' y='90' text-anchor='middle' font-size='10' fill='#d4574a'>시간만</text>" +
          "</svg>",
        caption: "노면의 'バス専用' 표시 — 평일 아침·저녁만 적용",
        points: [
          "평일 07:30~09:00(시내 유입 방향) · 17:30~19:00(유출 방향) — 토·일·공휴일은 해제",
          "왼쪽 차선이 텅 비어 보이면 의심부터 — 노면 표시 확인하고 오른쪽 차선으로",
          "위반 시 범칙금 약 6,000~7,000엔 · 카메라 단속분은 반납 후에도 렌터카 업체 통해 청구",
          "⚠️ 우리 일정: 9/2(수) 08:30 나하 출발이 아침 단속 시간대와 겹칩니다 — 국도 58호 북상 시 주의"
        ]
      },
      {
        title: "6 · Y·A 넘버판 = 미군 차량",
        figure: "<svg viewBox='0 0 320 130' xmlns='http://www.w3.org/2000/svg' font-family='inherit'>" +
          "<rect x='75' y='12' width='170' height='96' rx='10' fill='#fdfdfb' stroke='#1b3a4b' stroke-width='3'/>" +
          "<text x='160' y='48' text-anchor='middle' font-size='23' font-weight='800' fill='#1b3a4b'>沖縄 330</text>" +
          "<text x='104' y='92' text-anchor='middle' font-size='34' font-weight='800' fill='#d4574a'>Y</text>" +
          "<circle cx='104' cy='81' r='21' fill='none' stroke='#d4574a' stroke-width='2.5' stroke-dasharray='5 4'/>" +
          "<text x='188' y='92' text-anchor='middle' font-size='30' font-weight='800' fill='#1b3a4b'>12-34</text>" +
          "<text x='282' y='56' text-anchor='middle' font-size='11.5' font-weight='800' fill='#d4574a'>이 자리가</text>" +
          "<text x='282' y='71' text-anchor='middle' font-size='11.5' font-weight='800' fill='#d4574a'>Y 또는 A</text>" +
          "<line x1='256' y1='68' x2='128' y2='80' stroke='#d4574a' stroke-width='1.5' stroke-dasharray='4 3'/>" +
          "</svg>",
        caption: "번호판 히라가나 자리에 Y·A가 있으면 미군 관계 차량",
        points: [
          "사고가 나면 일본 경찰 + 미군 헌병대가 같이 출동 — 조율에 시간이 오래 걸려 일정이 통째로 꼬입니다",
          "Y·A 차량과는 평소의 2배 안전거리, 무리한 추월·차선 경쟁 금지",
          "사고 시 즉시 렌터카 업체(FlightRent-a-Car) 연락 — 긴급출동이 계약에 포함돼 있습니다"
        ]
      },
      {
        title: "7 · 코레구스 — 조미료에 술이 들어 있음",
        figure: "<svg viewBox='0 0 320 130' xmlns='http://www.w3.org/2000/svg' font-family='inherit'>" +
          "<rect x='96' y='14' width='12' height='16' fill='#8f5f3f'/>" +
          "<path d='M92 30 h20 c8 10 10 16 10 28 v36 a8 8 0 0 1 -8 8 h-24 a8 8 0 0 1 -8 -8 v-36 c0 -12 2 -18 10 -28 z' fill='#e8734a' opacity='0.85'/>" +
          "<rect x='88' y='56' width='28' height='28' rx='4' fill='#fff' opacity='0.92'/>" +
          "<text x='102' y='69' text-anchor='middle' font-size='9.5' font-weight='800' fill='#8f5f3f'>泡盛</text>" +
          "<text x='102' y='80' text-anchor='middle' font-size='8.5' fill='#8f5f3f'>20~40도</text>" +
          "<path d='M140 66 h42' stroke='#8aa3b0' stroke-width='3' stroke-dasharray='5 4'/>" +
          "<polygon points='196,66 184,60 184,72' fill='#8aa3b0'/>" +
          "<path d='M206 62 a42 26 0 0 0 84 0 z' fill='#1f92b5' opacity='0.9'/>" +
          "<ellipse cx='248' cy='62' rx='42' ry='8' fill='#f2e3c2'/>" +
          "<text x='102' y='112' text-anchor='middle' font-size='11.5' font-weight='800' fill='#d4574a'>코레구스</text>" +
          "<text x='248' y='112' text-anchor='middle' font-size='11.5' fill='#6b7a90'>소바에 몇 방울 = 술</text>" +
          "</svg>",
        caption: "오키나와 소바 테이블의 빨간 병 — 아와모리(도수 20~40도) 베이스",
        points: [
          "소바·찬푸루에 뿌리는 전통 조미료지만 베이스가 술입니다 — 반복 섭취 시 혈중 알코올이 올라갈 수 있음",
          "일본 음주운전 기준은 한국과 같은 혈중 0.03% — 소량도 적발 대상",
          "운전 예정이면 아예 쓰지 않는 게 답 — 국물에 미리 들어가는 집도 있으니 주문할 때 확인"
        ]
      },
      {
        title: "8 · 산호 노면 + 자동차도로 80km/h",
        figure: "<svg viewBox='0 0 320 130' xmlns='http://www.w3.org/2000/svg' font-family='inherit'>" +
          "<circle cx='96' cy='65' r='47' fill='#fff' stroke='#d4574a' stroke-width='10'/>" +
          "<text x='96' y='80' text-anchor='middle' font-size='40' font-weight='800' fill='#1b3a4b'>80</text>" +
          "<text x='232' y='40' text-anchor='middle' font-size='12.5' font-weight='800' fill='#1b3a4b'>오키나와 자동차도로</text>" +
          "<text x='232' y='60' text-anchor='middle' font-size='11.5' fill='#6b7a90'>한국 고속도로는 100~110</text>" +
          "<text x='232' y='88' text-anchor='middle' font-size='11.5' fill='#2b7fb8'>☔ 산호 노면 — 빗길 2배 조심</text>" +
          "</svg>",
        caption: "노면에 산호 석회암이 섞여 있어 비 오면 유독 미끄럽습니다",
        points: [
          "비 오면 차간거리 2배, 급가속·급제동·급핸들 금지 — 해안도로가 특히 미끄럽습니다",
          "8월 말~9월 초는 스콜이 잦습니다 — 와이퍼·라이트는 조금 일찍",
          "과속 카메라 벌금은 귀국 후에도 렌터카 업체를 통해 청구됩니다"
        ]
      },
      {
        title: "9 · 주유소에서",
        points: [
          "유종은 주유구 스티커 확인 — 보통 'レギュラー(레귤러)' = 휘발유, 빨간색 노즐",
          "직원에게는 '레귤러, 만탄(満タン), 카-도(카드)' 세 단어면 됩니다",
          "반납 전 가득 채우는 조건 — Day 4 14:20에 주유 일정 잡아뒀습니다"
        ]
      }
    ],
    videos: [
      { id: "Qr3-VJQSgAA", title: "초보자를 위한 일본 오키나와 운전 가이드", by: "Jaeho Yoo" },
      { id: "PssaNzzychI", title: "오키나와 렌트카 운전 이렇게 하면 큰일납니다", by: "삐형팸" },
      { id: "EkfOfaXVYns", title: "일본 운전 우회전·유턴 꿀팁 — 교차로에서 신호 보는 법", by: "빌&린다 오키나와" }
    ]
  },

  /* ---------- 6. 준비물 ---------- */
  checklist: [
    {
      group: "📄 필수 서류",
      items: [
        "여권 (귀국일 기준 6개월 이상 유효)",
        "여권 사본 (별도 보관)",
        "항공권 e-티켓 (출력 또는 모바일)",
        "숙박 예약 확인서 ×2 (나하 · 햐쿠나가란)",
        "렌터카 예약 바우처 (FlightRent-a-Car)",
        "주 운전자 명의 신용카드 ❗ (렌터카 인수 필수)",
        "국제운전면허증 (IDP) — 경찰서/면허시험장 발급",
        "한국 운전면허증 원본 ❗ (IDP만으론 대여 불가)",
        "여행자보험 증서"
      ]
    },
    {
      group: "💳 결제 수단",
      items: [
        "신용카드 (해외 결제 가능 카드 2장 권장)",
        "체크카드 / 트래블월렛 등",
        "엔화 현금 ¥30,000~40,000 (도시세, 주유, 소소한 결제)",
        "환율 확인 + 환전",
        "신용카드 해외 사용 제한 해제 확인"
      ]
    },
    {
      group: "🔌 전자기기",
      items: [
        "스마트폰 + 충전기",
        "보조 배터리",
        "일본 어댑터",
        "카메라 + 메모리카드 + 배터리 (찍고 싶으면)",
        "이어폰",
        "차량용 휴대폰 거치대 / USB 충전기",
        "eSIM 또는 포켓 와이파이 (KT 로밍 / KLOOK / 트립닷컴 등)"
      ]
    },
    {
      group: "👕 의류 / 개인용품",
      items: [
        "수영복 / 래쉬가드 (해파리 시즌이라 필수 착용)",
        "아쿠아슈즈",
        "운동화 (드라이브용)",
        "스노클링·프리다이빙 장비 (마스크·스노클·핀·부이)",
        "모자 / 선글라스 (운전용)",
        "자외선 차단제",
        "세면도구 (호텔 비치품 외 개인 선호)",
        "화장품",
        "콘택트렌즈 / 안경",
        "상비약 (소화제, 진통제, 멀미약, 모기약)",
        "멀티탭 (가능하면)"
      ]
    },
    {
      group: "🗓️ 출발 전 (1~2주 전)",
      items: [
        "웹 체크인 (출발 24~48시간 전)",
        "여권 유효기간 확인",
        "국제운전면허증 발급",
        "환전",
        "여행자보험 가입",
        "eSIM/포켓와이파이 준비",
        "일별 일정 확정",
        "맛집 / 식당 예약 — 류큐노우시 국제거리점 8/31 21:00 ❗",
        "케라마 토카시키 투어 예약 ✅ 완료 — 9/1 미에구스쿠항 08:40 집합 / 17:10 해산 · 바우처 준비",
        "케라마 결항 대비 — 대안: 미야기 해안(스나베, 차탄 · 나하에서 차 30분)",
        "청의 동굴 체험 다이빙 예약 ✅ 확정 — 9/2 10:00 · 집합 09:40 · 바우처 준비",
        "존만비치 물때표 확인 (9/3 간조·만조 시간)",
        "인천공항 T2 장기주차장 요금·셔틀 노선 확인 (발렛 불가 · 예약 없이 현장 입차)",
        "Visit Japan Web 사전 등록",
        "비상연락처 정리"
      ]
    },
    {
      group: "✈️ 출발 당일 (8/31)",
      items: [
        "인천공항 T2 장기주차장 07:00 입차 · 주차 위치 사진 · 셔틀로 터미널",
        "위탁 수하물 무게 확인 (대한항공 규정 — 확인 필요)",
        "휴대 수하물 액체 100ml 이하",
        "보조배터리 휴대 수하물에 (위탁 금지)",
        "여권 + 항공권 + 결제수단 최종 점검"
      ]
    },
    {
      group: "🛬 귀국 당일 (9/3)",
      items: [
        "햐쿠나가란 체크아웃 (10:30 — 존만비치 들르려면 조금 일찍)",
        "존만비치는 수면 스노클링만 ⚠️ (18:15 비행 — 깊은 프리다이빙 금지)",
        "렌터카 주유 만탱 후 반납 (15:15)",
        "나하공항 도착 (16:15)",
        "면세점 쇼핑 시간 활용",
        "잔돈 엔화 정리",
        "나하 출발 (18:15 · KE5490)"
      ]
    }
  ],

  /* ---------- 7. 푸터 ---------- */
  footer: "🌺 오키나와 3박 4일 · 2026.08.31 ~ 09.03"
};

/* 카테고리 정의 (지도 필터 · 일정 태그 공용) */
const CATEGORIES = {
  food:      { label: "식당",     icon: "🍽️", color: "#e8734a" },
  spot:      { label: "관광",     icon: "🏯",  color: "#e05c8a" },
  cafe:      { label: "카페",     icon: "☕",  color: "#8b6b4f" },
  market:    { label: "시장",     icon: "🧺",  color: "#d49a3b" },
  stay:      { label: "숙소",     icon: "🏨",  color: "#2f9e8f" },
  point:     { label: "시작/종료", icon: "🏠", color: "#6b7a90" },
  transport: { label: "항공",     icon: "✈️",  color: "#3b8fd4" },
  ferry:     { label: "배",       icon: "⛴️", color: "#2b7fb8" },
  car:       { label: "렌터카",   icon: "🚙",  color: "#4a6fa5" },
  aquarium:  { label: "수족관",   icon: "🐠",  color: "#1fa8c9" },
  beach:     { label: "바다",     icon: "🏖️", color: "#20a4c9" }
};

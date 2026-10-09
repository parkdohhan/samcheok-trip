/* =========================================================
   후쿠오카 가족여행 대시보드 — 렌더링 로직
   ─ 공용 app.js 에서 갈라져 나온 사본입니다 (다른 여행과 공유하지 않음).
   ─ 다른 점: 비밀번호 대신 '이름'으로 입장하고,
     준비물과 메모를 Supabase 에 사람별로 저장합니다.
   ========================================================= */

const $  = (s) => document.querySelector(s);
const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const cat = (k) => CATEGORIES[k] || { label: k || "", icon: "📍", color: "#8aa3b0" };
const emptyBox = (msg) => el("div", "empty", msg);

/* 주소 검색 링크 — 국내는 카카오맵, 해외는 구글맵이 잘 찾습니다.
   여행별로 data.js 의 meta.mapProvider 로 고릅니다 ("kakao" | "google"). */
const useGoogleMap = () => (TRIP.meta && TRIP.meta.mapProvider) === "google";
const mapLabel = () => (useGoogleMap() ? "🗺️ 구글맵" : "🗺️ 카카오맵");
const mapUrl = (addr) => useGoogleMap()
  ? "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(addr)
  : "https://map.kakao.com/link/search/" + encodeURIComponent(addr);

/* 여행마다 달라야 함 — 안 넣으면 다른 여행의 체크 상태와 섞입니다 */
const STORE_KEY = (TRIP.meta && TRIP.meta.storeKey) || "trip";

/* localStorage 안전 래퍼 — file:// 나 시크릿 모드에서 막혀도 앱이 죽지 않게 */
const mem = {};
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return mem[k] ?? null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { mem[k] = v; } },
  del(k) { try { localStorage.removeItem(k); } catch { delete mem[k]; } }
};

/* ===================== Supabase (이름 입장 · 개인 준비물/메모) =====================
   publishable(공개) 키라서 브라우저에 들어가도 되는 키입니다.
   다만 이름 입력은 '인증'이 아니라 '선택'이라, 링크를 아는 사람은
   누구 이름으로든 들어갈 수 있습니다 — 민감한 내용은 적지 마세요. */
const SUPA = TRIP.supabase || null;
const T    = (SUPA && SUPA.tables) || {};
const enc  = encodeURIComponent;

let ME     = store.get(STORE_KEY + ":me") || "";   // 지금 들어와 있는 사람
let PEOPLE = [];                                   // 명단 (이름·가족번호·별칭)

async function supa(path, opts = {}) {
  if (!SUPA) throw new Error("supabase 설정이 없습니다");
  const r = await fetch(`${SUPA.url}/rest/v1/${path}`, {
    ...opts,
    headers: {
      apikey: SUPA.key,
      Authorization: `Bearer ${SUPA.key}`,
      "Content-Type": "application/json",
      ...(opts.headers || {})
    }
  });
  const body = await r.text();
  if (!r.ok) throw new Error(`${r.status} ${body}`);
  // POST 는 기본이 빈 응답(201)이라 그냥 json() 하면 터집니다
  return body ? JSON.parse(body) : null;
}

/* ===================== 이름 입장 ===================== */
function initGate() {
  const gate = $("#gate"), app = $("#app");
  const open = () => { gate.remove(); app.hidden = false; render(); };
  const shout = (msg) => {
    const e = $("#gate-err"); e.hidden = false; e.textContent = msg;
    const c = $(".gate-card");
    c.classList.remove("shake"); void c.offsetWidth; c.classList.add("shake");
  };

  supa(`${T.people}?select=name,family,alias,sort&order=sort`)
    .then((rows) => {
      PEOPLE = rows || [];
      if (ME && PEOPLE.some((p) => p.name === ME)) open();
    })
    .catch((e) => {
      console.error(e);
      shout("명단을 불러오지 못했어요. 인터넷 확인 후 새로고침해 주세요.");
    });

  $("#gate-form").addEventListener("submit", (ev) => {
    ev.preventDefault();
    const v = $("#gate-input").value.trim();
    if (!v) return shout("이름을 입력해 주세요");
    if (!PEOPLE.length) return shout("명단을 아직 불러오는 중이에요. 잠시 뒤에 다시");
    const hit = PEOPLE.find((p) => p.name === v) || PEOPLE.find((p) => p.alias === v);
    if (!hit) {
      shout(`'${v}' 은(는) 명단에 없어요 🥲 성을 빼거나 붙여서 다시 해보세요`);
      $("#gate-input").select();
      return;
    }
    ME = hit.name;
    store.set(STORE_KEY + ":me", ME);
    open();
  });
  setTimeout(() => $("#gate-input").focus(), 200);
}

/* ===================== 카테고리 네비게이션 ===================== */
/* 하단 탭 · 홈 바로가기 · 상단바 타이틀이 전부 이 목록에서 나옵니다 */
const VIEWS = [
  { id: "home",   icon: "🏠",  label: "한눈에",  title: "한눈에 보기" },
  { id: "plan",   icon: "🗓️", label: "일정",    title: "일정표"     },
  { id: "map",    icon: "🗺️", label: "지도",    title: "동선 지도"  },
  { id: "stay",   icon: "🏨",  label: "숙박",    title: "숙소"       },
  { id: "cost",   icon: "💰",  label: "견적",    title: "견적"       },
  { id: "people", icon: "👨‍👩‍👧‍👦", label: "참석자", title: "참석자"   },
  { id: "prep",   icon: "🎒",  label: "준비물",  title: "내 준비물"  },
  { id: "memo",   icon: "📝",  label: "메모",    title: "내 메모"    }
];

/* 홈 바로가기 타일에 뜨는 한 줄 요약 → { text, done } */
const VIEW_META = {
  plan() {
    const n = (TRIP.days || []).reduce((a, d) => a + (d.items || []).length, 0);
    return { text: n ? `${(TRIP.days || []).length}일 · 일정 ${n}개` : "일정 미정", done: n > 0 };
  },
  map() {
    const n = (TRIP.places || []).length;
    return { text: n ? `장소 ${n}곳` : "장소 미정", done: n > 0 };
  },
  stay() {
    const s = (TRIP.stays && TRIP.stays.length)
      ? TRIP.stays
      : (TRIP.bookings || []).filter((b) => b.type === "hotel");
    return {
      text: s.length ? (s.length > 1 ? `${s.length}곳 · ${s[0].title}` : s[0].title) : "숙소 미정",
      done: s.length > 0
    };
  },
  cost() {
    const c = TRIP.cost || {};
    return { text: c.perPerson ? `1인 ${c.perPerson}` : "견적 미정", done: !!c.perPerson };
  },
  people() {
    const p = TRIP.people || {};
    return { text: p.total ? `${p.total}명 · ${(p.families || []).length}가족` : "명단 미정", done: !!p.total };
  },
  memo() {
    return { text: ME ? `${ME} 님 전용` : "이름 입력 필요", done: !!ME };
  },
  prep() {
    const n = MYLIST.length, done = MYLIST.filter((i) => i.checked).length;
    return { text: n ? `${done}/${n}개 체크` : "불러오는 중", done: n > 0 };
  }
};

let mapReady = false;

/* 현재 히스토리 항목이 앱 안에서 몇 번째로 쌓인 것인지 (0 = 진입 지점) */
const navDepth = () =>
  (history.state && typeof history.state.d === "number") ? history.state.d : 0;

/* 뒤로 가기: 앱 안에 쌓인 이력이 있으면 되돌아가고, 없으면 홈으로 */
function goBack() {
  if (navDepth() > 0) history.back();
  else showView("home");
}

function showView(id, push) {
  const v = VIEWS.find((x) => x.id === id) || VIEWS[0];

  document.querySelectorAll(".view").forEach((s) =>
    s.classList.toggle("on", s.dataset.view === v.id));
  document.querySelectorAll(".tabbtn").forEach((b) => {
    const on = b.dataset.view === v.id;
    b.classList.toggle("on", on);
    b.setAttribute("aria-current", on ? "page" : "false");
    if (on) b.scrollIntoView({ block: "nearest", inline: "nearest" });
  });

  $("#topbar-sub").textContent = v.title;
  $("#topbar-back").hidden = v.id === "home";

  if (push !== false && location.hash.slice(1) !== v.id) {
    // 깊이를 먼저 읽어둔다 — hash를 바꾸는 순간 새 항목(state=null)이 쌓이기 때문
    const d = navDepth();
    location.hash = v.id;
    history.replaceState({ d: d + 1 }, "");
  }
  window.scrollTo({ top: 0 });

  // 지도는 처음 열릴 때 초기화 (숨겨진 상태로 만들면 크기가 깨짐)
  if (v.id === "map") {
    if (!mapReady) { mapReady = true; try { renderMap(); } catch (e) { console.error(e); } }
    else if (MAP) setTimeout(() => MAP.invalidateSize(), 60);
  }
}

function renderNav() {
  const bar = $("#tabbar");
  VIEWS.forEach((v) => {
    const b = el("button", "tabbtn",
      `<span class="tabbtn-ico">${v.icon}</span><span>${esc(v.label)}</span>`);
    b.type = "button";
    b.dataset.view = v.id;
    b.addEventListener("click", () => showView(v.id));
    bar.appendChild(b);
  });

  // 홈 바로가기 그리드
  const grid = $("#qnav");
  let done = 0;
  VIEWS.filter((v) => v.id !== "home").forEach((v) => {
    const m = (VIEW_META[v.id] || (() => ({ text: "", done: false })))();
    if (m.done) done++;
    const item = el("button", "qnav-item" + (m.done ? "" : " todo"),
      `<span class="qnav-ico">${v.icon}</span>` +
      `<span class="qnav-body"><span class="qnav-label">${esc(v.title)}</span>` +
      `<span class="qnav-meta">${esc(m.text)}</span></span>`);
    item.type = "button";
    item.dataset.view = v.id;
    item.addEventListener("click", () => showView(v.id));
    grid.appendChild(item);
  });

  const total = VIEWS.length - 1;
  $("#qnav-count").textContent = `${done} / ${total}`;
  $("#qnav-prog").style.width = Math.round((done / total) * 100) + "%";

  $("#topbar-back").addEventListener("click", goBack);
  $("#prep-more")?.addEventListener("click", () => showView("prep"));

  window.addEventListener("hashchange", () => showView(location.hash.slice(1), false));
  history.replaceState({ d: navDepth() }, "");   // 진입 지점 깊이 고정
  showView(location.hash.slice(1) || "home", false);
}

/* ===================== 히어로 ===================== */
function renderHero() {
  const m = TRIP.meta;
  $("#hero-badge").textContent = m.badge || "";
  $("#hero-title").textContent = [m.title, m.subtitle].filter(Boolean).join("\n");
  $("#hero-desc").textContent  = m.desc || "";
  $("#hero-depart").textContent = m.departText || "";

  // D-DAY
  const start = new Date(m.startDate + "T00:00:00");
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const diff  = Math.round((start - today) / 86400000);
  const dday  = diff > 0 ? "D-" + diff : diff === 0 ? "D-DAY!" : "D+" + Math.abs(diff);
  $("#dday-num").textContent   = dday;
  $("#topbar-dday").textContent = dday;
  $("#topbar-title").textContent = m.title || "여행";

  const chips = $("#hero-chips");
  (m.chips || []).forEach((c) => chips.appendChild(el("span", "chip", esc(c))));

  const files = $("#hero-files");
  (m.files || []).forEach((f) =>
    files.appendChild(el("span", "chip", `${f.icon || "📄"} ${esc(f.name)}`)));
}

/* ===================== 한눈에 보기 =====================
   출발 전/여행 중/종료 배너 + 오늘 날짜에 맞는 하루 타임라인.
   출발 전이면 첫날, 여행 중이면 오늘, 끝났으면 마지막 날을 보여줍니다.  */
function renderOverview() {
  const m = TRIP.meta || {};
  const days = TRIP.days || [];

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const iso   = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-` +
                       `${String(d.getDate()).padStart(2, "0")}`;
  const start = new Date(m.startDate + "T00:00:00");
  const end   = new Date((m.endDate || m.startDate) + "T00:00:00");
  const diff  = Math.round((start - today) / 86400000);

  let title, sub, note, pick, head;
  if (today > end) {
    title = `여행 종료 ${m.emoji || "🌺"}`; sub = "즐거운 여행이었기를"; note = "귀국 후";
    pick = days[days.length - 1];           head = "🗓️ 마지막 날";
  } else if (today >= start) {
    title = "여행 중 ✈️"; sub = "아래는 오늘 일정"; note = "여행 중";
    pick = days.find((d) => d.date === iso(today)) || days[0];
    head = "🗓️ 오늘";
  } else {
    title = `출발까지 D-${diff}`; sub = "확정된 것과 아직 안 정해진 것"; note = "출발 전";
    pick = days[0];                         head = "🗓️ 첫날";
  }

  $("#ov-sub").textContent = note;
  const banner = $("#ov-banner");
  banner.appendChild(el("div", "ov-banner-t", esc(title)));
  banner.appendChild(el("div", "ov-banner-s",
    esc(`${m.startDate} ~ ${m.endDate || m.startDate} · ${sub}`)));

  const box = $("#ov-lastday");
  if (!pick) {
    box.appendChild(emptyBox("일정이 아직 비어 있어요."));
    return;
  }
  $("#ov-day-h").textContent = `${head} · ${pick.label} (${pick.date} ${pick.dow || ""})`.trim();
  $("#ov-day-sub").textContent = pick.title || "";

  if (!(pick.items || []).length) {
    box.appendChild(emptyBox("이 날 일정이 아직 비어 있어요."));
    return;
  }
  const tl = el("div", "timeline");
  pick.items.forEach((it) => {
    const r = el("div", "tl-row");
    r.appendChild(el("div", "tl-time", esc(it.time || "")));
    r.appendChild(el("div", "tl-text", esc(it.text)));
    tl.appendChild(r);
  });
  box.appendChild(tl);
}

/* ===================== 확정 예약 ===================== */
const BOOK_ICON = {
  flight: "✈️", hotel: "🏨", car: "🚗", parking: "🅿️",
  train: "🚆", bus: "🚌", ferry: "⛴️", dive: "🤿", tour: "🎫", etc: "📌"
};

function renderBookings() {
  const box = $("#bookings");
  const list = TRIP.bookings || [];
  if (!list.length) return box.appendChild(emptyBox("아직 확정된 예약이 없어요."));

  list.forEach((b) => {
    const row  = el("div", "booking");
    row.appendChild(el("div", "booking-ico", BOOK_ICON[b.type] || "📌"));

    const body = el("div", "booking-body");
    body.appendChild(el("div", "booking-title", esc(b.title)));
    (b.lines || []).forEach((l) => body.appendChild(el("div", "booking-line", esc(l))));
    if (b.price) body.appendChild(el("div", "booking-price", esc(b.price)));

    const acts = el("div", "booking-acts");
    if (b.tel) {
      const a = el("a", "mini-btn", "📞 전화");
      a.href = "tel:" + b.tel;
      acts.appendChild(a);
    }
    if (b.addr) {
      const a = el("a", "mini-btn", mapLabel());
      a.href = mapUrl(b.addr);
      a.target = "_blank"; a.rel = "noopener";
      acts.appendChild(a);
    }
    if (acts.children.length) body.appendChild(acts);

    row.appendChild(body);
    box.appendChild(row);
  });
}

/* ===================== 일정 ===================== */
function renderDays() {
  const tabs   = $("#day-tabs");
  const panels = $("#day-panels");
  const days   = TRIP.days || [];

  days.forEach((d, i) => {
    const t = el("button", "tab" + (i === 0 ? " on" : ""), esc(d.label));
    t.type = "button";
    t.addEventListener("click", () => {
      [...tabs.children].forEach((x) => x.classList.remove("on"));
      t.classList.add("on");
      [...panels.children].forEach((p, j) => (p.hidden = j !== i));
    });
    tabs.appendChild(t);

    const p = el("div", "day-panel");
    p.hidden = i !== 0;

    const head = el("div", "day-head");
    head.appendChild(el("span", "day-pill", esc(d.label)));
    head.appendChild(el("span", "day-date", `${esc(d.date)} (${esc(d.dow)})`));
    p.appendChild(head);

    if (d.title)   p.appendChild(el("div", "day-title", esc(d.title)));
    if (d.summary) p.appendChild(el("div", "day-summary", esc(d.summary)));

    if (!(d.items || []).length) {
      p.appendChild(emptyBox("일정이 아직 비어 있어요.\ndata.js 의 days[].items 를 채우면 여기에 표시됩니다."));
    } else {
      const tl = el("div", "timeline");
      d.items.forEach((it) => {
        const r = el("div", "tl-row");
        r.appendChild(el("div", "tl-time", esc(it.time || "")));
        const c = cat(it.tag);
        const tag = it.tag
          ? `<span class="tl-tag" style="background:${c.color}1a;color:${c.color}">${c.icon} ${esc(c.label)}</span>`
          : "";
        r.appendChild(el("div", "tl-text", esc(it.text) + tag));
        tl.appendChild(r);
      });
      p.appendChild(tl);
    }
    panels.appendChild(p);
  });
}

/* ===================== 지도 ===================== */
let MAP, LAYER;
const mapState = { day: "all", cats: new Set(["all"]) };

function renderMap() {
  const dayTabs = $("#map-day-tabs");
  const opts = [...(TRIP.days || []).map((d) => ({ id: d.id, label: d.label })),
                { id: "all", label: "전체" }];
  opts.forEach((o) => {
    const t = el("button", "tab" + (o.id === "all" ? " on" : ""), esc(o.label));
    t.type = "button";
    t.addEventListener("click", () => {
      [...dayTabs.children].forEach((x) => x.classList.remove("on"));
      t.classList.add("on");
      mapState.day = o.id;
      drawMarkers();
    });
    dayTabs.appendChild(t);
  });

  const used = new Set((TRIP.places || []).map((p) => p.cat));
  const cf = $("#map-cat-filters");
  const mkChip = (key, label) => {
    const c = el("span", "chip" + (key === "all" ? " on" : ""), label);
    c.addEventListener("click", () => {
      if (key === "all") {
        mapState.cats = new Set(["all"]);
      } else {
        mapState.cats.delete("all");
        mapState.cats.has(key) ? mapState.cats.delete(key) : mapState.cats.add(key);
        if (!mapState.cats.size) mapState.cats.add("all");
      }
      [...cf.children].forEach((x) => x.classList.toggle("on", mapState.cats.has(x.dataset.key)));
      drawMarkers();
    });
    c.dataset.key = key;
    return c;
  };
  cf.appendChild(mkChip("all", "전체"));
  Object.keys(CATEGORIES).filter((k) => used.has(k))
    .forEach((k) => cf.appendChild(mkChip(k, `${CATEGORIES[k].icon} ${CATEGORIES[k].label}`)));

  $("#map-meta-title").textContent = TRIP.mapNote || "";

  if (typeof L === "undefined") {           // CDN 차단/오프라인
    $("#map").replaceWith(emptyBox("지도를 불러오지 못했어요.\n인터넷 연결을 확인해주세요."));
    drawList((TRIP.places || []));
    return;
  }

  MAP = L.map("map", { scrollWheelZoom: false })
        .setView([37.3186, 129.2648], 11);
  // CARTO 베이스맵이 API 키를 요구하게 바뀌어(타일 대신 워터마크가 옴)
  // 키 없이 쓸 수 있는 OSM 기본 타일로 교체했습니다.
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© OpenStreetMap contributors', maxZoom: 19
  }).addTo(MAP);
  LAYER = L.layerGroup().addTo(MAP);

  drawMarkers();
  setTimeout(() => MAP.invalidateSize(), 100);
}

function drawMarkers() {
  // 이번 렌더 세대. 앞선 경로 요청이 늦게 도착하면 이 번호가 안 맞아 버려집니다
  // (Day → 전체 로 바꿨을 때 이전 Day 의 경로가 남던 문제)
  const seq = ++ROUTE_SEQ;
  const dayMode = mapState.day !== "all";      // 하루만 볼 때는 순번 + 동선을 그립니다
  const list = (TRIP.places || []).filter((p) => {
    const okDay = mapState.day === "all" || (p.day || []).includes(mapState.day);
    const okCat = mapState.cats.has("all") || mapState.cats.has(p.cat);
    return okDay && okCat && p.lat && p.lng;
  });

  // 번호와 동선은 방문 순서를 따라야 합니다 — data.js 의 seq[dayId] 기준,
  // 안 적힌 곳은 뒤로 (filter 가 만든 새 배열이라 TRIP.places 는 그대로).
  if (dayMode) {
    const order = (p) => (p.seq && p.seq[mapState.day] != null) ? p.seq[mapState.day] : 9999;
    list.sort((a, b) => order(a) - order(b));
  }

  if (LAYER) {
    LAYER.clearLayers();
    const bounds = [];
    list.forEach((p, i) => {
      const c = cat(p.cat);
      const inner = dayMode ? `${i + 1}` : c.icon;
      const icon = L.divIcon({
        className: "",
        html: `<div class="pin${dayMode ? " pin-num" : ""}" style="background:${c.color}">` +
              `<span>${inner}</span></div>`,
        iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -28]
      });
      const t = dayMode ? placeTime(p) : "";
      L.marker([p.lat, p.lng], { icon })
        .bindPopup(`<b>${dayMode ? (i + 1) + ". " : ""}${esc(p.name)}</b>` +
                   (t ? ` <span class="pop-time">${esc(t)}</span>` : "") +
                   `${p.memo ? "<br>" + esc(p.memo) : ""}`)
        .addTo(LAYER);
      bounds.push([p.lat, p.lng]);
    });
    if (bounds.length > 1) MAP.fitBounds(bounds, { padding: [40, 40] });
    else if (bounds.length === 1) MAP.setView(bounds[0], 13);
  }

  // 바다를 건너는 날인지는 '그날 전체 장소' 로 판단합니다.
  // 필터로 배 핀만 꺼도 항로는 그대로이므로, 걸러진 목록으로 보면 판단이 뒤집힙니다.
  const daySea = dayMode && (TRIP.places || []).some(
    (p) => (p.day || []).includes(mapState.day) && (p.cat === "ferry" || p.sea));

  if (dayMode && list.length > 1) drawRoute(list, seq, daySea);
  else setRouteMeta(list.length, null, null);

  drawList(list, dayMode);
}

/* ---------- 동선 ----------
   순서는 data.js 의 places 배열 순서입니다 — 방문 순서대로 적어두면 그대로 이어집니다.
   먼저 직선으로 즉시 그려 놓고, OSRM 이 응답하면 실제 도로 경로로 바꿔 그립니다. */
let ROUTE_SEQ = 0;

const haversineKm = (a, b) => {
  const R = 6371, rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(b[0] - a[0]), dLng = rad(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 +
            Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

function setRouteMeta(count, straightKm, road) {
  const box = $("#map-meta-sub");
  const bits = [`📍 ${count}개 장소`];
  if (straightKm != null) bits.push(`🚗 직선 약 ${straightKm.toFixed(1)}km`);
  box.textContent = bits.join(" · ");

  const line = $("#map-route");
  if (!line) return;
  if (!road) {
    line.textContent = straightKm == null
      ? "Day 를 고르면 방문 순서와 도로 경로가 표시됩니다"
      : "🛣️ 실제 도로 경로를 불러오는 중…";
    line.hidden = false;
    return;
  }
  if (road.sea) {
    line.textContent = "⛴️ 배로 건너는 구간이 있어 도로 경로 대신 직선으로 표시합니다";
    return;
  }
  if (road.failed) {
    line.textContent = "🛣️ 도로 경로를 불러오지 못했어요 (직선 거리만 표시)";
    return;
  }
  const h = Math.floor(road.min / 60), m = road.min % 60;
  line.textContent =
    `🛣️ 실제 도로 경로: ${road.km.toFixed(1)} km · ⏱ 추정 주행 ${h ? h + "시간 " : ""}${m}분`;
}

function drawRoute(list, seq, daySea) {
  const pts = list.map((p) => [p.lat, p.lng]);
  const straightKm = pts.slice(1).reduce((a, p, i) => a + haversineKm(pts[i], p), 0);

  const guide = L.polyline(pts, {
    color: "#2f9dc0", weight: 3, opacity: .55, dashArray: "6 7"
  }).addTo(LAYER);
  setRouteMeta(list.length, straightKm, null);

  // 배로 건너는 날은 도로 경로를 묻지 않습니다 — OSRM 이 바다를 육로로 우회시켜
  // 말도 안 되는 거리·시간(예: 14시간)을 돌려줍니다. 점선과 직선 거리만 남깁니다.
  if (daySea) {
    setRouteMeta(list.length, straightKm, { sea: true });
    return;
  }

  const coords = list.map((p) => `${p.lng},${p.lat}`).join(";");
  fetch(`https://router.project-osrm.org/route/v1/driving/${coords}` +
        `?overview=full&geometries=geojson`)
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error("osrm " + r.status))))
    .then((j) => {
      if (seq !== ROUTE_SEQ) return;                    // 그 사이 다른 Day 로 바뀜
      const route = j.routes && j.routes[0];
      if (!route) throw new Error("no route");
      // 평균 15km/h 미만이면 차로 간 경로가 아닙니다 (페리 구간을 끼워 넣은 결과).
      // ferry 로 표시하지 않은 바다 구간이 있어도 엉터리 숫자가 안 나가게 하는 안전망.
      if (route.duration > 0 && (route.distance / 1000) / (route.duration / 3600) < 15)
        throw new Error("implausible driving route");
      LAYER.removeLayer(guide);
      L.polyline(route.geometry.coordinates.map((c) => [c[1], c[0]]), {
        color: "#2f9dc0", weight: 5, opacity: .85, lineJoin: "round"
      }).addTo(LAYER);
      setRouteMeta(list.length, straightKm,
        { km: route.distance / 1000, min: Math.round(route.duration / 60) });
    })
    .catch(() => {
      if (seq !== ROUTE_SEQ) return;
      setRouteMeta(list.length, straightKm, { failed: true });
    });
}

/* 그날 이 장소에 도착하는 시각 — data.js 의 places[].time[dayId] · 없으면 빈 문자열 */
const placeTime = (p) => (p.time && p.time[mapState.day]) || "";

function drawList(list, numbered) {
  const box = $("#map-list");
  box.innerHTML = "";
  if (!list.length) {
    box.appendChild(emptyBox("표시할 장소가 없어요."));
    return;
  }
  list.forEach((p, i) => {
    const c = cat(p.cat);
    const row = el("div", "place");
    if (numbered) {
      const t = placeTime(p);
      const col = el("div", "place-seqcol");
      col.appendChild(el("div", "place-seq", `${i + 1}`));
      if (t) col.appendChild(el("div", "place-time", esc(t)));
      row.appendChild(col);
    } else {
      row.appendChild(el("div", "place-ico", c.icon));
    }
    const b = el("div", "place-body");
    b.appendChild(el("div", "place-name", (numbered ? `${c.icon} ` : "") + esc(p.name)));
    b.appendChild(el("div", "place-memo", esc(p.memo || "")));
    row.appendChild(b);
    box.appendChild(row);
  });
}

/* ===================== 숙소 =====================
   숙소마다 카드 하나. rows: [{label, value}] 로 라벨-값을 나열합니다.
   값이 "" 이면 '미확정' 으로 흐리게 표시 — 빈칸이면 뭘 더 채워야 할지 안 보이므로.
   rows 가 없으면 예전 형식(lines 배열)도 그대로 렌더합니다.            */
function renderStay() {
  const box  = $("#stay");
  const stay = (TRIP.stays && TRIP.stays.length)
    ? TRIP.stays
    : (TRIP.bookings || []).filter((b) => b.type === "hotel");
  if (!stay.length) return box.appendChild(emptyBox("숙소 정보가 아직 없어요."));

  if (TRIP.stayNote) box.appendChild(el("p", "sec-sub", esc(TRIP.stayNote)));

  stay.forEach((s) => {
    const card = el("div", "stay-card");
    card.appendChild(el("div", "stay-name",
      esc([s.nights, s.title].filter(Boolean).join(" · "))));

    if ((s.rows || []).length) {
      const dl = el("dl", "stay-rows");
      s.rows.forEach((r) => {
        dl.appendChild(el("dt", "stay-dt", esc(r.label)));
        dl.appendChild(r.value
          ? el("dd", "stay-dd", esc(r.value))
          : el("dd", "stay-dd stay-tbd", "미확정"));
      });
      card.appendChild(dl);
    }
    (s.lines || []).forEach((l) => card.appendChild(el("div", "stay-line", esc(l))));

    const acts = el("div", "booking-acts");
    if (s.tel) {
      const a = el("a", "mini-btn", "📞 전화하기"); a.href = "tel:" + s.tel;
      acts.appendChild(a);
    }
    if (s.addr) {
      const a = el("a", "mini-btn", mapLabel());
      a.href = mapUrl(s.addr);
      a.target = "_blank"; a.rel = "noopener";
      const b = el("a", "mini-btn", "📋 주소 복사");
      b.href = "javascript:void(0)";
      b.addEventListener("click", () => {
        navigator.clipboard?.writeText(s.addr);
        b.textContent = "✅ 복사됨";
        setTimeout(() => (b.textContent = "📋 주소 복사"), 1500);
      });
      acts.append(a, b);
    }
    if (acts.children.length) card.appendChild(acts);
    box.appendChild(card);
  });
}

/* ===================== 견적 ===================== */
function renderCost() {
  const c = TRIP.cost, box = $("#cost-groups");
  if (!c || !box) return;
  $("#cost-basis").textContent = c.basis || "";
  $("#cost-per").textContent   = c.perPerson || "–";
  $("#cost-total").textContent = c.total || "–";

  (c.groups || []).forEach((g) => {
    const wrap = el("div", "chk-group");
    const head = el("div", "chk-head cost-head");
    head.appendChild(el("span", null, esc(g.title)));
    head.appendChild(el("span", "cost-sum", esc(g.total || "")));
    wrap.appendChild(head);
    (g.rows || []).forEach((r) => {
      const row  = el("div", "cost-row");
      const body = el("div", "cost-body");
      body.appendChild(el("div", "cost-name", esc(r.name)));
      if (r.detail) body.appendChild(el("div", "cost-detail", esc(r.detail)));
      row.append(body, el("div", "cost-amt", esc(r.amount || "")));
      wrap.appendChild(row);
    });
    box.appendChild(wrap);
  });
  $("#cost-notes").textContent = (c.notes || []).join("\n");
}

/* ===================== 참석자 ===================== */
function renderPeople() {
  const p = TRIP.people, box = $("#people-list");
  if (!p || !box) return;
  $("#people-sub").textContent  = `총 ${p.total}명 · ${(p.families || []).length}가족`;
  $("#people-note").textContent = p.note || "";

  (p.families || []).forEach((fam) => {
    const wrap = el("div", "chk-group");
    wrap.appendChild(el("div", "chk-head",
      esc(`${fam.no}. ${fam.label}`) + ` <span class="cost-sum">${fam.members.length}명</span>`));
    const row = el("div", "people-row");
    fam.members.forEach((name) => {
      const who   = PEOPLE.find((x) => x.name === name);
      const alias = who && who.alias ? ` <span class="people-alias">${esc(who.alias)}</span>` : "";
      row.appendChild(el("span", "chip people-chip" + (name === ME ? " on" : ""), esc(name) + alias));
    });
    wrap.appendChild(row);
    box.appendChild(wrap);
  });
}

/* ===================== 내 준비물 (Supabase · 사람별) =====================
   기본 목록(TRIP.prepDefaults)은 처음 들어온 사람에게 한 번만 복사됩니다.
   그 뒤 추가·삭제·체크는 전부 그 사람 행에만 반영됩니다. */
let MYLIST = [];

function paintPrep() {
  const n = MYLIST.length, done = MYLIST.filter((i) => i.checked).length;
  ["#prep-count", "#prep-count2"].forEach((sel) => {
    const node = $(sel); if (node) node.textContent = n ? `${done} / ${n}` : "–";
  });
  ["#prep-prog", "#prep-prog2"].forEach((sel) => {
    const node = $(sel); if (node) node.style.width = n ? Math.round((done / n) * 100) + "%" : "0%";
  });
  const tile = document.querySelector('.qnav-item[data-view="prep"] .qnav-meta');
  if (tile) tile.textContent = n ? `${done}/${n}개 체크` : "비어 있음";
}

function drawPrep() {
  const box = $("#checklist"); if (!box) return;
  box.innerHTML = "";
  if (!MYLIST.length) {
    box.appendChild(emptyBox("준비물이 비어 있어요.\n위 칸에 적어서 추가해 보세요."));
    paintPrep(); return;
  }
  const wrap = el("div", "chk-group");
  MYLIST.forEach((it) => {
    const row = el("div", "chk-item");
    const cb  = el("input");
    cb.type = "checkbox"; cb.id = "chk-" + it.id; cb.checked = !!it.checked;
    cb.addEventListener("change", async () => {
      it.checked = cb.checked; paintPrep();
      try {
        await supa(`${T.checklist}?id=eq.${it.id}`,
          { method: "PATCH", body: JSON.stringify({ checked: it.checked }) });
      } catch (e) { console.error(e); }
    });
    const lb = el("label", null, esc(it.label)); lb.htmlFor = cb.id;
    const del = el("button", "chk-del", "✕");
    del.type = "button"; del.title = "삭제";
    del.addEventListener("click", async () => {
      MYLIST = MYLIST.filter((x) => x.id !== it.id); drawPrep();
      try { await supa(`${T.checklist}?id=eq.${it.id}`, { method: "DELETE" }); }
      catch (e) { console.error(e); }
    });
    row.append(cb, lb, del);
    wrap.appendChild(row);
  });
  box.appendChild(wrap);
  paintPrep();
}

async function renderChecklist() {
  const who = $("#prep-who");
  if (who) who.textContent = ME ? `${ME} 님의 목록 — 추가·삭제한 건 나한테만 보입니다` : "";
  $("#prep-switch")?.addEventListener("click", () => {
    store.del(STORE_KEY + ":me"); location.reload();
  });
  if (!SUPA || !ME) return;

  const listUrl = `${T.checklist}?select=id,label,checked&person=eq.${enc(ME)}&order=id`;
  try {
    MYLIST = (await supa(listUrl)) || [];
    if (!MYLIST.length && (TRIP.prepDefaults || []).length) {
      await supa(T.checklist, {
        method: "POST",
        body: JSON.stringify(TRIP.prepDefaults.map((label) => ({ person: ME, label })))
      });
      MYLIST = (await supa(listUrl)) || [];
    }
  } catch (e) {
    console.error(e);
    $("#checklist").appendChild(emptyBox("준비물을 불러오지 못했어요.\n인터넷 연결을 확인해 주세요."));
    return;
  }
  drawPrep();

  $("#prep-form")?.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const input = $("#prep-input");
    const label = input.value.trim();
    if (!label) return;
    input.value = "";
    try {
      const rows = await supa(T.checklist, {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({ person: ME, label })
      });
      if (rows && rows[0]) MYLIST.push(rows[0]);
      drawPrep();
    } catch (e) { console.error(e); }
  });
}

/* ===================== 내 메모 (Supabase · 사람별) =====================
   한 칸에 계속 덮어쓰지 않고, 저장할 때마다 한 건씩 쌓입니다.
   각 메모는 따로 수정·삭제할 수 있습니다. */
let NOTES = [];

const memoTime = (iso) => {
  const d = new Date(iso);
  if (isNaN(d)) return "";
  const p = (n) => String(n).padStart(2, "0");
  return `${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
};

function drawNotes() {
  const box = $("#memo-list"); if (!box) return;
  box.innerHTML = "";
  if (!NOTES.length) {
    box.appendChild(emptyBox("아직 메모가 없어요.\n위에 적고 저장을 눌러보세요."));
    return;
  }
  NOTES.forEach((n) => box.appendChild(noteCard(n)));
}

function noteCard(n) {
  const card = el("div", "memo-item");
  const head = el("div", "memo-item-head");
  const when = n.updated_at && n.updated_at !== n.created_at
    ? `${memoTime(n.updated_at)} (수정됨)` : memoTime(n.created_at);
  head.appendChild(el("span", "memo-time", esc(when)));

  const acts  = el("span", "memo-acts");
  const bEdit = el("button", "memo-btn", "수정");       bEdit.type = "button";
  const bDel  = el("button", "memo-btn memo-btn-del", "삭제"); bDel.type = "button";
  acts.append(bEdit, bDel);
  head.appendChild(acts);

  const body = el("div", "memo-body");
  body.textContent = n.body;
  card.append(head, body);

  /* 수정 — 본문을 입력칸으로 바꿔치기 */
  bEdit.addEventListener("click", () => {
    const ta = el("textarea", "memo-box memo-box-edit");
    ta.value = n.body;
    const row    = el("div", "memo-actions");
    const save   = el("button", "prep-add-btn", "저장");  save.type = "button";
    const cancel = el("button", "memo-btn", "취소");      cancel.type = "button";
    row.append(cancel, save);
    body.replaceWith(ta); ta.after(row);
    acts.hidden = true; ta.focus();

    cancel.addEventListener("click", drawNotes);
    save.addEventListener("click", async () => {
      const v = ta.value.trim();
      if (!v) return;
      save.disabled = true;
      try {
        const rows = await supa(`${T.notes}?id=eq.${n.id}`, {
          method: "PATCH",
          headers: { Prefer: "return=representation" },
          body: JSON.stringify({ body: v, updated_at: new Date().toISOString() })
        });
        if (rows && rows[0]) Object.assign(n, rows[0]);
      } catch (e) { console.error(e); }
      drawNotes();
    });
  });

  /* 삭제 — 실수로 지우지 않게 한 번 더 묻습니다 */
  bDel.addEventListener("click", () => {
    if (bDel.dataset.armed !== "1") {
      bDel.dataset.armed = "1";
      bDel.textContent = "정말 삭제";
      setTimeout(() => {
        if (!bDel.isConnected) return;
        bDel.dataset.armed = ""; bDel.textContent = "삭제";
      }, 4000);
      return;
    }
    NOTES = NOTES.filter((x) => x.id !== n.id);
    drawNotes();
    supa(`${T.notes}?id=eq.${n.id}`, { method: "DELETE" }).catch((e) => console.error(e));
  });

  return card;
}

async function renderMemo() {
  const who = $("#memo-who");
  if (who) who.textContent = ME ? `${ME} 님의 메모 — 나만 보입니다` : "";
  const form = $("#memo-form"); if (!form || !SUPA || !ME) return;

  try {
    NOTES = (await supa(`${T.notes}?select=id,body,created_at,updated_at&person=eq.${enc(ME)}&order=id.desc`)) || [];
  } catch (e) {
    console.error(e);
    $("#memo-list").appendChild(emptyBox("메모를 불러오지 못했어요.\n인터넷 연결을 확인해 주세요."));
    return;
  }
  drawNotes();

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const box = $("#memo-box");
    const v = box.value.trim();
    if (!v) return;
    $("#memo-status").textContent = "저장 중…";
    try {
      const rows = await supa(T.notes, {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({ person: ME, body: v })
      });
      if (rows && rows[0]) NOTES.unshift(rows[0]);
      box.value = "";                       // 입력칸은 비우고 아래에 쌓습니다
      drawNotes();
      $("#memo-status").textContent = "저장됨 ✓";
      setTimeout(() => { $("#memo-status").textContent = ""; }, 2000);
    } catch (e) {
      console.error(e);
      $("#memo-status").textContent = "저장 실패 — 다시 눌러주세요";
    }
  });
}

/* ===================== 실행 ===================== */
function render() {
  // 한 섹션이 실패해도 나머지는 그려지도록
  // 지도(renderMap)는 '지도' 탭을 처음 열 때 초기화됩니다 — showView() 참고
  [renderHero, renderOverview, renderBookings, renderDays,
   renderStay, renderCost, renderPeople, renderNav]
    .forEach((fn) => {
      try { fn(); } catch (e) { console.error(fn.name, e); }
    });
  // Supabase 를 읽는 둘은 비동기 — 실패해도 나머지 화면은 그대로 둡니다
  renderChecklist().catch((e) => console.error("renderChecklist", e));
  renderMemo().catch((e) => console.error("renderMemo", e));
  $("#foot-text").textContent = TRIP.footer || "";
}

initGate();

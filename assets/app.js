/* =========================================================
   여행 대시보드 — 공용 렌더링 로직
   ─ 여행별 내용은 각자의 data.js (TRIP / CATEGORIES) 에만 있습니다.
   ─ 이 파일은 오키나와(/)와 삼척(/samcheok/)이 함께 씁니다.
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

/* ===================== 잠금 화면 ===================== */
function initGate() {
  const gate = $("#gate"), app = $("#app");
  const open = () => {
    gate.remove();
    app.hidden = false;
    render();
  };
  if (store.get(STORE_KEY + ":auth") === "1") return open();

  $("#gate-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const v = $("#gate-input").value.trim();
    if (v === String(TRIP.meta.password)) {
      store.set(STORE_KEY + ":auth", "1");
      open();
    } else {
      $("#gate-err").hidden = false;
      $("#gate-err").textContent = "비밀번호가 맞지 않아요 🥲";
      const c = $(".gate-card");
      c.classList.remove("shake");
      void c.offsetWidth;
      c.classList.add("shake");
      $("#gate-input").value = "";
      $("#gate-input").focus();
    }
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
  { id: "food",   icon: "🍜",  label: "맛집",    title: "맛집"       },
  { id: "prep",   icon: "🎒",  label: "준비물",  title: "준비물"     }
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
  food() {
    const f = TRIP.food || {};
    const n = (f.local || []).length + (f.candidates || []).length;
    return { text: n ? `${n}곳 정리됨` : "맛집 미정", done: n > 0 };
  },
  prep() {
    const keys = chkKeys();
    const done = keys.filter((k) => chkSaved[k]).length;
    return { text: keys.length ? `${done}/${keys.length}개 체크` : "준비물 미정", done: keys.length > 0 };
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
   출발 전/여행 중/종료 배너 + 마지막 날 타임라인.
   마지막 날은 days 의 맨 뒤를 그대로 씁니다.                 */
function renderOverview() {
  const m = TRIP.meta || {};
  const days = TRIP.days || [];
  const last = days[days.length - 1];

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const start = new Date(m.startDate + "T00:00:00");
  const end   = new Date((m.endDate || m.startDate) + "T00:00:00");
  const diff  = Math.round((start - today) / 86400000);

  let title, sub, note;
  if (today > end)        { title = `여행 종료 ${m.emoji || "🌺"}`; sub = "즐거운 여행이었기를"; note = "귀국 후"; }
  else if (today >= start){ title = "여행 중 ✈️";  sub = "오늘 일정은 '일정' 탭에서";      note = "여행 중"; }
  else                    { title = `출발까지 D-${diff}`; sub = "확정된 것과 아직 안 정해진 것"; note = "출발 전"; }

  $("#ov-sub").textContent = note;
  const banner = $("#ov-banner");
  banner.appendChild(el("div", "ov-banner-t", esc(title)));
  banner.appendChild(el("div", "ov-banner-s",
    esc(`${m.startDate} ~ ${m.endDate || m.startDate} · ${sub}`)));

  const box = $("#ov-lastday");
  if (!last || !(last.items || []).length) {
    box.appendChild(emptyBox("마지막 날 일정이 아직 비어 있어요."));
    return;
  }
  const tl = el("div", "timeline");
  last.items.forEach((it) => {
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
  train: "🚆", bus: "🚌", etc: "📌"
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
  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    attribution: '© OpenStreetMap © CARTO', maxZoom: 19
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
      L.marker([p.lat, p.lng], { icon })
        .bindPopup(`<b>${dayMode ? (i + 1) + ". " : ""}${esc(p.name)}</b>` +
                   `${p.memo ? "<br>" + esc(p.memo) : ""}`)
        .addTo(LAYER);
      bounds.push([p.lat, p.lng]);
    });
    if (bounds.length > 1) MAP.fitBounds(bounds, { padding: [40, 40] });
    else if (bounds.length === 1) MAP.setView(bounds[0], 13);
  }

  if (dayMode && list.length > 1) drawRoute(list, seq);
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
  if (road.failed) {
    line.textContent = "🛣️ 도로 경로를 불러오지 못했어요 (직선 거리만 표시)";
    return;
  }
  const h = Math.floor(road.min / 60), m = road.min % 60;
  line.textContent =
    `🛣️ 실제 도로 경로: ${road.km.toFixed(1)} km · ⏱ 추정 주행 ${h ? h + "시간 " : ""}${m}분`;
}

function drawRoute(list, seq) {
  const pts = list.map((p) => [p.lat, p.lng]);
  const straightKm = pts.slice(1).reduce((a, p, i) => a + haversineKm(pts[i], p), 0);

  const guide = L.polyline(pts, {
    color: "#2f9dc0", weight: 3, opacity: .55, dashArray: "6 7"
  }).addTo(LAYER);
  setRouteMeta(list.length, straightKm, null);

  const coords = list.map((p) => `${p.lng},${p.lat}`).join(";");
  fetch(`https://router.project-osrm.org/route/v1/driving/${coords}` +
        `?overview=full&geometries=geojson`)
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error("osrm " + r.status))))
    .then((j) => {
      if (seq !== ROUTE_SEQ) return;                    // 그 사이 다른 Day 로 바뀜
      const route = j.routes && j.routes[0];
      if (!route) throw new Error("no route");
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
    row.appendChild(numbered
      ? el("div", "place-ico place-seq", `${i + 1}`)
      : el("div", "place-ico", c.icon));
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

/* ===================== 맛집 ===================== */
function renderFood() {
  const f = TRIP.food || {};
  $("#food-local-title").textContent = f.localTitle || "";

  const tbl = $("#food-local");
  if ((f.local || []).length) {
    tbl.innerHTML =
      "<thead><tr><th>음식</th><th>설명</th></tr></thead><tbody>" +
      f.local.map((r) => `<tr><td>${esc(r.name)}</td><td>${esc(r.desc)}</td></tr>`).join("") +
      "</tbody>";
  } else {
    tbl.closest(".table-wrap").replaceWith(emptyBox("대표 음식 목록이 아직 비어 있어요."));
  }

  const box = $("#food-cand");
  (f.candidates || []).forEach((c) => {
    const row = el("div", "place");
    row.appendChild(el("div", "place-ico", cat(c.cat).icon || "🍽️"));
    const b = el("div", "place-body");
    b.appendChild(el("div", "place-name", esc(c.name)));
    b.appendChild(el("div", "place-memo", esc(c.memo || "")));
    row.appendChild(b);
    box.appendChild(row);
  });

  $("#food-note").textContent = f.note || "";
}

/* ===================== 준비물 ===================== */
/* 홈 피드와 준비물 탭에 같은 목록을 두 벌 그리고, 체크 상태는 저장 키로 묶어 함께 움직입니다.
   저장 키는 두 곳이 공유하고, DOM id 만 접두사로 구분합니다. */
let chkSaved = {};

const chkGroups = () => (TRIP.checklist || []).filter((g) => (g.items || []).length);
/* 저장 키는 순번이 아니라 '그룹|항목' 글자로 잡습니다 —
   목록에서 항목을 지우거나 순서를 바꿔도 체크가 옆줄로 옮겨붙지 않게. */
const chkKey    = (g, item) => `${g.group}|${item}`;
const chkKeys   = () => chkGroups().flatMap((g) => g.items.map((it) => chkKey(g, it)));

function paintChkProgress() {
  const keys = chkKeys();
  const done = keys.filter((k) => chkSaved[k]).length;
  $("#prep-count").textContent = keys.length ? `${done} / ${keys.length}` : "–";
  $("#prep-prog").style.width  = keys.length ? Math.round((done / keys.length) * 100) + "%" : "0%";

  // 홈 카테고리 타일(준비물)도 같은 숫자를 보여줍니다 — 탭바 렌더 이후에만 존재
  const tile = document.querySelector('.qnav-item[data-view="prep"] .qnav-meta');
  if (tile && keys.length) tile.textContent = `${done}/${keys.length}개 체크`;
}

function setChk(key, on) {
  chkSaved[key] = on;
  store.set(STORE_KEY + ":chk", JSON.stringify(chkSaved));
  document.querySelectorAll("input[data-chk]").forEach((c) => {
    if (c.dataset.chk === key) c.checked = on;
  });
  paintChkProgress();
}

function buildChecklist(box, prefix) {
  const groups = chkGroups();
  if (!groups.length) {
    box.appendChild(emptyBox("준비물 목록이 아직 비어 있어요."));
    return false;
  }
  groups.forEach((g, gi) => {
    const wrap = el("div", "chk-group");
    wrap.appendChild(el("div", "chk-head", esc(g.group)));
    g.items.forEach((item, ii) => {
      const key = chkKey(g, item);
      const row = el("div", "chk-item");
      const cb  = el("input");
      cb.type = "checkbox";
      cb.id = `${prefix}-${gi}-${ii}`;
      cb.dataset.chk = key;
      cb.checked = !!chkSaved[key];
      cb.addEventListener("change", () => setChk(key, cb.checked));
      const lb = el("label", null, esc(item));
      lb.htmlFor = cb.id;
      row.append(cb, lb);
      wrap.appendChild(row);
    });
    box.appendChild(wrap);
  });
  return true;
}

function renderChecklist() {
  try { chkSaved = JSON.parse(store.get(STORE_KEY + ":chk") || "{}"); } catch { chkSaved = {}; }

  const ok = buildChecklist($("#checklist"), "chk");
  buildChecklist($("#checklist-home"), "chkh");
  paintChkProgress();

  if (!ok) {
    $("#checklist-reset").remove();
    $("#prep-more").remove();
    return;
  }

  $("#checklist-reset").addEventListener("click", () => {
    chkSaved = {};
    store.del(STORE_KEY + ":chk");
    document.querySelectorAll("input[data-chk]").forEach((c) => (c.checked = false));
    paintChkProgress();
  });
}

/* ===================== 실행 ===================== */
function render() {
  // 한 섹션이 실패해도 나머지는 그려지도록
  // 지도(renderMap)는 '지도' 탭을 처음 열 때 초기화됩니다 — showView() 참고
  [renderHero, renderOverview, renderBookings, renderDays,
   renderStay, renderFood, renderChecklist, renderNav]
    .forEach((fn) => {
      try { fn(); } catch (e) { console.error(fn.name, e); }
    });
  $("#foot-text").textContent = TRIP.footer || "";
}

initGate();

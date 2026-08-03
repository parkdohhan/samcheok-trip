/* =========================================================
   삼척 여행 대시보드 — 렌더링 로직
   (데이터는 assets/data.js 만 수정하면 됩니다)
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
const won = (n) => "₩" + Number(n).toLocaleString("ko-KR");
const emptyBox = (msg) => el("div", "empty", msg);

const STORE_KEY = "samcheok-2026-08";

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
  { id: "budget", icon: "💰",  label: "예산",    title: "예산"       },
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
    const s = (TRIP.bookings || []).filter((b) => b.type === "hotel");
    return { text: s.length ? s[0].title : "숙소 미정", done: s.length > 0 };
  },
  food() {
    const f = TRIP.food || {};
    const n = (f.local || []).length + (f.candidates || []).length;
    return { text: n ? `${n}곳 정리됨` : "맛집 미정", done: n > 0 };
  },
  budget() {
    const rows = (TRIP.budget || {}).rows || [];
    const sum  = rows.reduce((a, r) => a + (Number(r.amount) || 0), 0);
    return { text: rows.length ? `${won(sum)} 예상` : "예산 미정", done: rows.length > 0 };
  },
  prep() {
    const n = (TRIP.checklist || []).reduce((a, g) => a + (g.items || []).length, 0);
    return { text: n ? `${n}개 항목` : "준비물 미정", done: n > 0 };
  }
};

let mapReady = false;

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
  if (push !== false && location.hash.slice(1) !== v.id) location.hash = v.id;
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
    item.addEventListener("click", () => showView(v.id));
    grid.appendChild(item);
  });

  const total = VIEWS.length - 1;
  $("#qnav-count").textContent = `${done} / ${total}`;
  $("#qnav-prog").style.width = Math.round((done / total) * 100) + "%";

  window.addEventListener("hashchange", () => showView(location.hash.slice(1), false));
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
      const a = el("a", "mini-btn", "🗺️ 지도");
      a.href = "https://map.kakao.com/link/search/" + encodeURIComponent(b.addr);
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
  const list = (TRIP.places || []).filter((p) => {
    const okDay = mapState.day === "all" || (p.day || []).includes(mapState.day);
    const okCat = mapState.cats.has("all") || mapState.cats.has(p.cat);
    return okDay && okCat && p.lat && p.lng;
  });

  if (LAYER) {
    LAYER.clearLayers();
    const bounds = [];
    list.forEach((p) => {
      const c = cat(p.cat);
      const icon = L.divIcon({
        className: "",
        html: `<div class="pin" style="background:${c.color}"><span>${c.icon}</span></div>`,
        iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -28]
      });
      L.marker([p.lat, p.lng], { icon })
        .bindPopup(`<b>${esc(p.name)}</b>${p.memo ? "<br>" + esc(p.memo) : ""}`)
        .addTo(LAYER);
      bounds.push([p.lat, p.lng]);
    });
    if (bounds.length > 1) MAP.fitBounds(bounds, { padding: [40, 40] });
    else if (bounds.length === 1) MAP.setView(bounds[0], 13);
  }

  $("#map-meta-sub").textContent = `${list.length}개 장소 표시`;
  drawList(list);
}

function drawList(list) {
  const box = $("#map-list");
  box.innerHTML = "";
  if (!list.length) {
    box.appendChild(emptyBox("표시할 장소가 없어요."));
    return;
  }
  list.forEach((p) => {
    const c = cat(p.cat);
    const row = el("div", "place");
    row.appendChild(el("div", "place-ico", c.icon));
    const b = el("div", "place-body");
    b.appendChild(el("div", "place-name", esc(p.name)));
    b.appendChild(el("div", "place-memo", esc(p.memo || "")));
    row.appendChild(b);
    box.appendChild(row);
  });
}

/* ===================== 숙소 ===================== */
function renderStay() {
  const box  = $("#stay");
  const stay = (TRIP.bookings || []).filter((b) => b.type === "hotel");
  if (!stay.length) return box.appendChild(emptyBox("숙소 정보가 아직 없어요."));

  stay.forEach((s) => {
    box.appendChild(el("div", "stay-name", esc(s.title)));
    (s.lines || []).forEach((l) => box.appendChild(el("div", "stay-line", esc(l))));
    const acts = el("div", "booking-acts");
    if (s.tel) {
      const a = el("a", "mini-btn", "📞 전화하기"); a.href = "tel:" + s.tel;
      acts.appendChild(a);
    }
    if (s.addr) {
      const a = el("a", "mini-btn", "🗺️ 카카오맵");
      a.href = "https://map.kakao.com/link/search/" + encodeURIComponent(s.addr);
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
    box.appendChild(acts);
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

/* ===================== 예산 ===================== */
function renderBudget() {
  const bg   = TRIP.budget || {};
  const rows = bg.rows || [];
  const tbl  = $("#budget");

  if (!rows.length) {
    tbl.closest(".table-wrap").replaceWith(emptyBox("예산 항목이 아직 비어 있어요."));
    $("#budget-total").remove();
    return;
  }
  tbl.innerHTML =
    "<thead><tr><th>항목</th><th>메모</th><th style='text-align:right'>금액</th></tr></thead><tbody>" +
    rows.map((r) =>
      `<tr><td>${esc(r.name)}</td><td>${esc(r.memo || "")}</td>` +
      `<td class="num">${r.amount ? won(r.amount) : "-"}</td></tr>`).join("") +
    "</tbody>";

  const sum = rows.reduce((a, r) => a + (Number(r.amount) || 0), 0);
  $("#budget-total").innerHTML =
    `<span>합계</span><span>${esc(bg.total || won(sum))}</span>`;
}

/* ===================== 준비물 ===================== */
function renderChecklist() {
  const box   = $("#checklist");
  let saved = {};
  try { saved = JSON.parse(store.get(STORE_KEY + ":chk") || "{}"); } catch { saved = {}; }
  const groups = (TRIP.checklist || []).filter((g) => (g.items || []).length);

  if (!groups.length) {
    box.appendChild(emptyBox("준비물 목록이 아직 비어 있어요."));
    $("#checklist-reset").remove();
    return;
  }

  groups.forEach((g, gi) => {
    const wrap = el("div", "chk-group");
    wrap.appendChild(el("div", "chk-head", esc(g.group)));
    g.items.forEach((item, ii) => {
      const id  = `chk-${gi}-${ii}`;
      const row = el("div", "chk-item");
      const cb  = el("input");
      cb.type = "checkbox"; cb.id = id; cb.checked = !!saved[id];
      cb.addEventListener("change", () => {
        saved[id] = cb.checked;
        store.set(STORE_KEY + ":chk", JSON.stringify(saved));
      });
      const lb = el("label", null, esc(item));
      lb.htmlFor = id;
      row.append(cb, lb);
      wrap.appendChild(row);
    });
    box.appendChild(wrap);
  });

  $("#checklist-reset").addEventListener("click", () => {
    store.del(STORE_KEY + ":chk");
    box.querySelectorAll("input[type=checkbox]").forEach((c) => (c.checked = false));
  });
}

/* ===================== 실행 ===================== */
function render() {
  // 한 섹션이 실패해도 나머지는 그려지도록
  // 지도(renderMap)는 '지도' 탭을 처음 열 때 초기화됩니다 — showView() 참고
  [renderHero, renderBookings, renderDays,
   renderStay, renderFood, renderBudget, renderChecklist, renderNav]
    .forEach((fn) => {
      try { fn(); } catch (e) { console.error(fn.name, e); }
    });
  $("#foot-text").textContent = TRIP.footer || "";
}

initGate();

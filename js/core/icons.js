/* 线性图标库 — 返回 SVG 字符串（stroke 继承 currentColor） */
(function (G) {
  const I = {};
  const wrap = (p, sz) => `<svg viewBox="0 0 24 24" width="${sz || 20}" height="${sz || 20}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;

  /* 导航 */
  I.home = (s) => wrap('<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9.5 21v-6.5h5V21"/>', s);
  I.book = (s) => wrap('<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 0 4 22z"/><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>', s);
  I.case = (s) => wrap('<rect x="3" y="7" width="18" height="14" rx="2.5"/><path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7"/><path d="M3 12.5h18"/>', s);
  I.grid = (s) => wrap('<rect x="3" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5"/>', s);
  I.me = (s) => wrap('<circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/>', s);
  I.search = (s) => wrap('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>', s);
  I.setting = (s) => wrap('<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3m0 13v3M4.2 4.2l2.1 2.1m11.4 11.4 2.1 2.1M2.5 12h3m13 0h3M4.2 19.8l2.1-2.1m11.4-11.4 2.1-2.1"/>', s);
  I.library = (s) => wrap('<path d="M4 4h4v16H4zM10 4h4v16h-4z"/><path d="m16.5 4.8 3.2 15.4"/>', s);

  /* 模块 */
  I.compass = (s) => wrap('<circle cx="12" cy="12" r="9"/><path d="m15.6 8.4-1.9 5.3-5.3 1.9 1.9-5.3z"/>', s);
  I.x = (s) => wrap('<path d="M4 4l16 16"/><path d="M20 4 4 20"/>', s);
  I.facebook = (s) => wrap('<path d="M15.5 3.5h-2A4 4 0 0 0 9.5 7.5V10H7v4h2.5v7h4v-7h3l.8-4h-3.8V7.8c0-.7.4-1.1 1.1-1.1h2.9z"/>', s);
  I.youtube = (s) => wrap('<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="m10 9.6 5 2.4-5 2.4z"/>', s);
  I.tiktok = (s) => wrap('<path d="M14.5 3v9.8a3.9 3.9 0 1 1-3.9-3.9"/><path d="M14.5 3c.3 2.4 1.9 4 4.3 4.3"/>', s);
  I.instagram = (s) => wrap('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".9" fill="currentColor" stroke="none"/>', s);
  I.linkedin = (s) => wrap('<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7.2 10.5V17M7.2 7.3v.1M11.4 17v-3.6a2.2 2.2 0 0 1 4.4 0V17"/>', s);
  I.target = (s) => wrap('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4"/>', s);
  I.ship = (s) => wrap('<path d="M3 16.5 5 21h14l2-4.5"/><path d="M5.5 16.5V9L12 4.5 18.5 9v7.5"/><path d="M12 4.5v12"/>', s);
  I.flag = (s) => wrap('<path d="M5.5 21V4"/><path d="M5.5 4.5h8.5l-1 3h6l-2 4 2 4h-6l-1-3H5.5"/>', s);
  I.doc = (s) => wrap('<path d="M6 3h7l5 5v13H6z"/><path d="M13 3v5h5"/><path d="M9 13h6M9 17h4"/>', s);
  I.clock = (s) => wrap('<circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/>', s);
  I.check = (s) => wrap('<path d="M20 6.5 9.5 17 4.5 12"/>', s);
  I.star = (s) => wrap('<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8L3.5 9.7l5.9-.8z"/>', s);
  I.note = (s) => wrap('<path d="M5 4h14v16l-4-2.5L12 20l-3-2.5L5 20z"/><path d="M8.5 9h7M8.5 12.5h5"/>', s);
  I.lock = (s) => wrap('<rect x="4.5" y="10" width="15" height="10.5" rx="2.5"/><path d="M8 10V7.5a4 4 0 0 1 8 0V10"/>', s);
  I.arrow = (s) => wrap('<path d="M5 12h13"/><path d="m13 6.5 5.5 5.5-5.5 5.5"/>', s);
  I.back = (s) => wrap('<path d="M15 18.5 8.5 12 15 5.5"/>', s);
  I.plus = (s) => wrap('<path d="M12 5v14M5 12h14"/>', s);
  I.trash = (s) => wrap('<path d="M4.5 7h15"/><path d="M9.5 7V4.5h5V7"/><path d="M6.5 7l1 13h9l1-13"/>', s);
  I.refresh = (s) => wrap('<path d="M20 11a8 8 0 1 0-2.3 6"/><path d="M20 5v6h-6"/>', s);
  I.play = (s) => wrap('<circle cx="12" cy="12" r="9"/><path d="m10 8.5 6 3.5-6 3.5z"/>', s);
  I.globe = (s) => wrap('<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z"/>', s);
  I.chart = (s) => wrap('<path d="M4 20V10M10 20V4M16 20v-7"/><path d="M21 20H3"/>', s);
  I.megaphone = (s) => wrap('<path d="M3.5 11v2a1 1 0 0 0 1 1H8l8 4.5V4.5L8 9H4.5a1 1 0 0 0-1 1z"/><path d="M18 9.5a4 4 0 0 1 0 5"/>', s);
  I.brain = (s) => wrap('<path d="M9.5 3.5A3 3 0 0 0 7 6.5 3 3 0 0 0 5.5 12 3 3 0 0 0 7 17.5a3 3 0 0 0 2.5 3V3.5z"/><path d="M14.5 3.5a3 3 0 0 1 2.5 3 3 3 0 0 1 1.5 5.5 3 3 0 0 1-1.5 5.5 3 3 0 0 1-2.5 3V3.5z"/>', s);
  I.network = (s) => wrap('<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M12 7.5 5.5 16.8M12 7.5l6.5 9.3M7.5 19h9"/>', s);
  I.blob = (s) => wrap('<circle cx="12" cy="12" r="8"/>', s);

  G.icons = I;
  G.icon = (name, size) => (I[name] ? I[name](size) : I.blob(size));
})(window.GBA = window.GBA || {});

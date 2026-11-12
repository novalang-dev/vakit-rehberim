// Diyanet Offline Hesaplama Motoru (Z-Engine)
const R = Math.PI / 180, D = 180 / Math.PI;
const SIN = a => Math.sin(a * R), COS = a => Math.cos(a * R), TAN = a => Math.tan(a * R);
const ASIN = x => Math.asin(x) * D, ACOS = x => Math.acos(Math.max(-1, Math.min(1, x))) * D;
const ACOT = x => Math.atan(1 / x) * D;
const fxa = a => a - 360 * Math.floor(a / 360), fxh = h => h - 24 * Math.floor(h / 24);

function jd(y, m, d) { 
  if (m <= 2) { y--; m += 12 } 
  let A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4); 
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
}

function sunPos(j) {
  let T = (j - 2451545) / 36525, L0 = fxa(280.46646 + 36000.76983 * T + .0003032 * T * T), M = fxa(357.52911 + 35999.05029 * T - .0001537 * T * T),
    e = .016708634 - .000042037 * T - .0000001267 * T * T,
    C = (1.914602 - .004817 * T - .000014 * T * T) * SIN(M) + (.019993 - .000101 * T) * SIN(2 * M) + .000289 * SIN(3 * M),
    om = fxa(125.04 - 1934.136 * T), lam = L0 + C - .00569 - .00478 * SIN(om),
    eps = 23 + (26 + (21.448 - 46.815 * T - .00059 * T * T + .001813 * T * T * T) / 60) / 60 + .00256 * COS(om),
    decl = ASIN(SIN(eps) * SIN(lam)), y2 = TAN(eps / 2) ** 2,
    eqt = y2 * SIN(2 * L0) - 2 * e * SIN(M) + 4 * e * y2 * SIN(M) * COS(2 * L0) - .5 * y2 * y2 * SIN(4 * L0) - 1.25 * e * e * SIN(2 * M);
  return { decl, eqt: eqt * D * 4 / 60 };
}

function ha(a, lat, d) { 
  let n = -SIN(a) - SIN(lat) * SIN(d), dn = COS(lat) * COS(d), r = n / dn; 
  if (r > 1 || r < -1) return 0; 
  return ACOS(r) / 15; 
}

function getDayOfYear(y, m, d) {
  let start = new Date(y, 0, 0);
  let now = new Date(y, m - 1, d);
  let diff = now - start;
  return Math.round(diff / 86400000) - 1;
}

function getTimes(y, m, d, city, dist) {
  // IL_ILCE_DB, db.js dosyasından global olarak gelir
  if (typeof IL_ILCE_DB === 'undefined' || !IL_ILCE_DB[city] || !IL_ILCE_DB[city][dist]) {
    return null;
  }
  
  const co = IL_ILCE_DB[city][dist];

  let deltas = [0, 0, 0, 0, 0, 0];
  if (co.har) {
    let doy = getDayOfYear(y, m, d);
    let idx = Math.max(0, Math.min(364, doy)) * 6;
    deltas = [
      co.har.charCodeAt(idx) - 77,
      co.har.charCodeAt(idx + 1) - 77,
      co.har.charCodeAt(idx + 2) - 77,
      co.har.charCodeAt(idx + 3) - 77,
      co.har.charCodeAt(idx + 4) - 77,
      co.har.charCodeAt(idx + 5) - 77
    ];
  } else if (co.off) {
    deltas = co.off;
  }

  let j = jd(y, m, d);
  let s = sunPos(j);
  let tz = 3; // Türkiye için sabit UTC+3
  
  if (co.tz) {
    if (typeof co.tz === 'number') {
      tz = co.tz;
    } else {
      try {
        let dateUTC = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
        let str = new Intl.DateTimeFormat('en-US', { timeZone: co.tz, timeZoneName: 'shortOffset' }).format(dateUTC);
        let match = str.match(/(?:GMT|UTC)([-+]\d+)(?::(\d+))?/);
        if (match) {
          tz = parseInt(match[1]) + (match[2] ? parseInt(match[2]) / 60 * (match[1][0] === '-' ? -1 : 1) : 0);
        } else {
          tz = 0;
        }
      } catch (e) { tz = -8; }
    }
  }
  
  let transit = 12 + tz - (co.lng / 15.0) - s.eqt;
  let dip = 0.0347 * Math.sqrt(Math.max(0, co.alt || 0));
  let sr_ang = (50 / 60.0) + dip;

  let hf = ha(18.0, co.lat, s.decl);
  let hss = ha(sr_ang, co.lat, s.decl);
  let hi = ha(17.0, co.lat, s.decl);

  let an = SIN(ACOT(1 + TAN(Math.abs(s.decl - co.lat)))) - SIN(co.lat) * SIN(s.decl);
  let hasr = ACOS(an / (COS(co.lat) * COS(s.decl))) / 15.0;

  let raw = [
    transit - hf + deltas[0] / 60.0,
    transit - hss + deltas[1] / 60.0,
    transit + deltas[2] / 60.0,
    transit + hasr + deltas[3] / 60.0,
    transit + hss + deltas[4] / 60.0,
    transit + hi + deltas[5] / 60.0
  ];

  const tm = raw.map(h => {
    let mins = Math.round((h - Math.floor(h)) * 60 - 0.035);
    let hrs = Math.floor(h);
    if (mins === 60) { mins = 0; hrs += 1; }
    if (mins < 0) { mins = 59; hrs -= 1; }
    if (hrs >= 24) { hrs -= 24; }
    return String(hrs).padStart(2, '0') + ':' + String(mins).padStart(2, '0');
  });

  return {
    imsak: tm[0], gunes: tm[1], ogle: tm[2],
    ikindi: tm[3], aksam: tm[4], yatsi: tm[5]
  };
}

// app.js'in bu fonksiyonu görebilmesi için pencereye (window) ekliyoruz
if (typeof window !== 'undefined') {
  window.getTimes = getTimes;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getTimes };
}

if (typeof module !== 'undefined' && module.exports) { module.exports = { getTimes }; }
const VAKIT_NAMES = {
  imsak: 'İmsak', gunes: 'Güneş', ogle: 'Öğle',
  ikindi: 'İkindi', aksam: 'Akşam', yatsi: 'Yatsı'
};

const VAKIT_IKONLARI = {
  imsak: 'fa-solid fa-moon', gunes: 'fa-solid fa-sun', ogle: 'fa-solid fa-sun',
  ikindi: 'fa-solid fa-cloud-sun', aksam: 'fa-solid fa-sun', yatsi: 'fa-solid fa-star'
};

// SENİN GERÇEK PUBLIC KEY'İN
const VAPID_PUBLIC_KEY = 'BFp2c82iiKMGd-mEGXKuP4jwA39rZM40O6Izs0jJID3WhWZ8SAMY-3HzBI_M_h_SWwsfrChe3hBApv6YrKzlW98';

let geriSayimInterval = null;
let sonAktifVakit = null;

// URLBase64 Çevirici
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

// Tarihleri Güncelle
function tarihleriGuncelle() {
  const now = new Date();
  document.getElementById('miladiGun').textContent = now.getDate();
  document.getElementById('miladiAy').textContent = now.toLocaleDateString('tr-TR', { month: 'long' });
  document.getElementById('miladiYil').textContent = now.getFullYear();
  document.getElementById('yerelSaat').textContent = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  try {
    const hicriDate = new Intl.DateTimeFormat('tr-TR-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' }).formatToParts(now);
    document.getElementById('hijriGun').textContent = hicriDate.find(p => p.type === 'day').value;
    document.getElementById('hijriAy').textContent = hicriDate.find(p => p.type === 'month').value;
    document.getElementById('hijriYil').textContent = hicriDate.find(p => p.type === 'year').value;
  } catch(e) {}
}

// Yatay Menü
function renderHorizontalVakitler(vakitler, aktifVakit) {
  const container = document.getElementById('horizontalVakitler');
  if (!container) return;
  container.innerHTML = '';
  Object.entries(VAKIT_NAMES).forEach(([key, name]) => {
    const item = document.createElement('div');
    item.className = `h-vakit-item ${key === aktifVakit ? 'active' : ''}`;
    item.innerHTML = `
      <span class="h-name">${name}</span>
      <i class="h-icon ${VAKIT_IKONLARI[key]}"></i>
      <span class="h-time">${vakitler[key] || '--:--'}</span>
    `;
    container.appendChild(item);
  });
}

// Haftalık Tablo
function renderWeeklyTable(vakitler, city, dist) {
  const tbody = document.getElementById('weeklyTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  
  const gunler = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
  const bugun = new Date();

  for(let i=0; i<7; i++) {
    let hedefTarih = new Date(bugun);
    hedefTarih.setDate(bugun.getDate() + i);
    
    const y = hedefTarih.getFullYear();
    const m = hedefTarih.getMonth() + 1;
    const d = hedefTarih.getDate();
    
    const gVakit = getTimes(y, m, d, city, dist);
    
    const tr = document.createElement('tr');
    const gunAdi = i === 0 ? 'Bugün' : gunler[hedefTarih.getDay()];
    
    const displayVakit = gVakit || vakitler;
    
    tr.innerHTML = `
      <td>${gunAdi}</td>
      <td>${displayVakit.imsak}</td><td>${displayVakit.gunes}</td><td>${displayVakit.ogle}</td>
      <td>${displayVakit.ikindi}</td><td>${displayVakit.aksam}</td><td>${displayVakit.yatsi}</td>
    `;
    tbody.appendChild(tr);
  }
}

// Günün İçerikleri
function gununIcerikleriniYukle() {
  if(typeof Icerikler === 'undefined') return;
  const a = Icerikler.genelAyetler[Math.floor(Math.random() * Icerikler.genelAyetler.length)];
  document.getElementById('gununAyeti').textContent = `"${a.metin}" (${a.kaynak})`;
  const h = Icerikler.genelHadisler[Math.floor(Math.random() * Icerikler.genelHadisler.length)];
  document.getElementById('gununHadisi').textContent = `"${h.metin}" (${h.kaynak})`;
  const d = Icerikler.genelDualar[Math.floor(Math.random() * Icerikler.genelDualar.length)];
  document.getElementById('gununDuasi').textContent = `${d.baslik}: ${d.anlam}`;
}

// Vakit Bulma
function sonrakiVakitBul(vakitler) {
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const sirali = Object.keys(VAKIT_NAMES).map(key => {
    const [h, m] = (vakitler[key] || '00:00').split(':').map(Number);
    return { key, name: VAKIT_NAMES[key], min: h * 60 + m };
  });
  for (const v of sirali) { if (v.min > nowMin) return v; }
  return sirali[0]; 
}

function aktifVakitBul(vakitler) {
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const sirali = Object.keys(VAKIT_NAMES).map(key => {
    const [h, m] = (vakitler[key] || '00:00').split(':').map(Number);
    return { key, min: h * 60 + m };
  });
  let aktifKey = 'yatsi'; 
  for (const v of sirali) {
    if (v.min <= nowMin) { aktifKey = v.key; } else { break; }
  }
  return aktifKey;
}

// Geri Sayım
function geriSayimBaslat(vakitler) {
  if (geriSayimInterval) clearInterval(geriSayimInterval);
  function tick() {
    const next = sonrakiVakitBul(vakitler);
    const aktif = aktifVakitBul(vakitler); 
    document.body.className = aktif; 
    document.getElementById('hedefVakitAdi').textContent = `${next.name.toUpperCase()} EZANINA KALAN SÜRE`;
    const now = new Date();
    let target = new Date();
    target.setHours(Math.floor(next.min / 60), next.min % 60, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1);
    const diff = target - now;
    const hh = String(Math.floor(diff / 3600000)).padStart(2, '0');
    const mm = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    const ss = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    document.getElementById('geriSayim').textContent = `${hh}:${mm}:${ss}`;
    if (sonAktifVakit !== aktif) {
      sonAktifVakit = aktif;
      renderHorizontalVakitler(vakitler, aktif);
    }
    tarihleriGuncelle();
  }
  tick();
  geriSayimInterval = setInterval(tick, 1000);
}

// Vakitleri Yükle
function yukle(city, dist) {
  document.getElementById('hedefVakitAdi').textContent = "HESAPLANIYOR...";
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();

  try {
    if (typeof getTimes !== 'function') throw new Error("Motor yüklenemedi.");
    const vakitler = getTimes(y, m, d, city, dist);
    if (!vakitler) throw new Error("Bu konum için veri bulunamadı.");

    const aktif = aktifVakitBul(vakitler);
    renderHorizontalVakitler(vakitler, aktif);
    renderWeeklyTable(vakitler, city, dist);
    gununIcerikleriniYukle();
    geriSayimBaslat(vakitler);
  } catch (error) {
    console.error("Hata:", error);
    document.getElementById('hedefVakitAdi').textContent = "HATA: " + error.message;
  }
}

// Menü ve Modallar
function setupMenuAndModals() {
  const sideMenu = document.getElementById('sideMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  const openMenuBtn = document.getElementById('openMenuBtn');
  const closeMenuBtn = document.getElementById('closeMenuBtn');
  const settingsModal = document.getElementById('settingsModal');
  const locationModal = document.getElementById('locationModal');
  const menuAyarlar = document.getElementById('menuAyarlar');
  const menuKonumlar = document.getElementById('menuKonumlar');
  const closeSettingsBtn = document.getElementById('closeSettingsBtn');
  const closeLocationBtn = document.getElementById('closeLocationBtn');
  const openLocationBtn = document.getElementById('openLocationBtn');
  const toggleWeekly = document.getElementById('toggleWeekly');
  const weeklyTableContainer = document.getElementById('weeklyTableContainer');

  if(!sideMenu) return;

  function closeMenu() { sideMenu.classList.remove('open'); menuOverlay.classList.remove('open'); }

  openMenuBtn.addEventListener('click', () => { sideMenu.classList.add('open'); menuOverlay.classList.add('open'); });
  closeMenuBtn.addEventListener('click', closeMenu);
  menuOverlay.addEventListener('click', closeMenu);
  menuAyarlar.addEventListener('click', () => { closeMenu(); settingsModal.classList.add('open'); });
  closeSettingsBtn.addEventListener('click', () => settingsModal.classList.remove('open'));

  const openLoc = () => {
    closeMenu(); 
    locationModal.classList.add('open'); 
    const ilSelect = document.getElementById('ilSelect');
    const ilceSelect = document.getElementById('ilceSelect');
    
    if (typeof IL_ILCE_DB !== 'undefined') {
      ilSelect.innerHTML = '<option value="">İl Seçin</option>';
      Object.keys(IL_ILCE_DB).sort((a, b) => a.localeCompare(b, 'tr')).forEach(il => {
        const opt = document.createElement('option'); opt.value = il; opt.textContent = il;
        ilSelect.appendChild(opt);
      });

      ilSelect.onchange = (e) => {
        ilceSelect.innerHTML = '<option value="">İlçe Seçin</option>';
        const ilceler = IL_ILCE_DB[e.target.value];
        if(ilceler) {
          Object.keys(ilceler).sort((a, b) => a.localeCompare(b, 'tr')).forEach(ilce => {
            const opt = document.createElement('option'); opt.value = ilce; opt.textContent = ilce;
            ilceSelect.appendChild(opt);
          });
        }
      };

      ilceSelect.onchange = (e) => {
        localStorage.setItem('sehir', ilSelect.value);
        localStorage.setItem('ilce', e.target.value);
        locationModal.classList.remove('open');
        yukle(ilSelect.value, e.target.value);
      };
    }
  };
  
  menuKonumlar.addEventListener('click', openLoc);
  openLocationBtn.addEventListener('click', openLoc);
  closeLocationBtn.addEventListener('click', () => locationModal.classList.remove('open'));

  if(toggleWeekly) {
    toggleWeekly.addEventListener('change', (e) => {
      weeklyTableContainer.style.display = e.target.checked ? 'block' : 'none';
    });
  }

  // BİLDİRİM BUTONU (Ayarlar içine eklenir)
  const settingsContent = document.querySelector('.settings-content');
  if (settingsContent) {
    const btn = document.createElement('button');
    btn.textContent = '🔔 Bildirimleri Aç';
    btn.style = 'width:100%; padding:1rem; background:#f59e0b; color:white; border:none; border-radius:8px; margin-top:1rem; font-weight:bold; cursor:pointer;';
    
    btn.onclick = async () => {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        return alert('Tarayıcınız bildirimleri desteklemiyor.');
      }
      try {
        const reg = await navigator.serviceWorker.register('sw.js');
        await navigator.serviceWorker.ready; // SW'nin aktif olmasını bekle

        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        });
        console.log('=== ABONELİK BAŞARILI ===');
        console.log(JSON.stringify(sub));
        alert('Bildirimler açıldı! Lütfen F12 (Konsol) ekranındaki yazıyı kopyalayıp bana gönder.');
      } catch (err) {
        console.error('Hata:', err);
        alert('Hata oluştu: ' + err.message);
      }
    };
    settingsContent.appendChild(btn);
  }
}

// Başlat
document.addEventListener('DOMContentLoaded', () => {
  setupMenuAndModals();
  if (typeof ZikirMatik !== 'undefined') ZikirMatik.init();
  
  let kayitliIl = localStorage.getItem('sehir') || 'Yozgat';
  let kayitliIlce = localStorage.getItem('ilce') || 'Sorgun';
  
  yukle(kayitliIl, kayitliIlce); 
});
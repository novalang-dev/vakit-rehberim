const webpush = require('web-push');
const fs = require('fs');
const path = require('path');

// GitHub Secrets'tan bilgileri al
const publicVapidKey = process.env.VAPID_PUBLIC;
const privateVapidKey = process.env.VAPID_PRIVATE;
const subscription = JSON.parse(process.env.SUBSCRIPTION_JSON);

webpush.setVapidDetails(
  'mailto:ahmetensar602@gmail.com',
  publicVapidKey,
  privateVapidKey
);

// Node.js ortamında dosyaları okumak için geçici bir modül yaratıyoruz
const dbPath = path.join(process.cwd(), 'js', 'db.js');
const motorPath = path.join(process.cwd(), 'js', 'motor.js');

let dbCode = fs.readFileSync(dbPath, 'utf8');
let motorCode = fs.readFileSync(motorPath, 'utf8');

const tempModuleCode = `
  ${dbCode}
  ${motorCode}
  module.exports = { IL_ILCE_DB, getTimes };
`;

const tempPath = path.join(process.cwd(), 'temp-motor.cjs');
fs.writeFileSync(tempPath, tempModuleCode);

const { IL_ILCE_DB, getTimes } = require(tempPath);

// Tarih ve saat (Türkiye saati)
const now = new Date();
const trDate = new Date(now.getTime() + (3 * 60 * 60 * 1000)); 
const y = trDate.getUTCFullYear();
const m = trDate.getUTCMonth() + 1;
const d = trDate.getUTCDate();
const trHour = trDate.getUTCHours();
const trMinute = trDate.getUTCMinutes();

let city = 'Yozgat';
let dist = 'Sorgun';

if (!IL_ILCE_DB[city] || !IL_ILCE_DB[city][dist]) {
  const firstCity = Object.keys(IL_ILCE_DB)[0];
  const firstDist = Object.keys(IL_ILCE_DB[firstCity])[0];
  city = firstCity;
  dist = firstDist;
}

const vakitler = getTimes(y, m, d, city, dist);

if (!vakitler) {
  console.error("Kritik Hata: Vakitler hesaplanamadı!");
  process.exit(1);
}

const hedefVakitler = {
  'ogle': 'Öğle',
  'ikindi': 'İkindi',
  'aksam': 'Akşam',
  'yatsi': 'Yatsı'
};

let bildirimGonderilecekVakit = null;
let vakitSaati = "";

for (const [key, isim] of Object.entries(hedefVakitler)) {
  const vakit = vakitler[key];
  if (vakit) {
    const [vH, vM] = vakit.split(':').map(Number);
    if (trHour === vH && Math.abs(trMinute - vM) <= 3) {
      bildirimGonderilecekVakit = isim;
      vakitSaati = vakit;
      break;
    }
  }
}

if (bildirimGonderilecekVakit) {
  // --- HAFIZA KONTROLÜ ---
  const cacheDosyasi = path.join(process.cwd(), '.son-bildirim.json');
  let hafiza = {};
  
  if (fs.existsSync(cacheDosyasi)) {
    hafiza = JSON.parse(fs.readFileSync(cacheDosyasi, 'utf8'));
  }

  const bugunTarihi = `${y}-${m}-${d}`;
  const hafizaAnahtari = `${bugunTarihi}_${bildirimGonderilecekVakit}`;

  // Eğer bugün bu vakit için zaten bildirim attıysak susalım
  if (hafiza[hafizaAnahtari]) {
    console.log(`Bugün ${bildirimGonderilecekVakit} için zaten bildirim atıldı. Beklemeye devam...`);
    process.exit(0);
  }

  console.log(`Şu an ${bildirimGonderilecekVakit} vakti (${vakitSaati}). Bildirim gönderiliyor...`);
  
  const payload = JSON.stringify({
    title: 'Vakit Rehberim',
    body: `${bildirimGonderilecekVakit} ezanı okunuyor. Hayırlı ibadetler!`
  });

  webpush.sendNotification(subscription, payload)
    .then(() => {
      console.log('Bildirim Başarıyla Gönderildi!');
      // Bildirim başarılıysa hafızaya kaydet
      hafiza[hafizaAnahtari] = true;
      fs.writeFileSync(cacheDosyasi, JSON.stringify(hafiza));
    })
    .catch(err => console.error('Hata:', err));
} else {
  console.log(`Şu an (${trHour}:${trMinute}) ezan vakti değil. Beklemeye devam...`);
}
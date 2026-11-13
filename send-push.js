const webpush = require('web-push');
const fs = require('fs');
const path = require('path');

// GitHub Secrets'tan bilgileri al
const publicVapidKey = process.env.VAPID_PUBLIC;
const privateVapidKey = process.env.VAPID_PRIVATE;
const subscription = JSON.parse(process.env.SUBSCRIPTION_JSON);

webpush.setVapidDetails(
  'mailto:ahmetensar602@gmail.com', // E-posta adresin
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

// Tarih ve saat bilgisi (Türkiye saati ile karşılaştırmak için)
const now = new Date();
// GitHub Actions UTC (Londra) saatine göre çalışır. Türkiye saati UTC+3'tür.
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

// İmsak ve Güneş hariç, sadece bildirim atılacak vakitler
const hedefVakitler = {
  'ogle': 'Öğle',
  'ikindi': 'İkindi',
  'aksam': 'Akşam',
  'yatsi': 'Yatsı'
};

let bildirimGonderilecekVakit = null;
let vakitSaati = "";

// Şu anki saatin, vakitlerden herhangi birine denk gelip gelmediğini kontrol et
for (const [key, isim] of Object.entries(hedefVakitler)) {
  const vakit = vakitler[key]; // Örn: "12:28"
  if (vakit) {
    const [vH, vM] = vakit.split(':').map(Number);
    
    // Eğer şu anki saat ve dakika, vaktin saat ve dakikasına eşitse (veya 1 dk sapma varsa)
    // GitHub bazen geç çalışabileceği için 0 veya 1 dakika tolerans koyuyoruz.
    if (trHour === vH && Math.abs(trMinute - vM) <= 1) {
      bildirimGonderilecekVakit = isim;
      vakitSaati = vakit;
      break;
    }
  }
}

// Eğer bir vakte denk geliyorsa bildirim gönder
if (bildirimGonderilecekVakit) {
  console.log(`Şu an ${bildirimGonderilecekVakit} vakti (${vakitSaati}). Bildirim gönderiliyor...`);
  
  const payload = JSON.stringify({
    title: 'Vakit Rehberim',
    body: `${bildirimGonderilecekVakit} ezanı okunuyor. Hayırlı ibadetler!`
  });

  webpush.sendNotification(subscription, payload)
    .then(() => console.log('Bildirim Başarıyla Gönderildi!'))
    .catch(err => console.error('Hata:', err));
} else {
  // Eğer o an ezan vakti değilse hiçbir şey yapma (bildirim gönderme)
  console.log(`Şu an (${trHour}:${trMinute}) ezan vakti değil. Beklemeye devam...`);
}
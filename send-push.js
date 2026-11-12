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

// Sadece Node.js'in anlayacağı şekilde paketliyoruz
const tempModuleCode = `
  ${dbCode}
  ${motorCode}
  
  module.exports = { IL_ILCE_DB, getTimes };
`;

// Geçici dosyayı oluştur ve içine yaz
const tempPath = path.join(process.cwd(), 'temp-motor.cjs');
fs.writeFileSync(tempPath, tempModuleCode);

// Geçici dosyayı çağır
const { IL_ILCE_DB, getTimes } = require(tempPath);

const now = new Date();
const y = now.getFullYear();
const m = now.getMonth() + 1;
const d = now.getDate();

let city = 'Yozgat';
let dist = 'Sorgun';

if (!IL_ILCE_DB[city] || !IL_ILCE_DB[city][dist]) {
  console.log(`Uyarı: ${city}/${dist} bulunamadı. İlk geçerli konum aranıyor...`);
  const firstCity = Object.keys(IL_ILCE_DB)[0];
  const firstDist = Object.keys(IL_ILCE_DB[firstCity])[0];
  city = firstCity;
  dist = firstDist;
  console.log(`Kullanılan konum: ${city}/${dist}`);
}

const vakitler = getTimes(y, m, d, city, dist);

if (!vakitler) {
  console.error("Kritik Hata: Vakitler hesaplanamadı!");
  process.exit(1);
}

const hedefVakitAdi = 'Akşam';
const hedefVakitSaati = vakitler.aksam;

console.log(`Bugünün ${hedefVakitAdi} vakti: ${hedefVakitSaati}`);

const payload = JSON.stringify({
  title: 'Vakit Rehberim',
  body: `Bugünün ${hedefVakitAdi} ezanı saat ${hedefVakitSaati}'te okunacak.`
});

webpush.sendNotification(subscription, payload)
  .then(() => console.log('Bildirim Başarıyla Gönderildi!'))
  .catch(err => console.error('Hata:', err));

const webpush = require('web-push');
const fs = require('fs');

// GitHub Secrets'tan bilgileri al
const publicVapidKey = process.env.VAPID_PUBLIC;
const privateVapidKey = process.env.VAPID_PRIVATE;
const subscription = JSON.parse(process.env.SUBSCRIPTION_JSON);

webpush.setVapidDetails(
  'mailto:ahmetensar602@gmail.com',
  publicVapidKey,
  privateVapidKey
);

// Veritabanı ve motoru yükle
const dbCode = fs.readFileSync('js/db.js', 'utf8');
const motorCode = fs.readFileSync('js/motor.js', 'utf8');
eval(dbCode);
eval(motorCode);

const now = new Date();
const y = now.getFullYear();
const m = now.getMonth() + 1;
const d = now.getDate();

let city = 'Yozgat';
let dist = 'Sorgun';

// GÜVENLİK KONTROLÜ: Eğer Yozgat/Sorgun bulunamazsa, veritabanındaki ilk geçerli konumu kullan
if (typeof IL_ILCE_DB !== 'undefined') {
  if (!IL_ILCE_DB[city] || !IL_ILCE_DB[city][dist]) {
    console.log(`Uyarı: ${city}/${dist} bulunamadı. İlk geçerli konum aranıyor...`);
    const firstCity = Object.keys(IL_ILCE_DB)[0];
    const firstDist = Object.keys(IL_ILCE_DB[firstCity])[0];
    city = firstCity;
    dist = firstDist;
    console.log(`Kullanılan konum: ${city}/${dist}`);
  }
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
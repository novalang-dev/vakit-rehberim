const webpush = require('web-push');
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

// Artık doğrudan modülleri çağırıyoruz
const IL_ILCE_DB = require('./js/db.js');
const { getTimes } = require('./js/motor.js');

const now = new Date();
const y = now.getFullYear();
const m = now.getMonth() + 1;
const d = now.getDate();

// İlk geçerli şehri ve ilçeyi bul (Yozgat/Sorgun yoksa)
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
  console.error("Kritik Hata: Vakitler hesaplanamadı! Lütfen db.js ve motor.js dosyalarını kontrol edin.");
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
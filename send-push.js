const webpush = require('web-push');
const fs = require('fs');

// GitHub Secrets'tan gizli bilgileri alıyoruz
const publicVapidKey = process.env.VAPID_PUBLIC;
const privateVapidKey = process.env.VAPID_PRIVATE;
const subscription = JSON.parse(process.env.SUBSCRIPTION_JSON);

webpush.setVapidDetails(
  'mailto:ahmetensar602@gmail.com', // E-posta adresin
  publicVapidKey,
  privateVapidKey
);

// Vakit hesaplama motorumuzu (motor.js ve db.js) buraya çağırıyoruz
const dbCode = fs.readFileSync('js/db.js', 'utf8');
const motorCode = fs.readFileSync('js/motor.js', 'utf8');

// Veritabanını ve motoru Node.js ortamında çalıştır
eval(dbCode);
eval(motorCode.replace(/if \(typeof window[\s\S]*?$/, '')); // window kısmını temizle

const now = new Date();
const y = now.getFullYear();
const m = now.getMonth() + 1;
const d = now.getDate();

// Test için Yozgat/Sorgun'u sabitledik. Kendi şehrini buraya yazabilirsin.
const vakitler = getTimes(y, m, d, 'Yozgat', 'Sorgun');

// Hangi vakte göre bildirim atacağımızı seçelim (Örneğin Akşam)
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
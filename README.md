VAKİT REHBERİM (PWA) v1.1.3
Vakit Rehberim, T.C. Diyanet İşleri Başkanlığı'nın resmi verileriyle birebir uyumlu (sıfır sapma), tamamen çevrimdışı (offline) çalışan, arka planda internet tüketmeyen, hafif ve modern bir PWA (Progressive Web App) projesidir.

e-Diyanet gibi resmi uygulamaların hantallığına, arka planda tükettiği veriye ve sürekli çöken sunucularına bir alternatif olarak geliştirilmiştir.

ÖNE ÇIKAN ÖZELLİKLER
Sıfır Sapma: GitHub'daki zencefilefendi projesinin "Harmonic Delta Signature" algoritması kullanılarak, Diyanet'in kendi verileriyle birebir aynı saatler hesaplanır.

Tamamen Çevrimdışı (Offline): İnternet bağlantısı olmadan, API çökmelerinden etkilenmeden çalışır.

Sıfır Veri Tüketimi: Arka planda hiçbir şekilde internet harcamaz.

Tüm İller ve İlçeler: Türkiye'deki 973 ilçenin tamamı için konum desteği sunar.

Modern Arayüz: Cam efekti (glassmorphism), vakte göre değişen arka plan resimleri ve şık bir koyu tema içerir.

Otomatik Bildirimler (Sunucusuz): GitHub Actions kullanılarak, her gün Öğle, İkindi, Akşam ve Yatsı vakitlerinde tam ezan saatinde bildirim gönderilir. (İmsak ve Güneş vakitlerinde rahatsız etmemek için bildirim gönderilmez).

Çoklu Sayfa Yapısı: Ana ekranın yanı sıra Kıble, Zikir, Ramazan ve Dini Günler için ayrı, şık ve yumuşak geçişli sayfalar.

Ramazan'a Özel Tasarım: Ramazan sayfasında süzülen yıldızlar, hilal süslemeleri ve özel karşılama ekranı.

Dini Günler Takvimi: 2026, 2027 ve 2028 yılları için kandil, bayram ve mübarek günler; her birine kalan gün sayısını gösteren geri sayım özelliği ile birlikte.

Akıllı Konum Hafızası: Uygulama ilk açıldığında konum sorar, seçilen il/ilçe localStorage'a kaydedilir ve bir daha sormaz.

Hızlı Erişim ve Geri Bildirim: Yan menüden "Yakındaki Camiler" uyarısı (SweetAlert2 ile) ve GitHub Issues'e doğrudan geri bildirim gönderme.

DOSYA YAPISI
text
vakit-rehberim/
├── index.html          # Ana arayüz iskeleti
├── kible.html          # Kıble Pusulası sayfası
├── zikir.html          # Zikirmatik sayfası
├── ramazan.html        # Ramazan Ayı özel sayfası
├── dini_gunler.html    # Dini Günler ve Geceler takvimi
├── manifest.json       # PWA kurulum ayarları
├── sw.js               # Service Worker (Önbellek ve offline çalışma)
├── README.md           # Bu dosya
├── package.json        # Node.js bağımlılıkları (bildirim için)
├── send-push.js        # GitHub Actions ile bildirim gönderen robot
├── .github/workflows/push.yml # Bildirim zamanlayıcısı (Her 3 dakikada bir)
├── assets/             # Arka plan resimleri ve ikonlar
├── css/
│   └── style.css       # Modern, cam efektli tasarım
└── js/
    ├── db.js           # (ÇOK ÖNEMLİ) 1.8 MB'lık veritabanı
    ├── motor.js        # (ÇOK ÖNEMLİ) Astronomik hesaplama beyni
    ├── app.js          # Ana mantık, geri sayım ve konum seçimi
    ├── icerikler.js    # Ayet, Hadis, Dua verileri
    └── zikirmatik.js   # Zikir sayacı mantığı
⚠️ Önemli Not: Eski api.js dosyası (harici API'lere bağlanan yapı) tamamen silinmiştir. Proje artık dışarıya bağımlı değildir.

TEKNİK DETAYLAR VE MİMARİ
1. Veri Kaynağı ve Hesaplama (Sıfır Sapma)
Diyanet'in resmi API'si (token gerektirdiği için) kullanılmamaktadır. Bunun yerine:

js/db.js içerisinde tüm illerin koordinatları (lat, lng, alt) ve o güne ait Diyanet sapmalarını temsil eden şifrelenmiş harf dizileri (har) bulunur.

js/motor.js içindeki getTimes(yil, ay, gun, il, ilce) fonksiyonu, önce standart astronomik hesaplamayı yapar. Ardından db.js'den o günün harf şifresini çözer ve saati Diyanet ile birebir aynı olacak şekilde kalibre eder.

2. Arayüz ve Tasarım
HTML ve CSS ile tamamen responsive (mobil uyumlu) tasarlanmıştır.

Vakitler (İmsak, Güneş, Öğle, İkindi, Akşam, Yatsı) yatay bir menüde gösterilir.

Geri sayım sayacı, bir sonraki vakte kalan süreyi saniye saniye günceller.

Vakit değiştiğinde body etiketine eklenen class ile arka plan resmi ve renk teması otomatik değişir.

Sayfalar arası geçişlerde beyaz ekran yanıp sönmesini engelleyen yumuşak (fade-in) animasyonu eklendi.

3. PWA (Progressive Web App)
manifest.json sayesinde kullanıcılar uygulamayı telefona "Ana Ekrana Ekle" yapabilir.

sw.js (Service Worker) sayesinde tüm HTML, CSS, JS ve resim dosyaları önbelleğe alınır. İnternet kesilse dahi uygulama açılmaya devam eder.

4. Bildirim Sistemi (GitHub Actions)
Herhangi bir sunucuya ihtiyaç duymadan, tamamen ücretsiz bir şekilde çalışır.

.github/workflows/push.yml dosyası her 3 dakikada bir çalışarak o anki saati kontrol eder.

send-push.js dosyası, eğer o an bir ezan vaktiyse (Öğle, İkindi, Akşam, Yatsı) web-push kütüphanesi ile kullanıcıya bildirim yollar.

Hafıza Sistemi: Aynı vakit için birden fazla bildirim gitmemesi adına .son-bildirim.json hafızası kullanılır (GitHub Actions Cache ile korunur).

GELECEK GÜNCELLEMELER (YAPILACAKLAR)
□ Kıble Pusulası: Cihaz sensörünü (DeviceOrientation) kullanarak çalışan gerçek bir pusula.
□ Kabe Açısı ve Uzaklığı: Konuma göre Kabe'ye olan kuş uçuşu mesafenin ve açının hesaplanması.
□ Güneş/Ay Durumu: Ana ekrana güneşin doğuş/batış grafiğinin eklenmesi.
□ Dini Günler Otomasyonu: Dini günlerin statik tarihler yerine otomatik hesaplanması.

Bu proje, tamamen bağımsız ve açık kaynak ruhuyla, "daha hafif ve daha hızlı" bir alternatif yaratmak için geliştirilmiştir.
VAKİT REHBERİM (PWA) v1.0.9

Vakit Rehberim, T.C. Diyanet İşleri Başkanlığı'nın resmi verileriyle birebir uyumlu (sıfır sapma), tamamen çevrimdışı (offline) çalışan, arka planda internet tüketmeyen, hafif ve modern bir PWA (Progressive Web App) projesidir.

e-Diyanet gibi resmi uygulamaların hantallığına, arka planda tükettiği veriye ve sürekli çöken sunucularına bir alternatif olarak geliştirilmiştir.

ÖNE ÇIKAN ÖZELLİKLER

Sıfır Sapma: GitHub'daki zencefilefendi projesinin "Harmonic Delta Signature" algoritması kullanılarak, Diyanet'in kendi verileriyle birebir aynı saatler hesaplanır.
Tamamen Çevrimdışı (Offline): İnternet bağlantısı olmadan, API çökmelerinden etkilenmeden çalışır.
Sıfır Veri Tüketimi: Arka planda hiçbir şekilde internet harcamaz.
Tüm İller ve İlçeler: Türkiye'deki 973 ilçenin tamamı için konum desteği sunar.
Modern Arayüz: Cam efekti (glassmorphism), vakte göre değişen arka plan resimleri ve şık bir koyu tema içerir.
Ek Özellikler: Günün Ayeti/Hadisi/Duası kartları, Zikirmatik ve Kıble sekmesi.
Hafıza (localStorage): Seçilen konum ve zikir sayısı tarayıcıda saklanır, uygulama kaldığı yerden devam eder.

DOSYA YAPISI

vakit-rehberim/
index.html (Ana arayüz iskeleti)
manifest.json (PWA kurulum ayarları)
sw.js (Service Worker - Önbellek ve offline çalışma)
README.md (Bu dosya)
assets/ (Arka plan resimleri ve ikonlar)
css/style.css (Modern tasarım)
js/db.js (ÇOK ÖNEMLİ - 1.8 MB'lık veritabanı, il/ilçe koordinatları ve Diyanet sapma şifreleri)
js/motor.js (ÇOK ÖNEMLİ - Astronomik hesaplama beyni, getTimes() fonksiyonu)
js/app.js (Ana mantık, geri sayım ve konum seçimi)
js/icerikler.js (Ayet, Hadis, Dua verileri)
js/zikirmatik.js (Zikir sayacı mantığı)

ÖNEMLİ NOT: Eski api.js dosyası (harici API'lere bağlanan yapı) tamamen silinmiştir. Proje artık dışarıya bağımlı değildir.

TEKNİK DETAYLAR VE MİMARİ

Veri Kaynağı ve Hesaplama (Sıfır Sapma)
Diyanet'in resmi API'si (token gerektirdiği için) kullanılmamaktadır. Bunun yerine:
js/db.js içerisinde tüm illerin koordinatları (lat, lng, alt) ve o güne ait Diyanet sapmalarını temsil eden şifrelenmiş harf dizileri (har) bulunur.
js/motor.js içindeki getTimes(yil, ay, gun, il, ilce) fonksiyonu, önce standart astronomik hesaplamayı yapar. Ardından db.js'den o günün harf şifresini çözer (örn. 'N' harfi +1 dakika) ve saati Diyanet ile birebir aynı olacak şekilde kalibre eder.

Arayüz ve Tasarım
HTML ve CSS ile tamamen responsive (mobil uyumlu) tasarlanmıştır.
Vakitler (İmsak, Güneş, Öğle, İkindi, Akşam, Yatsı) yatay bir menüde gösterilir.
Geri sayım sayacı, bir sonraki vakte kalan süreyi saniye saniye günceller.
Vakit değiştiğinde body etiketine eklenen class ile (örn: body.aksam) arka plan resmi ve renk teması otomatik değişir.

PWA (Progressive Web App)
manifest.json sayesinde kullanıcılar uygulamayı telefona "Ana Ekrana Ekle" yapabilir.
sw.js (Service Worker) sayesinde tüm HTML, CSS, JS ve resim dosyaları önbelleğe alınır. İnternet kesilse dahi uygulama açılmaya devam eder.

GELECEK GÜNCELLEMELER (YAPILACAKLAR)

Kıble Pusulası: Cihaz sensörünü (DeviceOrientation) kullanarak çalışan gerçek bir pusula.
Kabe Açısı ve Uzaklığı: Konuma göre Kabe'ye olan kuş uçuşu mesafenin ve açının hesaplanması.
Güneş/Ay Durumu: Ana ekrana güneşin doğuş/batış grafiğinin eklenmesi.
Dini Günler ve Geceler: Yaklaşan kandil ve bayram tarihlerinin gösterilmesi.

Bu proje, tamamen bağımsız ve açık kaynak ruhuyla, "daha hafif ve daha hızlı" bir alternatif yaratmak için geliştirilmiştir.
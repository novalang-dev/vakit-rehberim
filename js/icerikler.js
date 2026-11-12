const Icerikler = {
  // VAKİTLERE ÖZEL AYET, HADİS VE DUALAR
  vakitIcerikleri: {
    imsak: {
      ayet: { metin: "Şüphesiz namaz, müminler üzerine belirli vakitlerde farz kılınmıştır.", kaynak: "Nisâ Suresi, 103. Ayet" },
      hadis: { metin: "Ameller niyetlere göredir. Herkese ancak niyet ettiği şey vardır.", kaynak: "Buhârî, Müslim" },
      dua: { baslik: "İmsak Duası (Oruç Niyeti)", metin: "Niyet ettim Allah rızası için yarınki orucu tutmaya.", anlam: "Allah'ım, bu mübarek vakitte niyetimizi kabul eyle." }
    },
    gunes: {
      ayet: { metin: "Güneş ve ay bir hesaba göre hareket etmektedir.", kaynak: "Rahmân Suresi, 5. Ayet" },
      hadis: { metin: "Sabah namazını kılan, Allah'ın himayesindedir.", kaynak: "Tirmizî" },
      dua: { baslik: "Sabah Uyanınca", metin: "Elhamdülillâhillezî ahyânâ ba'de mâ emâtenâ ve ileyhin-nüşûr.", anlam: "Bizi öldürdükten sonra dirilten Allah'a hamdolsun. Dönüş de ancak O'nadır." }
    },
    ogle: {
      ayet: { metin: "Beni anın ki ben de sizi anayım. Bana şükredin, sakın nankörlük etmeyin.", kaynak: "Bakara Suresi, 152. Ayet" },
      hadis: { metin: "Kolaylaştırınız, zorlaştırmayınız; müjdeleyiniz, nefret ettirmeyiniz.", kaynak: "Buhârî, Müslim" },
      dua: { baslik: "Yemekten Sonra", metin: "Elhamdülillâhillezî et'amenâ ve sekânâ ve cealenâ müslimîn.", anlam: "Bizi yediren, içiren ve Müslümanlardan kılan Allah'a hamdolsun." }
    },
    ikindi: {
      ayet: { metin: "Kim Allah'a tevekkül ederse, O ona yeter.", kaynak: "Talâk Suresi, 3. Ayet" },
      hadis: { metin: "Sizden biriniz kendisi için istediğini kardeşi için de istemedikçe iman etmiş olmaz.", kaynak: "Buhârî, Müslim" },
      dua: { baslik: "Sıkıntı ve Keder Anında", metin: "Lâ ilâhe illallahül-Azîmül-Halîm. Lâ ilâhe illallahü Rabbül-Arşil-Azîm.", anlam: "Azîm ve Halîm olan Allah'tan başka ilah yoktur. Büyük Arş'ın Rabbi olan Allah'tan başka ilah yoktur." }
    },
    aksam: {
      ayet: { metin: "Bilesiniz ki, kalpler ancak Allah'ı anmakla huzur bulur.", kaynak: "Ra'd Suresi, 28. Ayet" },
      hadis: { metin: "Temizlik imanın yarısıdır.", kaynak: "Müslim" },
      dua: { baslik: "Akşam Ezanı Okunurken", metin: "Allahümme Rabbe hâzihid-da'vetit-tâmmeti ves-salâtil-kâimeti, âti Muhammedenil-vesîlete vel-fadîlete, veb'ashü makâmen mahmûdenillezî veadteh.", anlam: "Allah'ım! Bu eksiksiz davetin ve kılınacak namazın Rabbi! Muhammed'e vesileyi ve fazileti ver. O'nu, kendisine vaad ettiğin Makam-ı Mahmud'a ulaştır." }
    },
    yatsi: {
      ayet: { metin: "Gevşemeyin, üzülmeyin; eğer gerçekten iman etmişseniz en üstün olan sizlersiniz.", kaynak: "Âl-i İmrân Suresi, 139. Ayet" },
      hadis: { metin: "Müslüman, dilinden ve elinden diğer Müslümanların emin olduğu kimsedir.", kaynak: "Buhârî" },
      dua: { baslik: "Yatmadan Önce", metin: "Bismikellâhümme emûtü ve ahyâ.", anlam: "Allah'ım! Senin ismini anarak ölür (uyur) ve dirilirim (uyanırım)." }
    }
  },

  // SEKMELER İÇİN GENEL LİSTELER (Rastgele çıkacak)
  genelAyetler: [
    { metin: "Beni anın ki ben de sizi anayım. Bana şükredin, sakın nankörlük etmeyin.", kaynak: "Bakara Suresi, 152. Ayet" },
    { metin: "Gevşemeyin, üzülmeyin; eğer (gerçekten) iman etmişseniz en üstün olan sizlersiniz.", kaynak: "Âl-i İmrân Suresi, 139. Ayet" },
    { metin: "Kim Allah'a tevekkül ederse, O ona yeter.", kaynak: "Talâk Suresi, 3. Ayet" },
    { metin: "Bilesiniz ki, kalpler ancak Allah'ı anmakla huzur bulur.", kaynak: "Ra'd Suresi, 28. Ayet" },
    { metin: "Şüphesiz namaz, müminler üzerine belirli vakitlerde farz kılınmıştır.", kaynak: "Nisâ Suresi, 103. Ayet" }
  ],

  genelHadisler: [
    { metin: "Ameller niyetlere göredir. Herkese ancak niyet ettiği şey vardır.", kaynak: "Buhârî, Müslim" },
    { metin: "Müslüman, dilinden ve elinden diğer Müslümanların emin olduğu kimsedir.", kaynak: "Buhârî" },
    { metin: "Sizden biriniz kendisi için istediğini kardeşi için de istemedikçe (gerçek anlamda) iman etmiş olmaz.", kaynak: "Buhârî, Müslim" },
    { metin: "Kolaylaştırınız, zorlaştırmayınız; müjdeleyiniz, nefret ettirmeyiniz.", kaynak: "Buhârî, Müslim" },
    { metin: "Temizlik imanın yarısıdır.", kaynak: "Müslim" }
  ],

  genelDualar: [
    { baslik: "Sabah Uyanınca", metin: "Elhamdülillâhillezî ahyânâ ba'de mâ emâtenâ ve ileyhin-nüşûr.", anlam: "Bizi öldürdükten sonra dirilten Allah'a hamdolsun. Dönüş de ancak O'nadır." },
    { baslik: "Yemekten Sonra", metin: "Elhamdülillâhillezî et'amenâ ve sekânâ ve cealenâ müslimîn.", anlam: "Bizi yediren, içiren ve Müslümanlardan kılan Allah'a hamdolsun." },
    { baslik: "Sıkıntı Anında", metin: "Lâ ilâhe illallahül-Azîmül-Halîm. Lâ ilâhe illallahü Rabbül-Arşil-Azîm.", anlam: "Azîm ve Halîm olan Allah'tan başka ilah yoktur. Büyük Arş'ın Rabbi olan Allah'tan başka ilah yoktur." },
    { baslik: "Yolculuğa Çıkarken", metin: "Sübhânellezî sahhara lenâ hâzâ ve mâ künnâ lehû mukrinîn. Ve innâ ilâ Rabbinâ le münkalibûn.", anlam: "Bunu bizim hizmetimize veren Allah'ı tenzih ederiz. Yoksa biz buna güç yetiremezdik. Şüphesiz biz Rabbimize döneceğiz." }
  ],

  esmaulHusna: [
    { isim: "Allah", anlam: "Eşi ve benzeri olmayan, tek ilah." },
    { isim: "Er-Rahmân", anlam: "Dünyada bütün mahlûkatına merhamet eden." },
    { isim: "Er-Rahîm", anlam: "Ahirette sadece müminlere merhamet eden." },
    { isim: "El-Melik", anlam: "Mülkün, kâinatın gerçek sahibi." },
    { isim: "El-Kuddûs", anlam: "Her türlü eksiklikten uzak, tertemiz olan." },
    { isim: "Es-Selâm", anlam: "Esenlik veren, kullarını selâmete çıkaran." },
    { isim: "El-Mü'min", anlam: "Güven veren, emin kılan." },
    { isim: "El-Azîz", anlam: "Mağlup edilmesi mümkün olmayan yüce." },
    { isim: "El-Cebbâr", anlam: "Dilediğini zorla yaptıran, kırılanları onaran." },
    { isim: "El-Mütekebbir", anlam: "Büyüklükte eşi olmayan." }
  ]
};
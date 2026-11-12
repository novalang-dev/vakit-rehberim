const ZikirMatik = (() => {
  const STORAGE_KEY = 'zikirmatik_sayi';
  let sayi = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);

  function guncelle() {
    document.getElementById('zikirSayi').textContent = sayi;
    localStorage.setItem(STORAGE_KEY, sayi);
  }

  function artir() {
    sayi++;
    guncelle();
  }

  function sifirla() {
    sayi = 0;
    guncelle();
  }

  function init() {
    guncelle();
    document.getElementById('zikirArtir').addEventListener('click', artir);
    document.getElementById('zikirSifirla').addEventListener('click', sifirla);
  }

  return { init };
})();
# Baran Deniz Mutluoğlu — Kişisel Geliştirici Portfolyosu

Modern, performans odaklı ve harici kütüphane şişkinliği (zero-dependency) barındırmayan kişisel geliştirici portfolyosu. Saf semantik HTML5, modern CSS ve vanilla JavaScript standartları ile sıfırdan el işçiliğiyle tasarlandı.

---

## 🎯 Tasarım & Mühendislik Felsefesi (Anti-AI Slop)

Piyasadaki standart, yapay zeka tarafından üretilmiş kopya portfolyolardan (neon mor gradyanlar, içi boş sloganlar, uydurma yüzde çubukları) farklı olarak; **gerçek yazılım mühendisliği prensipleri** gözetilerek inşa edilmiştir:

- **Sıfır Dış Bağımlılık:** Ağır CSS framework'leri veya gereksiz JavaScript paketleri kullanılmamıştır. Doğrudan tarayıcının yerel gücünden faydalanır.
- **Akıcı Tipografi & Okunabilirlik:** Ana gövdede modern **Inter**, teknik bloklarda ve etiketlerde **JetBrains Mono** kullanılarak net bir görsel hiyerarşi oluşturulmuştur.
- **Mimarisi Açıklanmış Projeler:** Pazarlama süsü yerine; çözülen gerçek problemler, teknik zorluklar ve mimari kararlar öne çıkarılmıştır.
- **Yüksek Kontrast & Göz Yormayan Renkler:** Mat grafit/siyah dark mode ve fildişi/nötr light mode ile uzun süreli rahat okuma deneyimi sunar.

---

## ⚡ Öne Çıkan Özellikler

- 🌓 **Akıllı Tema Motoru:**
  - Kullanıcının işletim sistemi tercihini (`prefers-color-scheme`) otomatik algılar.
  - Kullanıcının manuel seçimini `localStorage` üzerinde saklar.
  - Sayfa yenilendiğinde sıfır titreme (FOUC) ile temayı uygular.
- 📋 **Panoya Kopyalama Mikro-Etkileşimi:**
  - Modern `navigator.clipboard` API'si (ve güvenli olmayan ortamlar için fallback) ile tek tıkla e-posta kopyalama.
  - Anlık görsel geri bildirim ve erişilebilir Toast bildirimi.
- 🎯 **Akıllı Navigasyon (ScrollSpy):**
  - `IntersectionObserver` ile sayfa kaydırıldıkça aktif bölümü dinamik ve performanslı biçimde menüde vurgular.
- 📱 **Tam Responsive & Erişilebilir (A11y):**
  - Akıcı `clamp()` tipografisi ile mobilden 4K ekranlara kadar hatasız uyum.
  - Klavye kullanıcıları için `:focus-visible` standartları ve semantik ARIA etiketleri.

---

## 📂 Proje Yapısı

```bash
portfolio/
├── index.html        # Semantik HTML5 iskeleti ve erişilebilir sayfa yapısı
├── style.css         # CSS Custom Properties, grid sistemi, fluid tipografi & temalar
├── script.js         # Tema yöneticisi, clipboard etkileşimi, scrollspy & mobil menü
└── README.md         # Proje mimari ve teknik dökümantasyonu
```

---

## 🚀 Yerel Olarak Çalıştırma

Proje sıfır derleme (build-less) gerektirdiği için herhangi bir ek kurulum yapmadan doğrudan çalıştırılabilir:

```bash
# Projeyi klonlayın
git clone https://github.com/2f7fjrk4sw-prog/portfolio.git
cd portfolio

# Doğrudan tarayıcıda açın veya yerel bir sunucu başlatın:
# Node.js ile:
npx serve .

# veya Python ile:
python -m http.server 3000
```

---

## 🌐 Canlı Yayın (GitHub Pages)

Bu proje GitHub Pages üzerinde barındırılacak şekilde tasarlanmıştır:
- **Kaynak:** `main` dalı `/ (root)`
- **Canlı Adres:** [https://2f7fjrk4sw-prog.github.io/portfolio/](https://2f7fjrk4sw-prog.github.io/portfolio/)

---

## 👤 Geliştirici

**Baran Deniz Mutluoğlu**  
- **GitHub:** [@2f7fjrk4sw-prog](https://github.com/2f7fjrk4sw-prog)  
- **Alan:** C#, .NET & Modern Web Teknolojileri  

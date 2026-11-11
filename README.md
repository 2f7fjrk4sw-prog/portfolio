# Baran Deniz Mutluoğlu — Kişisel Geliştirici Portfolyosu

[![HTML5](https://img.shields.io/badge/HTML5-Semantic-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Modern_Fluid-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla_ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Web Audio API](https://img.shields.io/badge/Web_Audio-Procedural_Sound-7A3991)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![Canvas API](https://img.shields.io/badge/Canvas_2D-Physics_Engine-FF6F00)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0_KB_Pure_Web-success)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Modern, yüksek performanslı ve harici kütüphane şişkinliği (**zero-dependency / 0 KB dış kütüphane**) barındırmayan kişisel geliştirici portfolyosu. Saf semantik HTML5, modern CSS ve vanilla JavaScript standartları ile sıfırdan el işçiliğiyle geliştirilmiştir.

🌐 **Canlı Site:** [https://2f7fjrk4sw-prog.github.io/portfolio/](https://2f7fjrk4sw-prog.github.io/portfolio/)

---

## 🎯 Tasarım & Mühendislik Felsefesi (Anti-AI Slop)

Piyasadaki standart, yapay zeka tarafından üretilmiş kopya portfolyolardan (neon mor gradyanlar, içi boş sloganlar, uydurma yüzde çubukları) farklı olarak; **gerçek yazılım mühendisliği prensipleri** gözetilerek inşa edilmiştir:

- **Sıfır Dış Bağımlılık (Pure Web Standards):** Tailwind, Bootstrap, jQuery veya Three.js gibi framework'ler kullanılmamıştır. Doğrudan tarayıcının yerel Web API'lerinden (`Web Audio API`, `Canvas API`, `IntersectionObserver`, `Clipboard API`) güç alır.
- **Akıcı Tipografi & Okunabilirlik:** Ana gövdede modern **Inter**, teknik bloklarda, kodlarda ve etiketlerde **JetBrains Mono** kullanılarak net bir görsel hiyerarşi oluşturulmuştur.
- **Mimarisi Açıklanmış Projeler:** Pazarlama süsü yerine; çözülen gerçek problemler, teknik zorluklar, veri yapıları ve mimari kararlar öne çıkarılmıştır.
- **Eğitici & Kapsamlı Kod Dokümantasyonu:** Baran'ın özel geliştirme prensibi doğrultusunda, projedeki her JavaScript fonksiyonu, CSS bloğu ve HTML yapısı detaylı Türkçe yorum satırlarıyla açıklanmıştır.

---

## ⚡ Öne Çıkan Özellikler

### 🎵 1. Çok Türlü Prosedürel Müzik Motoru & Master Ses Kontrolü
- **0 KB Asset Yükü:** Harici MP3 veya ses dosyası yüklenmez; tüm ses dalgaları Web Audio API osilatörleri, filtreleri ve zarf (envelope) parametreleriyle tarayıcıda dinamik sentezlenir.
- **4 Radikal Farklı Müzik Türü:**
  1. **☕ Chillhop & Rhodes (Gece Kodlaması):** 7'li ve 9'lu Rhodes elektro-piyano akorları, analog alçak geçiren filtre (620Hz) ve aralarda çalan pentatonik melodi çanları.
  2. **👾 8-Bit Arcade (Retro Chiptune):** Hızlı kare dalga (Square Wave) arpejleri ve nostaljik Game Boy staccato bas yürüyüşü.
  3. **🌆 Cyberpunk 2088 (Dark Synthwave):** Testere dişi (Sawtooth) sinematik pad akorları ve arkada pompalayan ritmik bas pulsasyonu.
  4. **🌧️ Yağmurlu Ankara (Rain & Felt Piano):** Arka planda prosedürel akan huzurlu yağmur ambiyansı ve derin keçe akustik piyano akorları.
- **🎚️ Master GainNode Ses Çubuğu:** Ses düzeyi (%0 - %100) donanım düzeyinde gecikmesiz olarak kısılıp açılabilir; anlık Mute (sessize alma) özelliği bulunur.
- **🟢 Spotify Canlı Durumu:** Baran'ın Spotify'daki anlık dinleme rozeti ve tek tıkla kişisel çalma listesine giden kart entegrasyonu.

### 📄 2. Özgün ATS Uyumlu Etkileşimli & Yazdırılabilir CV (`cv.html`)
- **🖨️ Tek Tıkla A4 PDF Çıktısı (`@media print`):** "PDF Olarak İndir / Yazdır" butonuna basıldığında menüler ve butonlar gizlenir; sayfa otomatik olarak tam A4 formatında, kurumsal ve ATS uyumlu bir PDF'e dönüşür.
- **📋 Panoya Metin Kopyalama:** Başvuru formları ve mesajlar için CV'nin temiz Markdown/metin formatını tek tıkla panoya kopyalar (`navigator.clipboard`).

### ⚡ 3. 2D Gravity & Oyun Fiziği Motoru (Unity Homage)
- Saf HTML5 Canvas ve Euler hareket denklemleri ile geliştirilmiş 2D fizik simülatörü.
- Yerçekimi ivmesi, hava sürtünmesi, esnek sekme ($e = 0.65$) ve zemin çarpışmaları.
- Ziyaretçilerin fareyle kutuları tutup fırlatabildiği veya yeni kutu üretebildiği etkileşimli oyun alanı.

### 💻 4. Retro Terminal CLI & Konami Code Easter Egg
- Klavye kısayolu (`~`) veya efsanevi **Konami Code** (`↑ ↑ ↓ ↓ ← → ← → B A`) tuş dizilimi ile açılan retro interaktif konsol.
- Komut ayrıştırıcı (CLI parser) ile `help`, `about`, `skills`, `projects`, `cv`, `music`, `vol [0-100]`, `mute`, `gravity`, `matrix`, `clear` komutlarını destekler.

### 🕒 5. Canlı Ankara Saati & Dinamik Aktivite Takibi
- `Europe/Istanbul` saat dilimine göre anlık çalışan ve saate göre Baran'ın o anki olası aktivitesini (Ders & Laboratuvar, Unity Oyun Mekanikleri, C# Algoritma Çalışması, Dinlenme & Bug Avı) simüle eden dinamik çip.

### 🌓 6. Akıllı Tema Motoru (Dark / Light Mode)
- İşletim sistemi tercihini (`prefers-color-scheme`) otomatik algılar.
- Kullanıcının manuel seçimini `localStorage` üzerinde saklar.
- Sayfa açılışında sıfır titreme (FOUC-free) ile temayı uygular.

---

## 📂 Proje Dizin Yapısı

```bash
portfolio/
├── index.html        # Ana Sayfa: Tanıtım, özet, fizik & terminal kısayolları
├── about.html        # Hakkımda: Akademik geçmiş, eğitim & Botart staj zaman çizelgesi
├── projects.html     # Projeler: Web platformları, C# konsol ve Unity 2D mekanikleri
├── skills.html       # Yetkinlikler: C#, .NET, Unity, SQL, Web mimarisi ve pratikler
├── cv.html           # Özgeçmiş (CV): ATS uyumlu, tek tıkla A4 PDF çıktısı & metin kopyalama
├── contact.html      # İletişim: Doğrudan e-posta, GitHub, LinkedIn ve sosyal ağlar
├── 404.html          # Özel Hata Sayfası: Retro terminal tarzı yönlendirme
├── style.css         # CSS Değişkenleri, fluid tipografi, temalar ve @media print motoru
├── script.js         # Web Audio API müzik motoru, 2D Canvas fizik, terminal CLI & canlı saat
├── PROJECT_PLAN.md   # Mimari yol haritası & yapay zeka genel sistem istemi (AI System Prompt)
└── README.md         # Proje mimari ve teknik dökümantasyonu
```

---

## 🚀 Yerel Olarak Çalıştırma

Proje sıfır derleme (**build-less**) mimarisiyle hazırlandığı için herhangi bir paket yüklemeden doğrudan çalıştırılabilir:

```bash
# Projeyi klonlayın
git clone https://github.com/2f7fjrk4sw-prog/portfolio.git
cd portfolio

# Doğrudan index.html dosyasını tarayıcınızda açın veya yerel bir sunucu başlatın:
# Node.js ile:
npx serve .

# veya Python ile:
python -m http.server 3000
```

---

## 🌐 Canlı Yayın (Deployment)

Proje GitHub Pages veya Vercel üzerinde tek tıkla barındırılabilir:

- **GitHub Pages:**
  - Ayarlar: Repository Settings $\rightarrow$ Pages $\rightarrow$ Source: `Deploy from a branch` $\rightarrow$ Branch: `main` / `(root)`.
  - Canlı Adres: [https://2f7fjrk4sw-prog.github.io/portfolio/](https://2f7fjrk4sw-prog.github.io/portfolio/)
- **Vercel:**
  - Vercel Dashboard $\rightarrow$ Import `portfolio` $\rightarrow$ Deploy.
  - *Not:* Dışarıdan girişlerde izin sorulmaması için Vercel Settings $\rightarrow$ Deployment Protection $\rightarrow$ Vercel Authentication'ı **Disabled** konumuna getirin.

---

## 👤 Geliştirici & İletişim

**Baran Deniz Mutluoğlu**  
- **Üniversite:** OSTİM Teknik Üniversitesi — Yazılım Mühendisliği (Lisans — %100 İngilizce, 2. Sınıf)  
- **Staj Deneyimi:** Botart Yazılım ve Bilgi Teknolojileri AR-GE A.Ş. (Ege Üniversitesi Teknopark / Oyun Geliştirme)  
- **E-posta:** [barandmutluoglu@icloud.com](mailto:barandmutluoglu@icloud.com)  
- **LinkedIn:** [linkedin.com/in/baranmutluoglua](https://linkedin.com/in/baranmutluoglua)  
- **GitHub:** [@2f7fjrk4sw-prog](https://github.com/2f7fjrk4sw-prog)  
- **Odak Alanları:** C#, .NET, Unity Engine (2D/3D Oyun Fiziği) & Modern Web Mimarisi  

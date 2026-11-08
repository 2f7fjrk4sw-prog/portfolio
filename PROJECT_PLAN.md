# 📋 Portfolyo Proje Planı & Yapay Zeka Geliştirici Yönergesi
> **Dosya Amacı:** Bu belge; Baran Deniz Mutluoğlu'nun kişisel web portfolyosunun mimarisini, teknik felsefesini, mevcut özelliklerini ve gelecek yol haritasını özetler. Aynı zamanda bu projede çalışacak olan **herhangi bir yapay zeka modeline (LLM / Agent)** kılavuzluk edecek **Genel Sistem İstemi (General System Prompt)** niteliğindedir.

---

## 🤖 1. BÖLÜM: YAPAY ZEKA GELİŞTİRİCİSİ İÇİN GENEL İSTEM (AI SYSTEM PROMPT)

> [!IMPORTANT]
> **Bu projede kod yazacak, düzenleme yapacak veya öneride bulunacak yapay zekaya talimattır:**
> Sen, Baran Deniz Mutluoğlu'nun kişisel web portfolyosu üzerinde çalışan kıdemli bir eşlikçi yazılım mühendisisin (Pair Programmer). Bu projede görev alırken aşağıdaki kuralları **kesin ve istisnasız** olarak uygulamak zorundasın:

### 1.1 Temel Davranış ve Mühendislik İlkeleri (Non-Negotiable Rules)
1. **Anti-AI Slop (Yapay Zeka Klişelerinden Arınmışlık):**
   - Asla abartılı, içi boş yapay zeka sloganları kullanma (*"cutting-edge", "revolutionary", "visionary digital creator", "passionate problem solver", "delve"* vb.).
   - Asla gerçekte var olmayan kıdem iddialarında bulunma. Baran, **OSTİM Teknik Üniversitesi'nde 2. sınıf yazılım mühendisliği öğrencisidir**. Samimi, mütevazı, öğrenmeye aç, teknik olarak disiplinli ve dürüst bir üslup kullanılmalıdır.
   - Asla anlamsız yüzde göstergeleri (%98 C#, %85 Python vb.) veya yapay ilerleme çubukları koyma. Yetkinlikler somut araçlar, pratikler ve projelerle açıklanmalıdır.

2. **Sıfır Harici Kütüphane Şişkinliği (Zero-Dependency & Pure Web):**
   - Proje **saf semantik HTML5, modern vanilla CSS3 ve saf ES6+ JavaScript** ile yazılmıştır.
   - Hiçbir koşulda harici CSS kütüphaneleri (Tailwind, Bootstrap), JS framework'leri (React, Vue) veya ağır kütüphaneler (jQuery, Lodash, Three.js) projeye dahil edilmeyecektir.
   - Tarayıcının yerel API'leri (`Web Audio API`, `Canvas API`, `IntersectionObserver`, `Clipboard API`, `localStorage`) tercih edilmelidir.

3. **Bütün Kodlara Kapsamlı ve Eğitici Türkçe Açıklama:**
   - Baran'ın özel isteğidir: Yazılan, değiştirilen veya refactor edilen **her fonksiyon, her CSS kural grubu ve her HTML bloğu**, ne işe yaradığını ve neden böyle tasarlandığını anlatan ayrıntılı Türkçe yorum satırlarıyla (`// ...` veya `/* ... */`) donatılmalıdır.

4. **Kişisel Veri ve İletişim Tutarlılığı:**
   - **Geliştirici:** Baran Deniz Mutluoğlu
   - **Üniversite / Bölüm:** OSTİM Teknik Üniversitesi — Yazılım Mühendisliği (%100 İngilizce, 2. Sınıf)
   - **E-posta:** `barandmutluoglu@icloud.com` (Kesinlikle başka bir e-posta veya geçici adres kullanılmamalıdır)
   - **GitHub:** `https://github.com/2f7fjrk4sw-prog`
   - **Spotify Listesi:** `https://open.spotify.com/playlist/3DzI2diuYDRNeN0FC8duot?si=72bdabda5c8143d9` (ID: `3DzI2diuYDRNeN0FC8duot`)
   - **Öğrenci Numarası:** Kamusal web sitesinde öğrenci numarası yer almamalıdır.

5. **Baran'ın Kişisel Tanıtım Metni (Birebir Korunmalıdır):**
   > *"Merhaba ben baran deniz mutluoğlu OSTİM Teknik Üniversitesinde ikinci sınıf bir yazılım mühendisliği öğrencisiyim. Bu sitede hem yaptığım projeleri hem de aktif olarak üzerine eğildiğim alanları bulabilirsiniz. Staj ve İşbirliklerine her zaman açığım"*

6. **Çok Sayfalı Mimari Senkronizasyonu:**
   - Proje tek sayfa (SPA) karmaşasından uzaklaştırılmış, her konunun kendi bağımsız sayfası olan çok sayfalı bir mimariye kavuşturulmuştur.
   - Ortak bileşenler (Navigasyon çubuğu, Footer, Müzik Çalar Widget'ı, Terminal Modalı, Fizik Tuvali) güncellendiğinde **tüm 5 sayfa (`index.html`, `about.html`, `projects.html`, `skills.html`, `contact.html`)** eksiksiz şekilde senkronize edilmelidir.

7. **Doğrulama ve Git Disiplini:**
   - JavaScript dosyası değiştirildiğinde her zaman sözdizimi doğrulaması yapılmalıdır (`node -c script.js`).
   - Yapılan her anlamlı değişiklik anlaşılır bir commit mesajıyla GitHub `main` dalına pushlanmalıdır.

---

## 👤 2. BÖLÜM: GELİŞTİRİCİ PROFİLİ & ODAK ALANLARI

```yaml
Ad Soyad: Baran Deniz Mutluoğlu
Eğitim: OSTİM Teknik Üniversitesi (Ankara)
Bölüm: Yazılım Mühendisliği (Lisans, 2. Sınıf, %100 İngilizce)
İletişim: barandmutluoglu@icloud.com
GitHub: https://github.com/2f7fjrk4sw-prog
Depo: https://github.com/2f7fjrk4sw-prog/portfolio

Ana Odak Alanları:
  - C# & .NET 10 (Konsol Mimarisi, OOP, Veri Yapıları, Temiz Kod)
  - Unity Game Engine (2D/3D Mekanikler, RigidBody Fiziği, C# Scripting)
  - Modern Web Standartları (Semantik HTML5, CSS Grid/Flexbox, ES6+ JS)
  - Yazılım Mühendisliği Pratikleri (Defansif Programlama, YAGNI, KISS)
```

---

## 🏛️ 3. BÖLÜM: PROJE DİZİN YAPISI & SAYFA MİMARİSİ

```bash
portfolio/
├── index.html        # Ana Sayfa: Canlı saat, aktivite simülatörü, Baran'ın notu, hızlı navigasyon
├── about.html        # Hakkımda: Akademik arka plan, yazılım felsefesi, çalışma prensipleri
├── projects.html     # Projeler: Oyun Haberleri Platformu, C# Konsol Paketi, Unity Prototipi
├── skills.html       # Yetkinlikler: Kategorik yetenekler + Unity Fizik Motoru tetikleyicisi
├── contact.html      # İletişim: E-posta bağlantısı, tek tıkla panoya kopyalama ve GitHub linki
├── style.css         # Tek merkezli karanlık tema, CSS değişkenleri, responsive grid & widget stilleri
├── script.js         # Müzik çalar, Web Audio API synth, 2D Canvas fizik motoru, terminal CLI
├── README.md         # Genel proje ve GitHub Pages tanıtım belgesi
└── PROJECT_PLAN.md   # [BU DOSYA] Proje planı ve yapay zeka genel sistem istemi
```

---

## 🚀 4. BÖLÜM: İMZA ÖZELLİKLER VE TEKNİK ÇALIŞMA PRENSİPLERİ

Sitede ziyaretçilerin dikkatini çeken, doğrudan mühendislik kabiliyetini yansıtan 4 özgün özellik bulunmaktadır:

### 4.1. Yerel Müzik Çalar & Spotify Canlı Durumu (Feature 1 - Option 2 Mimarisi)
- **Yerel Müzik Çalar (Dahili Ses Motoru):**
  - Web Audio API tabanlı, 0 kb harici ses dosyasıyla çalışan 3 farklı analog lofi parça (`1. Gece Kodlaması`, `2. Yağmurlu Ankara`, `3. Oyun Laboratuvarı`).
  - Çalma listesi kontrolleri: Oynat/Durdur (`▶`/`⏸`), Sonraki Parça (`⏭`), Önceki Parça (`⏮`).
- **Doğrudan Ses Düzeyi Kontrolü (Volume Slider & Mute):**
  - Donanım düzeyinde ses kontrolü sağlayan Web Audio `MasterGainNode` mimarisi.
  - Sitedeki ses çubuğu (%0 - %100) yerel müziğin sesini **doğrudan açıp kısar**.
  - Tek tıkla sessize alma (`🔊` $\leftrightarrow$ `🔇`) ve `localStorage` kalıcılığı ile sayfalar arası kesintisiz deneyim.
- **Spotify "O An Ne Dinliyorum?" Canlı Durum Kartı:**
  - Baran'ın Spotify'daki anlık müzik zevkini gösteren canlı durum rozeti (`🟢 Canlı Durum`).
  - Baran'ın özel çalma listesi bağlantısı (`https://open.spotify.com/playlist/3DzI2diuYDRNeN0FC8duot`) ve istenirse açılabilen mini gömülü çalar.

### 4.2. 2D Gravity & Fizik Motoru — Unity Homage (Feature 2)
- Saf HTML5 Canvas ve Euler hareket entegrasyonu ile yazılmıştır.
- Unity'deki `RigidBody2D` bileşenine saygı duruşu niteliğindedir.
- Yerçekimi ($g = 0.38$), esneklik katsayısı ($e = 0.68$), hava ve zemin sürtünmesi içerir.
- Ziyaretçiler kutuları fareyle veya dokunmatik olarak tutup fırlatabilir, yerçekimi altında çarpışmalarını izleyebilir.
- Hem ana sayfadaki butondan hem de `skills.html` içerisindeki **Unity Yetkinlik Kartı** üzerindeki `[⚡ Fizik Motorunu Başlat]` butonundan tetiklenebilir.

### 4.3. Retro Terminal CLI & Konami Code (Feature 4)
- Sayfada `↑ ↑ ↓ ↓ ← → ← → B A` (Konami Code) girildiğinde veya `~` (Backtick) tuşuna basıldığında açılan Linux tarzı geliştirici terminali.
- **Komut Seti:**
  - `help` $\rightarrow$ Kullanılabilir komut listesini döker.
  - `about` $\rightarrow$ Baran'ın mühendislik profilini özetler.
  - `skills` $\rightarrow$ Yetkinlik listesini getirir.
  - `projects` $\rightarrow$ Projeleri ve bağlantılarını listeler.
  - `contact` $\rightarrow$ E-posta ve GitHub linklerini gösterir.
  - `spotify` $\rightarrow$ Spotify listesi çekmecesini açar/kapatır.
  - `music` $\rightarrow$ Müzik çaları açar/kapatır.
  - `lofi` $\rightarrow$ Web Audio API sentezleyicisini başlatır/durdurur.
  - `vol [0-100]` / `vol up` / `vol down` $\rightarrow$ Ses düzeyini ayarlar.
  - `mute` / `unmute` $\rightarrow$ Sesi tamamen kapatır veya açar.
  - `gravity` / `physics` $\rightarrow$ 2D fizik motorunu başlatır.
  - `matrix` $\rightarrow$ Yeşil Matrix veri yağmuru efektini çalıştırır.
  - `clear` $\rightarrow$ Terminal ekranını temizler.
  - `exit` $\rightarrow$ Terminali kapatır.

### 4.4. Canlı Ankara Saati & Öğrenci Durum Simülatörü (Feature 5)
- `Europe/Istanbul` saat diliminde gerçek zamanlı çalışan dijital saat.
- Saate göre dinamik değişen durum metinleri (Ders & Laboratuvar, Unity Oyun Mekanikleri Geliştirme, C# Algoritma Çalışması, Dinlenme & Bug Avı).

---

## 🗺️ 5. BÖLÜM: GELECEK YOL HARİTASI (FUTURE ROADMAP)

Projeye ilerleyen zamanlarda eklenebilecek planlanmış aşamalar:

| Aşama | Başlık | Açıklama | Durum |
| :--- | :--- | :--- | :--- |
| **Faz 1** | Çok Sayfalı Mimari | Sitenin `about`, `projects`, `skills`, `contact` olarak ayrılması | ✅ Tamamlandı |
| **Faz 2** | İmza Özellikler | Müzik çalar, Spotify listesi, ses ayarı, fizik simülasyonu, terminal | ✅ Tamamlandı |
| **Faz 3** | Unity WebGL Entegrasyonu | Baran'ın Unity ile geliştirdiği 2D mini prototipin `projects.html` içine gömülmesi | ⏳ Planlandı |
| **Faz 4** | Oyun Haberleri Dinamik Akışı | Baran'ın Node.js / Vanilla JS oyun haberleri projesinden son başlıkları çeken mini widget | ⏳ Planlandı |
| **Faz 5** | Teknik Blog / Notlar Sayfası | `notes.html`: Saf Markdown formatında yazılmış teknik öğrenim ve C# mühendislik notları | ⏳ Planlandı |
| **Faz 6** | Açık / Koyu Tema Seçicisi | Karanlık mat tema ile açık fildişi teması arasında geçiş sağlayan yerleşik buton | ⏳ Planlandı |

---

## 🛠️ 6. BÖLÜM: YAPAY ZEKA DEĞİŞİKLİK KONTROL LİSTESİ (CHECKLIST)

Gelecekte bu projede herhangi bir kod güncellemesi yapacak AI aşağıdaki adımları sırasıyla tamamlamalıdır:

1. [ ] Kullanıcı isteği dikkatle analiz edildi mi?
2. [ ] Yapay zeka klişesi veya sahte iddialar barındırmayan sade bir dil korundu mu?
3. [ ] Eklenen tüm kodlara detaylı Türkçe açıklamalar eklendi mi?
4. [ ] 5 sayfanın tamamındaki ortak yapılar (navigasyon, footer, widget) güncel tutuldu mu?
5. [ ] JavaScript dosyası `node -c script.js` ile sözdizimi kontrolünden geçti mi?
6. [ ] Değişiklikler Git üzerinden anlamlı bir commit mesajıyla pushlandı mı?
7. [ ] Kullanıcıya yapılan işler maddeler halinde, açık ve samimi bir dille aktarıldı mı?

/**
 * ============================================================================
 * Baran Deniz Mutluoğlu — Portfolyo İstemci Taraflı Script Motoru (script.js)
 * ============================================================================
 * 
 * Bu dosya hiçbir harici kütüphane (jQuery, React vb.) kullanılmadan,
 * doğrudan tarayıcının yerel Web API'leri (Web Audio API, Canvas 2D, 
 * IntersectionObserver, Clipboard API, localStorage) ile yazılmıştır.
 * 
 * İçerdiği Temel Modüller:
 * 1. Tema Yöneticisi (Koyu / Açık Mod & OS Tercihi Dinleme)
 * 2. E-posta Kopyalama & Toast Bildirimi Mikro-Etkileşimi
 * 3. Akıllı Sayfa Kaydırma & Mobil Navigasyon (ScrollSpy & Hamburger)
 * 4. Canlı Ankara Saati & Dinamik Durum Simülatörü (Europe/Istanbul)
 * 5. Web Audio API Lofi / Chiptune Synthesizer (0 KB MP3 Müzik Motoru)
 * 6. 2D Canvas Yerçekimi & Fizik Motoru (Unity Homage)
 * 7. Retro Terminal CLI & Konami Code Easter Egg
 */

// Sayfa tamamen yüklendiğinde tüm modülleri sırasıyla ayağa kaldır
document.addEventListener('DOMContentLoaded', () => {
  initTheme();              // Koyu / Açık tema sistemini başlat
  initCopyEmail();          // E-posta kopyalama butonunu bağla
  initScrollSpy();          // Sayfa içi kaydırma takibini başlat
  initMobileNav();          // Mobil menü açılır/kapanır mantığını kur
  initLiveTimeAndStatus();  // Canlı saat ve durum çipini çalıştır
  initLofiSynthesizer();    // Web Audio API müzik çalarını hazırla
  initPhysicsPlayground();  // 2D Fizik motoru tuvalini hazırla
  initTerminalAndKonami();  // Terminal ve Konami Code dinleyicisini kur
});

/* ==========================================================================
   1. TEMA YÖNETİCİSİ (Açık / Koyu Tema & Hafıza)
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  // 1. Kullanıcının daha önce kaydettiği bir tema tercihi var mı kontrol et (localStorage)
  const savedTheme = localStorage.getItem('theme');
  
  // 2. Eğer kayıt yoksa, işletim sisteminin karanlık modda olup olmadığına bak
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // 3. Öncelik: Kayıtlı tema > İşletim sistemi teması > 'light'
  const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  setTheme(currentTheme);

  // Butona tıklandığında temayı tersine çevir (dark <-> light) ve tarayıcıya kaydet
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const active = html.getAttribute('data-theme');
      const next = active === 'dark' ? 'light' : 'dark';
      setTheme(next);
      localStorage.setItem('theme', next); // Seçimi hatırla
    });
  }

  // Kullanıcı sitedeyken işletim sisteminin temasını değiştirirse anında uyarla
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  // HTML kök etiketine (data-theme="dark|light") özniteliğini basan yardımcı fonksiyon
  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç');
      themeToggle.setAttribute('title', theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç');
    }
  }
}

/* ==========================================================================
   2. E-POSTA KOPYALAMA & TOAST BİLDİRİMİ
   ========================================================================== */
function initCopyEmail() {
  const copyBtn = document.getElementById('copyEmailBtn');
  const toast = document.getElementById('toast');

  if (!copyBtn) return;

  const emailToCopy = copyBtn.getAttribute('data-email') || 'barandmutluoglu@icloud.com';
  const copyLabel = copyBtn.querySelector('.copy-text');

  copyBtn.addEventListener('click', async () => {
    try {
      // Modern tarayıcılar için yerel Clipboard API kullanımı
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(emailToCopy);
      } else {
        // Eski veya güvensiz bağlantılar için gizli textarea fallback yöntemi
        const textarea = document.createElement('textarea');
        textarea.value = emailToCopy;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      // Buton üzerindeki yazıyı geçici olarak "Kopyalandı!" yap
      const originalText = copyLabel ? copyLabel.textContent : 'E-postayı Kopyala';
      if (copyLabel) copyLabel.textContent = 'Kopyalandı!';
      copyBtn.classList.add('copied');

      // Alttan çıkan zarif Toast bildirimini göster
      showToast('E-posta panoya kopyalandı: ' + emailToCopy);

      // 2.4 saniye sonra butonu eski metnine döndür
      setTimeout(() => {
        if (copyLabel) copyLabel.textContent = originalText;
        copyBtn.classList.remove('copied');
      }, 2400);

    } catch (err) {
      // Pano erişimi engellenmişse doğrudan varsayılan e-posta uygulamasını aç
      window.location.href = `mailto:${emailToCopy}`;
    }
  });

  // Toast bildirimini ekranda gösterip 3 saniye sonra kaldıran fonksiyon
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}

/* ==========================================================================
   3. SAYFA KAYDIRMA & MOBİL MENÜ YÖNETİMİ
   ========================================================================== */
function initScrollSpy() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Yalnızca sayfa içi çapa (#) linkleri filtrele (çok sayfalı yapıyı bozmamak için)
  const hashNavLinks = Array.from(navLinks).filter((link) => {
    const href = link.getAttribute('href');
    return href && href.startsWith('#');
  });

  if (!sections.length || !hashNavLinks.length) return;

  // IntersectionObserver ile ekranın ortasına gelen bölümü tespit et
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        hashNavLinks.forEach((link) => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}

function initMobileNav() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.querySelector('.nav-links');

  if (!menuBtn || !navLinks) return;

  // Hamburger butonuna tıklandığında menüyü aç / kapa
  menuBtn.addEventListener('click', () => {
    const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', !isExpanded);
    navLinks.classList.toggle('open');
  });

  // Menüdeki herhangi bir linke tıklandığında menüyü otomatik kapat
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // Kullanıcı ESC tuşuna basarsa açık olan mobil menüyü kapat
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ==========================================================================
   4. CANLI ANKARA SAATİ & AKTİVİTE SİMÜLATÖRÜ (Feature 5)
   ========================================================================== */
function initLiveTimeAndStatus() {
  const timeEl = document.getElementById('liveTimeText');
  const activityEl = document.getElementById('liveActivityText');

  if (!timeEl && !activityEl) return;

  function updateClock() {
    const now = new Date();
    // Türkiye saat dilimini (UTC+3 Europe/Istanbul) esas alarak saat ve dakikayı al
    const options = { timeZone: 'Europe/Istanbul', hour: '2-digit', minute: '2-digit', hour12: false };
    const timeStr = new Intl.DateTimeFormat('tr-TR', options).format(now);
    
    // Saat değerine göre Baran'ın o anki tipik geliştirici modunu hesapla
    const trHour = parseInt(new Intl.DateTimeFormat('tr-TR', { timeZone: 'Europe/Istanbul', hour: 'numeric', hour12: false }).format(now), 10);

    if (timeEl) {
      timeEl.textContent = `${timeStr} (Ankara)`;
    }

    if (activityEl) {
      let status = '';
      if (trHour >= 8 && trHour < 12) {
        status = '☕ Sabah Kahvesi & Üniversite Dersleri';
      } else if (trHour >= 12 && trHour < 17) {
        status = '💻 C# & .NET Projeleri Kodlama';
      } else if (trHour >= 17 && trHour < 21) {
        status = '🎮 Unity Oyun Mekanikleri & Fizik Testleri';
      } else if (trHour >= 21 && trHour < 24) {
        status = '🚀 Web Mimarileri & Kod İncelemesi';
      } else {
        status = '🌙 Gece Modu: Bug Avı & Dinlenme';
      }
      activityEl.textContent = status;
    }
  }

  updateClock();
  setInterval(updateClock, 30000); // Her 30 saniyede bir saati güncelle
}

/* ==========================================================================
   5. ÇOK TÜRLÜ YEREL MÜZİK MOTORU & SPOTIFY CANLI DURUMU (Feature 1)
   ==========================================================================
   Açıklama:
   Kullanıcının "bütün parçalar aynı gibi" geri bildirimi üzerine; her biri
   tamamen FARKLI BİR MÜZİK TÜRÜ, RİTMİK ALTYAPI VE SES TASARIMINA sahip
   4 özgün prosedürel parça geliştirilmiştir:
   
   1. ☕ Lofi Hip-Hop (Chillhop Boom-Bap & Vinyl):
      - Gerçek Lo-Fi davul vuruşları (Kick, Snare, Swing Hi-Hat)
      - Sıcak Rhodes elektro-piyano akorları ve pentatonik çanlar
   2. 👾 8-Bit Arcade (Retro Chiptune & Unity):
      - 128 BPM hızlı, enerjik arcade arpejleri (Square wave)
      - Nostaljik Nintendo / Game Boy bas yürüyüşü ve gürültü patlamalı snare
   3. 🌆 Cyberpunk 2088 (Dark Synthwave & Drive):
      - Dört vuruşlu (four-on-the-floor) sert kick ve pompalayan Sawtooth bas
      - Sinematik analog synth pad akorları
   4. 🌧️ Yağmurlu Ankara (Rain Ambiance & Felt Piano):
      - Sıfır davul; cam kenarında yağan gerçekçi prosedürel yağmur sesi
      - Derin, duygusal ve yavaş akustik keçe piyano akorları
      
   Ses Çubuğu (Master GainNode), bu motorların tamamının genel ses seviyesini
   %0 ile %100 arasında donanım düzeyinde pürüzsüzce kontrol eder.
   ========================================================================== */
let audioCtx = null;
let isAudioPlaying = false;
let sequencerTimer = null;
let currentStep = 0;

// Master Ses Düzeyi Değişkenleri
let masterGainNode = null;
let masterVolume = 0.7;    // Varsayılan ses seviyesi: %70
let previousVolume = 0.7;  // Mute (sessize alma) öncesi hatırlanan ses seviyesi

// Paylaşımlı Beyaz Gürültü Tamponu (Davullar ve Yağmur Sesi İçin)
let sharedNoiseBuffer = null;
function getNoiseBuffer(ctx) {
  if (sharedNoiseBuffer) return sharedNoiseBuffer;
  const bufferSize = ctx.sampleRate * 2;
  sharedNoiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = sharedNoiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return sharedNoiseBuffer;
}

// 4 Tamamen Farklı Müzik Türü ve Ritim Konfigürasyonu
const playlistTracks = [
  {
    id: "lofi",
    title: "1. Chillhop Beat (Lofi Boom-Bap & Vinyl)",
    shortTitle: "Lofi Chillhop",
    bpm: 78,
    chords: [
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [130.81, 164.81, 196.00, 246.94], // Cmaj7
      [196.00, 246.94, 293.66, 392.00]  // G
    ],
    melody: [440.00, 493.88, 523.25, 659.25, 783.99, 880.00]
  },
  {
    id: "chiptune",
    title: "2. 8-Bit Arcade (Retro Chiptune & Game)",
    shortTitle: "8-Bit Arcade",
    bpm: 128,
    arpChords: [
      [261.63, 329.63, 392.00, 523.25], // C
      [220.00, 261.63, 329.63, 440.00], // Am
      [174.61, 220.00, 261.63, 349.23], // F
      [196.00, 246.94, 293.66, 392.00]  // G
    ],
    bassRoots: [130.81, 110.00, 87.31, 98.00]
  },
  {
    id: "synthwave",
    title: "3. Cyberpunk 2088 (Dark Synthwave & Drive)",
    shortTitle: "Cyberpunk 2088",
    bpm: 106,
    sawChords: [
      [164.81, 196.00, 246.94, 329.63], // Em
      [130.81, 164.81, 196.00, 261.63], // C
      [146.83, 174.61, 220.00, 293.66], // Dm
      [123.47, 155.56, 185.00, 246.94]  // Bm
    ],
    bassRoots: [82.41, 65.41, 73.42, 61.74]
  },
  {
    id: "rainy",
    title: "4. Yağmurlu Ankara (Rain & Felt Piano)",
    shortTitle: "Yağmur & Piyano",
    bpm: 64,
    pianoChords: [
      [130.81, 164.81, 196.00, 246.94, 329.63], // Cmaj9
      [146.83, 174.61, 220.00, 261.63, 329.63], // Dm9
      [174.61, 220.00, 261.63, 329.63, 392.00], // Fmaj7#11
      [130.81, 164.81, 196.00, 246.94, 293.66]  // Cadd9
    ],
    dropletNotes: [523.25, 659.25, 783.99, 987.77, 1046.50]
  }
];

let currentTrackIndex = 0; // Başlangıç parçası (Lofi Boom-Bap)

function initLofiSynthesizer() {
  const musicWidget = document.getElementById('musicWidget') || document.getElementById('lofiWidget');
  const toggleBtn = document.getElementById('musicToggleBtn') || document.getElementById('lofiToggleBtn');
  const spotifyCard = document.getElementById('spotifyCard');
  const spotifyCloseBtn = document.getElementById('spotifyCloseBtn');

  // Yerel Çalar Kontrolleri
  const playPauseBtn = document.getElementById('playPauseBtn');
  const playPauseIcon = document.getElementById('playPauseIcon');
  const pillPlayIcon = document.getElementById('pillPlayIcon');
  const prevTrackBtn = document.getElementById('prevTrackBtn');
  const nextTrackBtn = document.getElementById('nextTrackBtn');
  const trackStatusPill = document.getElementById('trackStatusPill');
  const trackCurrentName = document.getElementById('trackCurrentName');
  const pillTrackTitle = document.getElementById('pillTrackTitle');

  // Ses Düzeyi Kontrol Elemanları
  const volumeSlider = document.getElementById('volumeSlider');
  const volumeVal = document.getElementById('volumeVal');
  const volumeMuteBtn = document.getElementById('volumeMuteBtn');
  const volumeIcon = document.getElementById('volumeIcon');

  // Mini Spotify Oynatıcıyı Göster/Gizle Butonu
  const spotifyEmbedToggleBtn = document.getElementById('spotifyEmbedToggleBtn');
  const spotifyEmbedWrap = document.getElementById('spotifyEmbedWrap');

  if (!musicWidget || !toggleBtn) return;

  // --------------------------------------------------------------------------
  // A) ÇEKMECE PENCERESİ AÇILIR / KAPANIR YÖNETİMİ
  // --------------------------------------------------------------------------
  function openDrawer() {
    if (!spotifyCard) return;
    spotifyCard.classList.add('open');
    musicWidget.classList.add('open');
    spotifyCard.setAttribute('aria-hidden', 'false');
  }

  function closeDrawer() {
    if (!spotifyCard) return;
    spotifyCard.classList.remove('open');
    musicWidget.classList.remove('open');
    spotifyCard.setAttribute('aria-hidden', 'true');
  }

  function toggleDrawer() {
    if (!spotifyCard) return;
    if (spotifyCard.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  }

  if (spotifyCloseBtn) {
    spotifyCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeDrawer();
    });
  }

  toggleBtn.addEventListener('click', () => {
    toggleDrawer();
  });

  document.addEventListener('click', (e) => {
    if (spotifyCard && spotifyCard.classList.contains('open')) {
      if (!musicWidget.contains(e.target)) {
        closeDrawer();
      }
    }
  });

  // Opsiyonel Mini Spotify Embed Aç/Kapat Butonu
  if (spotifyEmbedToggleBtn && spotifyEmbedWrap) {
    spotifyEmbedToggleBtn.addEventListener('click', () => {
      const isVisible = spotifyEmbedWrap.style.display !== 'none';
      if (isVisible) {
        spotifyEmbedWrap.style.display = 'none';
        spotifyEmbedToggleBtn.classList.remove('active');
        spotifyEmbedToggleBtn.querySelector('span:first-child').textContent = 'Mini Spotify Oynatıcıyı Göster';
      } else {
        spotifyEmbedWrap.style.display = 'block';
        spotifyEmbedToggleBtn.classList.add('active');
        spotifyEmbedToggleBtn.querySelector('span:first-child').textContent = 'Mini Spotify Oynatıcıyı Gizle';
      }
    });
  }

  // --------------------------------------------------------------------------
  // B) SES DÜZEYİ (VOLUME) YÖNETİMİ & DOĞRUDAN GAIN KONTROLÜ
  // --------------------------------------------------------------------------
  try {
    const savedVol = localStorage.getItem('baran_portfolio_volume');
    if (savedVol !== null && !isNaN(parseFloat(savedVol))) {
      masterVolume = Math.max(0, Math.min(1, parseFloat(savedVol)));
    }
  } catch (err) {}

  function updateVolumeUI(vol) {
    const percent = Math.round(vol * 100);
    if (volumeSlider) {
      volumeSlider.value = percent;
      volumeSlider.title = `Ses Düzeyi: %${percent}`;
    }
    if (volumeVal) {
      volumeVal.textContent = `${percent}%`;
    }
    if (volumeIcon) {
      if (vol === 0) {
        volumeIcon.textContent = '🔇';
      } else if (vol < 0.35) {
        volumeIcon.textContent = '🔉';
      } else {
        volumeIcon.textContent = '🔊';
      }
    }
  }

  // MasterGainNode üzerinden genel ses şiddetini anında günceller (Sesi tam kontrol eder)
  function setVolume(vol, saveToStorage = true) {
    const clamped = Math.max(0, Math.min(1, parseFloat(vol)));
    masterVolume = clamped;

    if (saveToStorage) {
      try {
        localStorage.setItem('baran_portfolio_volume', masterVolume.toString());
      } catch (err) {}
    }

    if (audioCtx && masterGainNode) {
      masterGainNode.gain.setValueAtTime(masterVolume, audioCtx.currentTime);
    }

    updateVolumeUI(masterVolume);
  }

  updateVolumeUI(masterVolume);

  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      const newVol = parseFloat(e.target.value) / 100;
      if (newVol > 0) previousVolume = newVol;
      setVolume(newVol);
    });
  }

  if (volumeMuteBtn) {
    volumeMuteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (masterVolume > 0) {
        previousVolume = masterVolume;
        setVolume(0);
      } else {
        setVolume(previousVolume > 0 ? previousVolume : 0.7);
      }
    });
  }

  // --------------------------------------------------------------------------
  // C) WEB AUDIO API ÇOK TÜRLÜ SES SENTEZLEYİCİSİ (MULTİ-GENRE SYNTH & DRUMS)
  // --------------------------------------------------------------------------
  function ensureAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    if (!masterGainNode && audioCtx) {
      masterGainNode = audioCtx.createGain();
      masterGainNode.gain.setValueAtTime(masterVolume, audioCtx.currentTime);
      masterGainNode.connect(audioCtx.destination);
    }
    return audioCtx;
  }

  // 1. Kick Davulu (Türlere göre tonu değişir)
  function playKick(time, style = 'lofi') {
    if (!audioCtx || !masterGainNode) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    if (style === 'synthwave') {
      // Sert, dört vuruşlu synthwave kick'i
      osc.frequency.setValueAtTime(160, time);
      osc.frequency.exponentialRampToValueAtTime(38, time + 0.12);
      gain.gain.setValueAtTime(0.65, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);
    } else if (style === 'chiptune') {
      // 8-bit retro arcade bas vuruşu
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, time);
      osc.frequency.exponentialRampToValueAtTime(45, time + 0.08);
      gain.gain.setValueAtTime(0.45, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
    } else {
      // Sıcak, vinil Lofi boom-bap kick'i
      osc.frequency.setValueAtTime(130, time);
      osc.frequency.exponentialRampToValueAtTime(32, time + 0.14);
      gain.gain.setValueAtTime(0.5, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
    }

    osc.connect(gain);
    gain.connect(masterGainNode);
    osc.start(time);
    osc.stop(time + 0.22);
  }

  // 2. Snare / Trampet (Gürültü ve Gövde Karışımı)
  function playSnare(time, style = 'lofi') {
    if (!audioCtx || !masterGainNode) return;
    const buf = getNoiseBuffer(audioCtx);
    const noise = audioCtx.createBufferSource();
    noise.buffer = buf;

    const filter = audioCtx.createBiquadFilter();
    filter.type = style === 'synthwave' ? 'bandpass' : 'highpass';
    filter.frequency.setValueAtTime(style === 'synthwave' ? 1200 : 900, time);

    const gain = audioCtx.createGain();
    const dur = style === 'synthwave' ? 0.2 : (style === 'chiptune' ? 0.09 : 0.14);
    gain.gain.setValueAtTime(style === 'chiptune' ? 0.35 : 0.25, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(masterGainNode);
    noise.start(time);
    noise.stop(time + dur);

    // Gövde tonu (Snare Body)
    if (style !== 'chiptune') {
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();
      osc.frequency.setValueAtTime(style === 'synthwave' ? 220 : 175, time);
      oscGain.gain.setValueAtTime(0.2, time);
      oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.09);
      osc.connect(oscGain);
      oscGain.connect(masterGainNode);
      osc.start(time);
      osc.stop(time + 0.09);
    }
  }

  // 3. Hi-Hat (Zil)
  function playHiHat(time, open = false) {
    if (!audioCtx || !masterGainNode) return;
    const buf = getNoiseBuffer(audioCtx);
    const noise = audioCtx.createBufferSource();
    noise.buffer = buf;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7500, time);

    const gain = audioCtx.createGain();
    const dur = open ? 0.14 : 0.035;
    gain.gain.setValueAtTime(open ? 0.14 : 0.09, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(masterGainNode);
    noise.start(time);
    noise.stop(time + dur);
  }

  // 4. Lofi Sıcak Elektro-Piyano Akoru (Rhodes Stili)
  function playLofiChord(chord, time) {
    if (!audioCtx || !masterGainNode) return;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, time);
    filter.connect(masterGainNode);

    chord.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.05, time + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 1.6);

      osc.connect(gain);
      gain.connect(filter);
      osc.start(time);
      osc.stop(time + 1.6);
    });
  }

  // 5. 8-Bit Kare Dalga Arpej Notası (Chiptune)
  function playChiptuneArp(freq, time) {
    if (!audioCtx || !masterGainNode) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.065, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.09);

    osc.connect(gain);
    gain.connect(masterGainNode);
    osc.start(time);
    osc.stop(time + 0.09);
  }

  // 6. 8-Bit Retro Bas Yürüyüşü
  function playChiptuneBass(freq, time) {
    if (!audioCtx || !masterGainNode) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.12, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.16);

    osc.connect(gain);
    gain.connect(masterGainNode);
    osc.start(time);
    osc.stop(time + 0.16);
  }

  // 7. Synthwave Pumping Saw Bası
  function playSynthwaveBass(freq, time) {
    if (!audioCtx || !masterGainNode) return;
    const osc = audioCtx.createOscillator();
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280, time);
    filter.Q.setValueAtTime(2.5, time);

    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.18, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGainNode);
    osc.start(time);
    osc.stop(time + 0.18);
  }

  // 8. Synthwave Sinematik Pad Akoru
  function playSynthwavePad(chord, time) {
    if (!audioCtx || !masterGainNode) return;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(850, time);
    filter.connect(masterGainNode);

    chord.forEach((freq) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.035, time + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 1.8);

      osc.connect(gain);
      gain.connect(filter);
      osc.start(time);
      osc.stop(time + 1.8);
    });
  }

  // 9. Yağmur ve Keçe Piyano Akoru
  function playRainyPiano(chord, time) {
    if (!audioCtx || !masterGainNode) return;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, time);
    filter.connect(masterGainNode);

    chord.forEach((freq) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.06, time + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 2.8);

      osc.connect(gain);
      gain.connect(filter);
      osc.start(time);
      osc.stop(time + 2.8);
    });
  }

  // 10. Prosedürel Yağmur Sesi Motoru (Arka Plan Ambiyansı)
  let rainSource = null;
  let rainGain = null;
  function startRainSound() {
    if (!audioCtx || !masterGainNode || rainSource) return;
    const buf = getNoiseBuffer(audioCtx);
    rainSource = audioCtx.createBufferSource();
    rainSource.buffer = buf;
    rainSource.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(700, audioCtx.currentTime);

    rainGain = audioCtx.createGain();
    rainGain.gain.setValueAtTime(0.09, audioCtx.currentTime);

    rainSource.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(masterGainNode);
    rainSource.start();
  }

  function stopRainSound() {
    if (rainSource) {
      try { rainSource.stop(); } catch (e) {}
      rainSource = null;
      rainGain = null;
    }
  }

  // Parça etiketlerini arayüzde güncelle
  function updateTrackDisplay() {
    const track = playlistTracks[currentTrackIndex];
    if (trackCurrentName) trackCurrentName.textContent = track.title;
    if (pillTrackTitle) pillTrackTitle.textContent = track.shortTitle;
  }

  // --------------------------------------------------------------------------
  // D) 16 ADIMLI ADIM SEKANSÖRÜ (16-STEP MASTER SEQUENCER)
  // --------------------------------------------------------------------------
  function sequencerStep() {
    if (!isAudioPlaying || !audioCtx) return;
    const now = audioCtx.currentTime;
    const track = playlistTracks[currentTrackIndex];
    const stepInBar = currentStep % 16;
    const barIndex = Math.floor(currentStep / 16);

    if (track.id === 'lofi') {
      // LOFI BOOM-BAP RİTMİ & AKORLARI
      const chordIdx = barIndex % track.chords.length;

      // Davul vuruşları
      if (stepInBar === 0 || stepInBar === 8 || stepInBar === 10) {
        playKick(now, 'lofi');
      }
      if (stepInBar === 4 || stepInBar === 12) {
        playSnare(now, 'lofi');
      }
      if (stepInBar % 2 === 0) {
        playHiHat(now, stepInBar === 14);
      }

      // Akorlar (Barın başında ve ortasında)
      if (stepInBar === 0) {
        playLofiChord(track.chords[chordIdx], now);
      }

      // Melodi çanları
      if (stepInBar === 14 && Math.random() > 0.4) {
        const bell = audioCtx.createOscillator();
        const bGain = audioCtx.createGain();
        const note = track.melody[Math.floor(Math.random() * track.melody.length)];
        bell.type = 'sine';
        bell.frequency.setValueAtTime(note, now);
        bGain.gain.setValueAtTime(0.001, now);
        bGain.gain.linearRampToValueAtTime(0.03, now + 0.05);
        bGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
        bell.connect(bGain);
        bGain.connect(masterGainNode);
        bell.start(now);
        bell.stop(now + 1.2);
      }

    } else if (track.id === 'chiptune') {
      // 8-BIT ARCADE GAMING RETRO MÜZİK
      const chordIdx = barIndex % track.arpChords.length;
      const currentArp = track.arpChords[chordIdx];
      const noteFreq = currentArp[stepInBar % currentArp.length];

      // Hızlı 16'lık arpej
      playChiptuneArp(noteFreq, now);

      // 8-bit bas yürüyüşü
      if (stepInBar === 0 || stepInBar === 4 || stepInBar === 8 || stepInBar === 12) {
        playChiptuneBass(track.bassRoots[chordIdx], now);
      }

      // Retro davullar
      if (stepInBar === 0 || stepInBar === 8) {
        playKick(now, 'chiptune');
      }
      if (stepInBar === 4 || stepInBar === 12) {
        playSnare(now, 'chiptune');
      }

    } else if (track.id === 'synthwave') {
      // CYBERPUNK 2088 SYNTHWAVE DRIVING RİTİM
      const chordIdx = barIndex % track.sawChords.length;

      // Four-on-the-floor güçlü kick (Her dörtlükte)
      if (stepInBar % 4 === 0) {
        playKick(now, 'synthwave');
      }

      // Snare (2. ve 4. vuruşlarda)
      if (stepInBar === 4 || stepInBar === 12) {
        playSnare(now, 'synthwave');
      }

      // Pompalayan Sawtooth bas (Her 8'lik adımda)
      if (stepInBar % 2 === 0) {
        playSynthwaveBass(track.bassRoots[chordIdx], now);
      }

      // Sinematik Saw Pad akoru (Bar başında)
      if (stepInBar === 0) {
        playSynthwavePad(track.sawChords[chordIdx], now);
      }

    } else if (track.id === 'rainy') {
      // YAĞMURLU ANKARA: SIFIR DAVUL, YAĞMUR SESİ VE KEÇE PİYANO
      const chordIdx = barIndex % track.pianoChords.length;

      if (stepInBar === 0) {
        playRainyPiano(track.pianoChords[chordIdx], now);
      }

      // Damla / hafif zil tınısı
      if ((stepInBar === 6 || stepInBar === 12) && Math.random() > 0.3) {
        const drop = audioCtx.createOscillator();
        const dGain = audioCtx.createGain();
        const note = track.dropletNotes[Math.floor(Math.random() * track.dropletNotes.length)];
        drop.type = 'sine';
        drop.frequency.setValueAtTime(note, now);
        dGain.gain.setValueAtTime(0.001, now);
        dGain.gain.linearRampToValueAtTime(0.02, now + 0.04);
        dGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
        drop.connect(dGain);
        dGain.connect(masterGainNode);
        drop.start(now);
        drop.stop(now + 0.8);
      }
    }

    currentStep++;

    // Sıradaki adımı BPM hızına göre planla
    const stepDurationMs = ((60 / track.bpm) / 4) * 1000;
    sequencerTimer = setTimeout(sequencerStep, stepDurationMs);
  }

  // Müziği başlatan fonksiyon
  function startPlayback() {
    ensureAudioContext();

    if (sequencerTimer) clearTimeout(sequencerTimer);
    isAudioPlaying = true;
    musicWidget.classList.add('playing');
    if (playPauseIcon) playPauseIcon.textContent = '⏸';
    if (pillPlayIcon) pillPlayIcon.textContent = '⏸';
    if (trackStatusPill) {
      trackStatusPill.textContent = 'Çalıyor';
      trackStatusPill.classList.add('playing');
    }

    // Eğer yağmurlu parça seçildiyse yağmur sesini başlat, değilse durdur
    const track = playlistTracks[currentTrackIndex];
    if (track.id === 'rainy') {
      startRainSound();
    } else {
      stopRainSound();
    }

    currentStep = 0;
    sequencerStep();
  }

  // Müziği durduran fonksiyon
  function stopPlayback() {
    isAudioPlaying = false;
    musicWidget.classList.remove('playing');
    if (playPauseIcon) playPauseIcon.textContent = '▶';
    if (pillPlayIcon) pillPlayIcon.textContent = '▶';
    if (trackStatusPill) {
      trackStatusPill.textContent = 'Durduruldu';
      trackStatusPill.classList.remove('playing');
    }
    if (sequencerTimer) {
      clearTimeout(sequencerTimer);
      sequencerTimer = null;
    }
    stopRainSound();
  }

  // Parça değiştirme fonksiyonu
  function changeTrack(newIndex) {
    stopRainSound();
    currentTrackIndex = newIndex;
    updateTrackDisplay();
    currentStep = 0;
    if (isAudioPlaying) {
      startPlayback();
    }
  }

  // Oynat / Durdur Butonu
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
      if (isAudioPlaying) {
        stopPlayback();
      } else {
        startPlayback();
      }
    });
  }

  // Sonraki Parçaya Geçiş
  if (nextTrackBtn) {
    nextTrackBtn.addEventListener('click', () => {
      const nextIdx = (currentTrackIndex + 1) % playlistTracks.length;
      changeTrack(nextIdx);
    });
  }

  // Önceki Parçaya Geçiş
  if (prevTrackBtn) {
    prevTrackBtn.addEventListener('click', () => {
      const prevIdx = (currentTrackIndex - 1 + playlistTracks.length) % playlistTracks.length;
      changeTrack(prevIdx);
    });
  }

  updateTrackDisplay();

  // --------------------------------------------------------------------------
  // E) TERMİNAL & GLOBAL KÖPRÜLERİ (CLI ENTEGRASYONU)
  // --------------------------------------------------------------------------
  window.toggleMusicFromTerminal = function() {
    if (isAudioPlaying) {
      stopPlayback();
      return 'Müzik duraklatıldı.';
    } else {
      startPlayback();
      return `Müzik başlatıldı! Çalan: "${playlistTracks[currentTrackIndex].title}" (Ses: %${Math.round(masterVolume * 100)})`;
    }
  };

  window.nextTrackFromTerminal = function() {
    const nextIdx = (currentTrackIndex + 1) % playlistTracks.length;
    changeTrack(nextIdx);
    return `Sonraki parçaya geçildi: "${playlistTracks[currentTrackIndex].title}"`;
  };

  window.prevTrackFromTerminal = function() {
    const prevIdx = (currentTrackIndex - 1 + playlistTracks.length) % playlistTracks.length;
    changeTrack(prevIdx);
    return `Önceki parçaya dönüldü: "${playlistTracks[currentTrackIndex].title}"`;
  };

  window.toggleSpotifyFromTerminal = function() {
    if (!spotifyCard) return 'Spotify penceresi bulunamadı.';
    toggleDrawer();
    const isOpen = spotifyCard.classList.contains('open');
    return isOpen 
      ? 'Müzik çalar ve Baran\'ın Spotify canlı durumu açıldı!' 
      : 'Müzik çalar kapatıldı.';
  };

  window.setPortfolioVolume = function(val) {
    setVolume(val);
    return `Ses düzeyi %${Math.round(masterVolume * 100)} olarak ayarlandı.`;
  };

  window.getPortfolioVolume = function() {
    return Math.round(masterVolume * 100);
  };
}

/* ==========================================================================
   6. 2D CANVAS YERÇEKİMİ & FİZİK MOTORU (Feature 2 - Unity Homage)
   ==========================================================================
   Açıklama:
   Unity ve oyun geliştirme prensiplerine (RigidBody2D, Yerçekimi, Esneklik,
   Sürtünme ve Çarpışma) saygı duruşu niteliğinde; saf HTML5 Canvas ve
   Euler fizik integrasyonu ile yazılmış interaktif oyun alanı.
   ========================================================================== */
function initPhysicsPlayground() {
  const overlay = document.getElementById('physicsOverlay');
  const closeBtn = document.getElementById('physicsCloseBtn');
  const spawnBtn = document.getElementById('physicsSpawnBtn');
  const canvas = document.getElementById('physicsCanvas');

  if (!overlay || !canvas) return;

  // Ana sayfadaki veya Yetkinlikler sayfasındaki fizik başlatma butonlarını seç
  const triggerBtns = document.querySelectorAll('#gravityToggleBtn, .gravity-trigger, #skillsGravityBtn');

  const ctx = canvas.getContext('2d');
  let animationId = null;
  let bodies = [];
  let isRunning = false;
  let draggedBody = null;
  let dragOffset = { x: 0, y: 0 };
  let lastMouse = { x: 0, y: 0, time: 0 };
  let mouseVel = { x: 0, y: 0 };

  // Havadan düşecek olan teknoloji ve mühendislik kutuları
  const tagsList = [
    { text: 'C#', color: '#9b59b6' },
    { text: 'Unity', color: '#34d399' },
    { text: '.NET 10', color: '#5b8bf7' },
    { text: 'JavaScript', color: '#f59e0b' },
    { text: 'SQL', color: '#06b6d4' },
    { text: 'Algoritmalar', color: '#ec4899' },
    { text: 'Physics2D', color: '#10b981' },
    { text: 'Clean Code', color: '#3b82f6' },
    { text: 'OOP', color: '#a855f7' },
    { text: 'OSTIM Tech', color: '#f43f5e' }
  ];

  // Tuval boyutunu pencereye göre tam ekran ayarla
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 60; // Üstteki bilgi çubuğu hariç
  }

  // 2D Fizik Kutusu Sınıfı (RigidBody Simülasyonu)
  class PhysicsBox {
    constructor(x, y, text, color) {
      this.x = x;                             // X pozisyonu
      this.y = y;                             // Y pozisyonu
      this.vx = (Math.random() - 0.5) * 8;    // Başlangıç yatay hızı
      this.vy = Math.random() * -4;           // Başlangıç dikey zıplama hızı
      this.text = text;                       // Kutu üzerindeki etiket
      this.color = color;                     // Kenar çerçeve rengi
      
      this.width = Math.max(80, text.length * 14 + 28);
      this.height = 42;
      this.radius = 8;                        // Yuvarlatılmış köşe yarıçapı
      this.restitution = 0.65;                // Zıplama / Esneklik katsayısı (Bounce)
      this.friction = 0.985;                  // Hava sürtünmesi
      this.gravity = 0.48;                    // Yerçekimi ivmesi (g)
    }

    // Her karede (frame) konum ve hızları güncelle
    update(width, height) {
      if (draggedBody === this) return; // Fareyle tutuluyorsa fizik motorunu geçici askıya al

      this.vy += this.gravity;                // Yerçekimini hıza ekle
      this.vx *= this.friction;               // Hava direncini uygula
      this.vy *= this.friction;

      this.x += this.vx;                      // Pozisyonu güncelle
      this.y += this.vy;

      // Zemin Çarpışması & Geri Zıplama
      if (this.y + this.height > height) {
        this.y = height - this.height;
        this.vy = -this.vy * this.restitution; // Ters yönde sekme
        this.vx *= 0.95;                       // Zemin sürtünmesi
      }

      // Sol Duvar Çarpışması
      if (this.x < 0) {
        this.x = 0;
        this.vx = -this.vx * this.restitution;
      }

      // Sağ Duvar Çarpışması
      if (this.x + this.width > width) {
        this.x = width - this.width;
        this.vx = -this.vx * this.restitution;
      }
    }

    // Kutuyu tuvale çizen fonksiyon
    draw(ctx) {
      ctx.save();
      ctx.fillStyle = '#161b22';
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2;

      // Yuvarlatılmış dikdörtgen çiz
      ctx.beginPath();
      ctx.roundRect(this.x, this.y, this.width, this.height, this.radius);
      ctx.fill();
      ctx.stroke();

      // Etiket metnini ortala ve yaz
      ctx.fillStyle = '#f0f6fc';
      ctx.font = '600 14px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);

      ctx.restore();
    }

    // Farenin kutunun sınırları içinde olup olmadığını test eden fonksiyon
    contains(px, py) {
      return px >= this.x && px <= this.x + this.width && py >= this.y && py <= this.y + this.height;
    }
  }

  // İlk açılışta kutuları sahnede oluştur
  function spawnInitialBodies() {
    bodies = [];
    const count = tagsList.length;
    for (let i = 0; i < count; i++) {
      const item = tagsList[i];
      const startX = 60 + (i * 110) % (canvas.width - 150);
      const startY = 40 + Math.floor((i * 110) / (canvas.width - 150)) * 60;
      bodies.push(new PhysicsBox(startX, startY, item.text, item.color));
    }
  }

  // Kullanıcı butona bastığında havadan rastgele yeni bir kutu yağdır
  function spawnSingleBody() {
    const randomItem = tagsList[Math.floor(Math.random() * tagsList.length)];
    const x = Math.random() * (canvas.width - 120) + 40;
    bodies.push(new PhysicsBox(x, 20, randomItem.text, randomItem.color));
  }

  // Ana Animasyon Döngüsü (60 FPS Game Loop)
  function loop() {
    if (!isRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < bodies.length; i++) {
      bodies[i].update(canvas.width, canvas.height);
      bodies[i].draw(ctx);
    }

    animationId = requestAnimationFrame(loop);
  }

  // Fizik motorunu açan fonksiyon
  function openPhysics() {
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    resizeCanvas();
    spawnInitialBodies();
    isRunning = true;
    loop();
  }

  // Fizik motorunu kapatan fonksiyon
  function closePhysics() {
    isRunning = false;
    if (animationId) cancelAnimationFrame(animationId);
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
  }

  // Fare veya Dokunmatik Ekran Koordinatlarını Hesaplama
  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  // Kutuyu Tutma (Tıklama / Dokunma)
  function onPointerDown(e) {
    if (e.touches) e.preventDefault();
    const pos = getPos(e);
    for (let i = bodies.length - 1; i >= 0; i--) {
      if (bodies[i].contains(pos.x, pos.y)) {
        draggedBody = bodies[i];
        dragOffset.x = pos.x - draggedBody.x;
        dragOffset.y = pos.y - draggedBody.y;
        lastMouse = { x: pos.x, y: pos.y, time: performance.now() };
        mouseVel = { x: 0, y: 0 };
        break;
      }
    }
  }

  // Kutuyu Sürükleme ve Hız Hesaplama (Fırlatma mekaniği)
  function onPointerMove(e) {
    if (!draggedBody || !isRunning) return;
    if (e.touches) e.preventDefault();
    const pos = getPos(e);
    const now = performance.now();
    const dt = (now - lastMouse.time) || 16;

    // Farenin hareket hızına göre cisme momentum kazandır
    mouseVel.x = ((pos.x - lastMouse.x) / dt) * 16;
    mouseVel.y = ((pos.y - lastMouse.y) / dt) * 16;

    lastMouse = { x: pos.x, y: pos.y, time: now };

    draggedBody.x = pos.x - dragOffset.x;
    draggedBody.y = pos.y - dragOffset.y;
  }

  // Kutuyu Bırakma (Momentum ile fırlatma)
  function onPointerUp() {
    if (draggedBody) {
      draggedBody.vx = Math.max(-25, Math.min(25, mouseVel.x));
      draggedBody.vy = Math.max(-25, Math.min(25, mouseVel.y));
      draggedBody = null;
    }
  }

  // Dinleyicileri hem fareye hem dokunmatik ekranlara bağla
  canvas.addEventListener('mousedown', onPointerDown);
  canvas.addEventListener('touchstart', onPointerDown, { passive: false });

  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('touchmove', onPointerMove, { passive: false });

  window.addEventListener('mouseup', onPointerUp);
  window.addEventListener('touchend', onPointerUp);

  // Buton dinleyicileri
  triggerBtns.forEach((btn) => {
    btn.addEventListener('click', openPhysics);
  });
  closeBtn.addEventListener('click', closePhysics);
  spawnBtn.addEventListener('click', spawnSingleBody);

  window.addEventListener('resize', () => {
    if (isRunning) resizeCanvas();
  });

  // ESC tuşu ile kapatma
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isRunning) {
      closePhysics();
    }
  });

  // Terminalden 'gravity' yazıldığında çağrılması için dışa aktar
  window.launchPhysicsFromTerminal = function() {
    openPhysics();
    return '2D Gravity Fizik Motoru başlatıldı!';
  };
}

/* ==========================================================================
   7. RETRO TERMİNAL CLI & KONAMI CODE EASTER EGG (Feature 4)
   ==========================================================================
   Açıklama:
   Kült yazılımcı ve oyun şakası olan Konami Code (↑ ↑ ↓ ↓ ← → ← → B A)
   veya '~' tuşu ile tetiklenen interaktif terminal ortamı.
   Komut geçmişi (Yukarı/Aşağı ok tuşları) ve terminal içi komut çalıştırıcı.
   ========================================================================== */
function initTerminalAndKonami() {
  const terminalModal = document.getElementById('terminalModal');
  const terminalInput = document.getElementById('terminalInput');
  const terminalOutput = document.getElementById('terminalOutput');
  const terminalCloseBtn = document.getElementById('terminalCloseBtn');
  const terminalBackdrop = document.getElementById('terminalBackdrop');
  const openTerminalBtn = document.getElementById('openTerminalBtn');

  if (!terminalModal || !terminalInput || !terminalOutput) return;

  const commandHistory = []; // Daha önce yazılan komutların hafızası
  let historyIndex = -1;

  // Klasik Konami Code dizilimi
  const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiProgress = 0;

  document.addEventListener('keydown', (e) => {
    // 1. Konami Code Kontrolü
    if (e.key === konamiPattern[konamiProgress]) {
      konamiProgress++;
      if (konamiProgress === konamiPattern.length) {
        konamiProgress = 0;
        openTerminal('🎉 TEBRİKLER! Konami Code Keşfedildi. Gizli Terminal Yetkisi Verildi.\n');
      }
    } else {
      konamiProgress = (e.key === konamiPattern[0]) ? 1 : 0;
    }

    // 2. Tırnak / Backtick (`) veya Tilde (~) ile açma
    if (e.key === '`' || e.key === '~') {
      e.preventDefault();
      if (terminalModal.classList.contains('open')) {
        closeTerminal();
      } else {
        openTerminal();
      }
    }

    // 3. ESC tuşu ile kapatma
    if (e.key === 'Escape' && terminalModal.classList.contains('open')) {
      closeTerminal();
    }
  });

  // Terminali açan fonksiyon
  function openTerminal(extraMessage = '') {
    terminalModal.classList.add('open');
    if (extraMessage) {
      appendLine(extraMessage, 'cmd-echo');
    }
    setTimeout(() => terminalInput.focus(), 80);
  }

  // Terminali kapatan fonksiyon
  function closeTerminal() {
    terminalModal.classList.remove('open');
  }

  if (openTerminalBtn) {
    openTerminalBtn.addEventListener('click', () => openTerminal());
  }

  if (terminalCloseBtn) {
    terminalCloseBtn.addEventListener('click', closeTerminal);
  }

  if (terminalBackdrop) {
    terminalBackdrop.addEventListener('click', closeTerminal);
  }

  // Terminal ekranına satır ekleyen yardımcı fonksiyon
  function appendLine(text, className = '') {
    const div = document.createElement('div');
    div.className = `terminal-output-line ${className}`;
    div.innerHTML = text;
    terminalOutput.appendChild(div);
    terminalOutput.scrollTop = terminalOutput.scrollHeight; // Otomatik aşağı kaydır
  }

  // Komut Girişi ve Tuş Dinleyicisi
  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const rawCmd = terminalInput.value.trim();
      terminalInput.value = '';

      if (!rawCmd) return;

      commandHistory.push(rawCmd);
      historyIndex = commandHistory.length;

      appendLine(`baran@terminal:~$ ${escapeHtml(rawCmd)}`, 'cmd-echo');
      executeCommand(rawCmd.toLowerCase());
    } else if (e.key === 'ArrowUp') {
      // Önceki yazılan komutu geri getir
      if (historyIndex > 0) {
        historyIndex--;
        terminalInput.value = commandHistory[historyIndex] || '';
      }
    } else if (e.key === 'ArrowDown') {
      // Sonraki komuta git
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        terminalInput.value = commandHistory[historyIndex] || '';
      } else {
        historyIndex = commandHistory.length;
        terminalInput.value = '';
      }
    }
  });

  // Komut Ayrıştırıcı (Command Dispatcher)
  function executeCommand(rawCommand) {
    const parts = (rawCommand || '').trim().split(/\s+/);
    const cmd = parts[0] ? parts[0].toLowerCase() : '';
    const arg = parts.slice(1).join(' ').toLowerCase();

    switch (cmd) {
      case 'help':
        appendLine(`
Kullanılabilir Komutlar:
  <strong>about</strong>     - Baran Deniz Mutluoğlu profil detayları
  <strong>skills</strong>    - Uzmanlık alanları ve teknolojiler
  <strong>projects</strong>  - Öne çıkan projeler ve bağlantılar
  <strong>contact</strong>   - E-posta ve sosyal profil linkleri
  <strong>music</strong>     - Yerel lofi müziği başlat / durdur
  <strong>next</strong>      - Sıradaki parçaya geç
  <strong>prev</strong>      - Önceki parçaya dön
  <strong>vol [0-100]</strong> - Ses düzeyini ayarla (örn: vol 50, vol up, vol down)
  <strong>mute</strong>      - Sesi tamamen kapat (0%)
  <strong>unmute</strong>    - Sesi tekrar aç
  <strong>spotify</strong>   - Baran'ın Spotify canlı durum kartını aç / kapat
  <strong>gravity</strong>   - 2D Fizik simülasyonunu başlat
  <strong>matrix</strong>    - Matrix veri yağmuru efektini çalıştır
  <strong>clear</strong>     - Terminal ekranını temizle
  <strong>exit</strong>      - Terminali kapat
        `, 'info');
        break;

      case 'about':
        appendLine(`
Baran Deniz Mutluoğlu
OSTİM Teknik Üniversitesi — Yazılım Mühendisliği (2. Sınıf)
Odak: C#, .NET Mimarisi, Unity Oyun Geliştirme & Modern Web
Prensip: Sıfır bağımlılık şişkinliği, temiz mimari ve defansif kodlama.
        `, 'cyan');
        break;

      case 'skills':
        appendLine(`
Diller: C#, JavaScript (ES6+), SQL, HTML5 & CSS3
Oyun: Unity Engine (Orta Seviye), 2D/3D Fizik, C# Scripting
Sistemler: .NET 10, ASP.NET Core, Node.js, Git & GitHub
Pratikler: Clean Code, Defansif Tasarım, YAGNI & KISS
        `, 'info');
        break;

      case 'projects':
        appendLine(`
1. Oyun Haberleri Platformu (Vanilla JS + Node.js) -> projects.html
2. C# Algoritmik Konsol Paketi (.NET 10)           -> projects.html
3. Unity 2D/3D Oyun Mekanikleri (C# + Unity)      -> projects.html
4. Minimalist Portfolyo Sistemi (Pure Semantic)    -> index.html
        `, 'cyan');
        break;

      case 'contact':
        appendLine(`
E-posta: barandmutluoglu@icloud.com
GitHub:  https://github.com/2f7fjrk4sw-prog
Durum:   Staj ve ortak projelere açık.
        `, 'info');
        break;

      case 'spotify':
        if (window.toggleSpotifyFromTerminal) {
          const res = window.toggleSpotifyFromTerminal();
          appendLine(res, 'cyan');
        } else {
          appendLine('Spotify bileşeni henüz hazır değil.', 'error');
        }
        break;

      case 'music':
      case 'play':
      case 'pause':
      case 'lofi':
        if (window.toggleMusicFromTerminal) {
          const res = window.toggleMusicFromTerminal();
          appendLine(res, 'cyan');
        } else {
          appendLine('Müzik motoru henüz yüklenmedi.', 'error');
        }
        break;

      case 'next':
        if (window.nextTrackFromTerminal) {
          const res = window.nextTrackFromTerminal();
          appendLine(res, 'cyan');
        }
        break;

      case 'prev':
        if (window.prevTrackFromTerminal) {
          const res = window.prevTrackFromTerminal();
          appendLine(res, 'cyan');
        }
        break;

      case 'volume':
      case 'vol':
        if (!arg) {
          const current = window.getPortfolioVolume ? window.getPortfolioVolume() : 70;
          appendLine(`Mevcut ses seviyesi: %${current}. Değiştirmek için: <strong>vol 50</strong>, <strong>vol up</strong>, <strong>vol down</strong>`, 'info');
        } else if (arg === 'up' || arg === '+' || arg === 'arttir' || arg === 'artır') {
          const current = Math.min(100, (window.getPortfolioVolume ? window.getPortfolioVolume() : 70) + 10);
          const res = window.setPortfolioVolume ? window.setPortfolioVolume(current / 100) : '';
          appendLine(res || `Ses %${current} yapıldı.`, 'cyan');
        } else if (arg === 'down' || arg === '-' || arg === 'azalt' || arg === 'kis') {
          const current = Math.max(0, (window.getPortfolioVolume ? window.getPortfolioVolume() : 70) - 10);
          const res = window.setPortfolioVolume ? window.setPortfolioVolume(current / 100) : '';
          appendLine(res || `Ses %${current} yapıldı.`, 'cyan');
        } else {
          const parsed = parseInt(arg.replace('%', ''), 10);
          if (!isNaN(parsed)) {
            const clamped = Math.max(0, Math.min(100, parsed));
            const res = window.setPortfolioVolume ? window.setPortfolioVolume(clamped / 100) : '';
            appendLine(res || `Ses %${clamped} yapıldı.`, 'cyan');
          } else {
            appendLine('Geçersiz ses değeri. Örnek: <strong>vol 50</strong> veya <strong>vol up</strong>', 'error');
          }
        }
        break;

      case 'mute':
        if (window.setPortfolioVolume) {
          window.setPortfolioVolume(0);
          appendLine('Ses tamamen kapatıldı (Muted - 0%).', 'cyan');
        }
        break;

      case 'unmute':
        if (window.setPortfolioVolume) {
          window.setPortfolioVolume(0.7);
          appendLine('Ses açıldı (%70).', 'cyan');
        }
        break;

      case 'gravity':
      case 'physics':
        closeTerminal();
        if (window.launchPhysicsFromTerminal) {
          window.launchPhysicsFromTerminal();
        }
        break;

      case 'matrix':
        runMatrixRain();
        break;

      case 'clear':
        terminalOutput.innerHTML = '';
        break;

      case 'exit':
      case 'quit':
        closeTerminal();
        break;

      default:
        appendLine(`Komut bulunamadı: "${escapeHtml(cmd)}". Komut listesi için 'help' yazın.`, 'error');
        break;
    }
  }

  // Matrix Yeşil Karakter Yağmuru Efekti
  function runMatrixRain() {
    appendLine('Matrix moduna giriliyor...', 'cyan');
    let count = 0;
    const interval = setInterval(() => {
      const chars = '01アカサタナハマヤラワ0123456789ABCDEF!@#$%&*';
      let row = '';
      for (let i = 0; i < 48; i++) {
        row += chars[Math.floor(Math.random() * chars.length)];
      }
      appendLine(row, 'cmd-echo');
      count++;
      if (count > 20) {
        clearInterval(interval);
        appendLine('Matrix akışı tamamlandı. Çıkış için "clear" yazabilirsiniz.', 'info');
      }
    }, 60);
  }

  // XSS koruması için HTML karakter kaçış fonksiyonu
  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

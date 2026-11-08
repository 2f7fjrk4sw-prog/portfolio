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
   5. YEREL SES ÇALAR (SES ÇUBUĞU İLE %100 UYUMLU) & SPOTIFY DURUMU (Feature 1)
   ==========================================================================
   Açıklama:
   Kullanıcının isteğiyle entegre edilen bu sistem 2 temel parçadan oluşur:
   1. Yerel Müzik Çalar: Web Audio API tabanlı, 0 kb harici dosya kullanan
      ve 3 farklı chill parçayı çalabilen müzik motoru. Sitedeki ses çubuğu
      (Master GainNode) bu motorun sesini %0 ile %100 arasında doğrudan kısar ve açar.
   2. Spotify "O An Ne Dinliyorum?" Rozeti: Baran'ın Spotify'daki anlık dinleme
      durumunu, canlı yeşil göstergesini ve kişisel çalma listesini sergiler.
   ========================================================================== */
let audioCtx = null;
let isAudioPlaying = false;
let lofiTimer = null;
let chordIndex = 0;

// Master Ses Düzeyi Değişkenleri
let masterGainNode = null;
let masterVolume = 0.7;    // Varsayılan ses seviyesi: %70
let previousVolume = 0.7;  // Mute (sessize alma) öncesi hatırlanan ses seviyesi

// Çoklu Çalma Listesi (Web Audio API ile dinamik sentezlenen analog parçalar)
const playlistTracks = [
  {
    title: "1. Gece Kodlaması (Chill Lofi)",
    shortTitle: "Gece Kodlaması",
    tempo: 2000,
    filterFreq: 680,
    progression: [
      [220.00, 261.63, 329.63, 392.00], // Am7  (La3, Do4, Mi4, Sol4)
      [174.61, 220.00, 261.63, 329.63], // Fmaj7 (Fa3, La3, Do4, Mi4)
      [130.81, 164.81, 196.00, 246.94], // Cmaj7 (Do3, Mi3, Sol3, Si3)
      [196.00, 246.94, 293.66, 392.00]  // G     (Sol3, Si3, Re4, Sol4)
    ],
    melody: [440.00, 493.88, 523.25, 659.25, 783.99, 880.00]
  },
  {
    title: "2. Yağmurlu Ankara (Analog Jazz)",
    shortTitle: "Yağmurlu Ankara",
    tempo: 2200,
    filterFreq: 540,
    progression: [
      [146.83, 174.61, 220.00, 261.63], // Dm7  (Re3, Fa3, La3, Do4)
      [196.00, 246.94, 293.66, 349.23], // G7   (Sol3, Si3, Re4, Fa4)
      [130.81, 164.81, 196.00, 246.94], // Cmaj7 (Do3, Mi3, Sol3, Si3)
      [220.00, 277.18, 329.63, 392.00]  // A7   (La3, Do#4, Mi4, Sol4)
    ],
    melody: [349.23, 392.00, 440.00, 523.25, 587.33, 698.46]
  },
  {
    title: "3. Oyun Laboratuvarı (Chiptune Lofi)",
    shortTitle: "Oyun Laboratuvarı",
    tempo: 1800,
    filterFreq: 820,
    progression: [
      [164.81, 196.00, 246.94, 293.66], // Em7  (Mi3, Sol3, Si3, Re4)
      [130.81, 164.81, 196.00, 246.94], // Cmaj7 (Do3, Mi3, Sol3, Si3)
      [196.00, 246.94, 293.66, 392.00], // G     (Sol3, Si3, Re4, Sol4)
      [146.83, 220.00, 293.66, 369.99]  // D     (Re3, La3, Re4, Fa#4)
    ],
    melody: [587.33, 659.25, 739.99, 880.00, 987.77, 1174.66]
  }
];

let currentTrackIndex = 0; // Başlangıç parçası

function initLofiSynthesizer() {
  // DOM elementlerini seçiyoruz
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
    const isOpen = spotifyCard.classList.contains('open');
    if (isOpen) {
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

  // Doğrudan Web Audio API masterGainNode düğümünü günceller (Sesi anında açar/kısar)
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
  // C) WEB AUDIO API SENTEZLEYİCİSİ & PARÇA DEĞİŞTİRME MOTORU
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

  // Parça bilgilerini arayüzdeki başlıklar ile senkronize et
  function updateTrackDisplay() {
    const track = playlistTracks[currentTrackIndex];
    if (trackCurrentName) trackCurrentName.textContent = track.title;
    if (pillTrackTitle) pillTrackTitle.textContent = track.shortTitle;
  }

  // Tek bir akoru ve pentatonik melodi çanını ses dalgasına dönüştüren çekirdek fonksiyon
  function playChord(chord, duration = 1.8) {
    ensureAudioContext();
    if (!audioCtx || !masterGainNode) return;
    const now = audioCtx.currentTime;
    const currentTrack = playlistTracks[currentTrackIndex];

    // 1. Düşük Geçiren Filtre (Lowpass Filter): Sıcak lofi tınısı
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(currentTrack.filterFreq || 650, now);
    filter.Q.setValueAtTime(1.6, now);
    // Filtreyi doğrudan kullanıcının kontrolündeki Master GainNode'a bağlıyoruz
    filter.connect(masterGainNode);

    // 2. Akor frekanslarını osilatörler ile çal
    chord.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(filter);

      osc.start(now);
      osc.stop(now + duration);
    });

    // 3. Hafif Rastgele Melodi Çanı
    if (Math.random() > 0.35 && currentTrack.melody.length) {
      const bellOsc = audioCtx.createOscillator();
      const bellGain = audioCtx.createGain();
      const randomNote = currentTrack.melody[Math.floor(Math.random() * currentTrack.melody.length)];

      bellOsc.type = 'sine';
      bellOsc.frequency.setValueAtTime(randomNote, now + 0.25);

      bellGain.gain.setValueAtTime(0.001, now + 0.25);
      bellGain.gain.linearRampToValueAtTime(0.028, now + 0.28);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);

      bellOsc.connect(bellGain);
      bellGain.connect(filter);

      bellOsc.start(now + 0.25);
      bellOsc.stop(now + 1.15);
    }
  }

  // Müziği başlatan fonksiyon
  function startPlayback() {
    ensureAudioContext();

    isAudioPlaying = true;
    musicWidget.classList.add('playing');
    if (playPauseIcon) playPauseIcon.textContent = '⏸';
    if (pillPlayIcon) pillPlayIcon.textContent = '⏸';
    if (trackStatusPill) {
      trackStatusPill.textContent = 'Çalıyor';
      trackStatusPill.classList.add('playing');
    }

    const track = playlistTracks[currentTrackIndex];
    chordIndex = 0;

    // İlk akoru çal
    playChord(track.progression[chordIndex]);
    chordIndex = (chordIndex + 1) % track.progression.length;

    if (lofiTimer) clearInterval(lofiTimer);
    lofiTimer = setInterval(() => {
      const activeTrack = playlistTracks[currentTrackIndex];
      playChord(activeTrack.progression[chordIndex]);
      chordIndex = (chordIndex + 1) % activeTrack.progression.length;
    }, track.tempo || 2000);
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
    if (lofiTimer) {
      clearInterval(lofiTimer);
      lofiTimer = null;
    }
  }

  // Oynat / Durdur Butonu Dinleyicisi
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
      currentTrackIndex = (currentTrackIndex + 1) % playlistTracks.length;
      updateTrackDisplay();
      if (isAudioPlaying) {
        startPlayback(); // Yeni parçayı baştan başlat
      }
    });
  }

  // Önceki Parçaya Geçiş
  if (prevTrackBtn) {
    prevTrackBtn.addEventListener('click', () => {
      currentTrackIndex = (currentTrackIndex - 1 + playlistTracks.length) % playlistTracks.length;
      updateTrackDisplay();
      if (isAudioPlaying) {
        startPlayback();
      }
    });
  }

  // Başlangıç ekranını güncelle
  updateTrackDisplay();

  // --------------------------------------------------------------------------
  // D) TERMİNAL & GLOBAL KÖPRÜLERİ (CLI ENTEGRASYONU)
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
    currentTrackIndex = (currentTrackIndex + 1) % playlistTracks.length;
    updateTrackDisplay();
    if (isAudioPlaying) startPlayback();
    return `Sonraki parçaya geçildi: "${playlistTracks[currentTrackIndex].title}"`;
  };

  window.prevTrackFromTerminal = function() {
    currentTrackIndex = (currentTrackIndex - 1 + playlistTracks.length) % playlistTracks.length;
    updateTrackDisplay();
    if (isAudioPlaying) startPlayback();
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

/**
 * Baran Deniz Mutluoğlu — Portfolio Client Script
 * Zero external libraries, pure vanilla modern JavaScript & Web APIs.
 * Includes:
 * 1. Web Audio API Lofi Synthesizer (Feature 1)
 * 2. 2D Canvas Gravity / Physics Engine (Feature 2)
 * 3. Terminal CLI & Konami Code Easter Egg (Feature 4)
 * 4. Real-time Ankara Clock & Activity Simulator (Feature 5)
 * 5. Theme Manager, Copy Micro-interaction, ScrollSpy & Mobile Nav
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCopyEmail();
  initScrollSpy();
  initMobileNav();
  initLiveTimeAndStatus();
  initLofiSynthesizer();
  initPhysicsPlayground();
  initTerminalAndKonami();
});

/* --------------------------------------------------------------------------
   1. Theme Management (Light / Dark Mode)
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  setTheme(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const active = html.getAttribute('data-theme');
      const next = active === 'dark' ? 'light' : 'dark';
      setTheme(next);
      localStorage.setItem('theme', next);
    });
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç');
      themeToggle.setAttribute('title', theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç');
    }
  }
}

/* --------------------------------------------------------------------------
   2. Copy Email Micro-interaction
   -------------------------------------------------------------------------- */
function initCopyEmail() {
  const copyBtn = document.getElementById('copyEmailBtn');
  const toast = document.getElementById('toast');

  if (!copyBtn) return;

  const emailToCopy = copyBtn.getAttribute('data-email') || '240208406@ostimteknik.edu.tr';
  const copyLabel = copyBtn.querySelector('.copy-text');

  copyBtn.addEventListener('click', async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(emailToCopy);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = emailToCopy;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      const originalText = copyLabel ? copyLabel.textContent : 'E-postayı Kopyala';
      if (copyLabel) copyLabel.textContent = 'Kopyalandı!';
      copyBtn.classList.add('copied');

      showToast('E-posta panoya kopyalandı: ' + emailToCopy);

      setTimeout(() => {
        if (copyLabel) copyLabel.textContent = originalText;
        copyBtn.classList.remove('copied');
      }, 2400);

    } catch (err) {
      window.location.href = `mailto:${emailToCopy}`;
    }
  });

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

/* --------------------------------------------------------------------------
   3. Active Navigation & Mobile Nav
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const hashNavLinks = Array.from(navLinks).filter((link) => {
    const href = link.getAttribute('href');
    return href && href.startsWith('#');
  });

  if (!sections.length || !hashNavLinks.length) return;

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

  menuBtn.addEventListener('click', () => {
    const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', !isExpanded);
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* --------------------------------------------------------------------------
   Feature 5: Real-time Ankara Clock & Activity Simulator
   -------------------------------------------------------------------------- */
function initLiveTimeAndStatus() {
  const timeEl = document.getElementById('liveTimeText');
  const activityEl = document.getElementById('liveActivityText');

  if (!timeEl && !activityEl) return;

  function updateClock() {
    const now = new Date();
    // Use Turkey time (Europe/Istanbul)
    const options = { timeZone: 'Europe/Istanbul', hour: '2-digit', minute: '2-digit', hour12: false };
    const timeStr = new Intl.DateTimeFormat('tr-TR', options).format(now);
    
    // Get hours in Turkey
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
  setInterval(updateClock, 30000); // Check every 30 seconds
}

/* --------------------------------------------------------------------------
   Feature 1: Web Audio API Lofi / Chiptune Synthesizer
   -------------------------------------------------------------------------- */
let audioCtx = null;
let isAudioPlaying = false;
let lofiTimer = null;
let chordIndex = 0;

function initLofiSynthesizer() {
  const lofiWidget = document.getElementById('lofiWidget');
  const toggleBtn = document.getElementById('lofiToggleBtn');

  if (!lofiWidget || !toggleBtn) return;

  // Lofi Warm Chord Progression (Am7 -> Fmaj7 -> Cmaj7 -> G)
  const chordProgression = [
    [220.00, 261.63, 329.63, 392.00], // Am7 (A3, C4, E4, G4)
    [174.61, 220.00, 261.63, 329.63], // Fmaj7 (F3, A3, C4, E4)
    [130.81, 164.81, 196.00, 246.94], // Cmaj7 (C3, E3, G3, B3)
    [196.00, 246.94, 293.66, 392.00]  // G (G3, B3, D4, G4)
  ];

  const pentatonicMelody = [440.00, 493.88, 523.25, 659.25, 783.99, 880.00];

  function playChord(chord, duration = 1.9) {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;

    // Warm Lowpass Filter (Vintage tape simulator)
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(680, now);
    filter.Q.setValueAtTime(1.8, now);
    filter.connect(audioCtx.destination);

    // Chord voices
    chord.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Smooth attack & gentle tape decay
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.055, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(filter);

      osc.start(now);
      osc.stop(now + duration);
    });

    // Gentle random melody bell
    if (Math.random() > 0.35) {
      const bellOsc = audioCtx.createOscillator();
      const bellGain = audioCtx.createGain();
      const randomNote = pentatonicMelody[Math.floor(Math.random() * pentatonicMelody.length)];

      bellOsc.type = 'sine';
      bellOsc.frequency.setValueAtTime(randomNote, now + 0.25);

      bellGain.gain.setValueAtTime(0.001, now + 0.25);
      bellGain.gain.linearRampToValueAtTime(0.03, now + 0.28);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);

      bellOsc.connect(bellGain);
      bellGain.connect(filter);

      bellOsc.start(now + 0.25);
      bellOsc.stop(now + 1.15);
    }
  }

  function startLofi() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isAudioPlaying = true;
    lofiWidget.classList.add('playing');

    // Immediate first chord
    playChord(chordProgression[chordIndex]);
    chordIndex = (chordIndex + 1) % chordProgression.length;

    // Loop every 2 seconds
    lofiTimer = setInterval(() => {
      playChord(chordProgression[chordIndex]);
      chordIndex = (chordIndex + 1) % chordProgression.length;
    }, 2000);
  }

  function stopLofi() {
    isAudioPlaying = false;
    lofiWidget.classList.remove('playing');
    if (lofiTimer) clearInterval(lofiTimer);
  }

  toggleBtn.addEventListener('click', () => {
    if (isAudioPlaying) {
      stopLofi();
    } else {
      startLofi();
    }
  });

  // Export control for terminal command
  window.toggleLofiFromTerminal = function() {
    if (isAudioPlaying) {
      stopLofi();
      return 'Lofi Synthesizer durduruldu.';
    } else {
      startLofi();
      return 'Lofi Synthesizer başlatıldı! (Web Audio API calisiyor)';
    }
  };
}

/* --------------------------------------------------------------------------
   Feature 2: 2D Physics Gravity Playground (Unity Homage)
   -------------------------------------------------------------------------- */
function initPhysicsPlayground() {
  const overlay = document.getElementById('physicsOverlay');
  const closeBtn = document.getElementById('physicsCloseBtn');
  const spawnBtn = document.getElementById('physicsSpawnBtn');
  const canvas = document.getElementById('physicsCanvas');

  if (!overlay || !canvas) return;

  const triggerBtns = document.querySelectorAll('#gravityToggleBtn, .gravity-trigger, #skillsGravityBtn');

  const ctx = canvas.getContext('2d');
  let animationId = null;
  let bodies = [];
  let isRunning = false;
  let draggedBody = null;
  let dragOffset = { x: 0, y: 0 };
  let lastMouse = { x: 0, y: 0, time: 0 };
  let mouseVel = { x: 0, y: 0 };

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

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 60; // subtract hud
  }

  class PhysicsBox {
    constructor(x, y, text, color) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 8;
      this.vy = Math.random() * -4;
      this.text = text;
      this.color = color;
      
      // Calculate dimensions based on text length
      this.width = Math.max(80, text.length * 14 + 28);
      this.height = 42;
      this.radius = 8;
      this.restitution = 0.65; // bounciness
      this.friction = 0.985;
      this.gravity = 0.48;
    }

    update(width, height) {
      if (draggedBody === this) return;

      this.vy += this.gravity;
      this.vx *= this.friction;
      this.vy *= this.friction;

      this.x += this.vx;
      this.y += this.vy;

      // Floor bounce
      if (this.y + this.height > height) {
        this.y = height - this.height;
        this.vy = -this.vy * this.restitution;
        this.vx *= 0.95; // ground friction
      }

      // Left wall
      if (this.x < 0) {
        this.x = 0;
        this.vx = -this.vx * this.restitution;
      }

      // Right wall
      if (this.x + this.width > width) {
        this.x = width - this.width;
        this.vx = -this.vx * this.restitution;
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.fillStyle = '#161b22';
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2;

      // Draw rounded rectangle
      ctx.beginPath();
      ctx.roundRect(this.x, this.y, this.width, this.height, this.radius);
      ctx.fill();
      ctx.stroke();

      // Draw text
      ctx.fillStyle = '#f0f6fc';
      ctx.font = '600 14px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);

      ctx.restore();
    }

    contains(px, py) {
      return px >= this.x && px <= this.x + this.width && py >= this.y && py <= this.y + this.height;
    }
  }

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

  function spawnSingleBody() {
    const randomItem = tagsList[Math.floor(Math.random() * tagsList.length)];
    const x = Math.random() * (canvas.width - 120) + 40;
    bodies.push(new PhysicsBox(x, 20, randomItem.text, randomItem.color));
  }

  function loop() {
    if (!isRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < bodies.length; i++) {
      bodies[i].update(canvas.width, canvas.height);
      bodies[i].draw(ctx);
    }

    animationId = requestAnimationFrame(loop);
  }

  function openPhysics() {
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    resizeCanvas();
    spawnInitialBodies();
    isRunning = true;
    loop();
  }

  function closePhysics() {
    isRunning = false;
    if (animationId) cancelAnimationFrame(animationId);
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
  }

  // Mouse / Touch Interactions
  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  canvas.addEventListener('mousedown', onPointerDown);
  canvas.addEventListener('touchstart', onPointerDown, { passive: false });

  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('touchmove', onPointerMove, { passive: false });

  window.addEventListener('mouseup', onPointerUp);
  window.addEventListener('touchend', onPointerUp);

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

  function onPointerMove(e) {
    if (!draggedBody || !isRunning) return;
    if (e.touches) e.preventDefault();
    const pos = getPos(e);
    const now = performance.now();
    const dt = (now - lastMouse.time) || 16;

    mouseVel.x = ((pos.x - lastMouse.x) / dt) * 16;
    mouseVel.y = ((pos.y - lastMouse.y) / dt) * 16;

    lastMouse = { x: pos.x, y: pos.y, time: now };

    draggedBody.x = pos.x - dragOffset.x;
    draggedBody.y = pos.y - dragOffset.y;
  }

  function onPointerUp() {
    if (draggedBody) {
      draggedBody.vx = Math.max(-25, Math.min(25, mouseVel.x));
      draggedBody.vy = Math.max(-25, Math.min(25, mouseVel.y));
      draggedBody = null;
    }
  }

  triggerBtns.forEach((btn) => {
    btn.addEventListener('click', openPhysics);
  });
  closeBtn.addEventListener('click', closePhysics);
  spawnBtn.addEventListener('click', spawnSingleBody);

  window.addEventListener('resize', () => {
    if (isRunning) resizeCanvas();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isRunning) {
      closePhysics();
    }
  });

  // Export for terminal command
  window.launchPhysicsFromTerminal = function() {
    openPhysics();
    return '2D Gravity Fizik Motoru başlatıldı!';
  };
}

/* --------------------------------------------------------------------------
   Feature 4: Terminal CLI & Konami Code Easter Egg
   -------------------------------------------------------------------------- */
function initTerminalAndKonami() {
  const terminalModal = document.getElementById('terminalModal');
  const terminalInput = document.getElementById('terminalInput');
  const terminalOutput = document.getElementById('terminalOutput');
  const terminalCloseBtn = document.getElementById('terminalCloseBtn');
  const terminalBackdrop = document.getElementById('terminalBackdrop');
  const openTerminalBtn = document.getElementById('openTerminalBtn');

  if (!terminalModal || !terminalInput || !terminalOutput) return;

  const commandHistory = [];
  let historyIndex = -1;

  // Konami Code sequence
  const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiProgress = 0;

  document.addEventListener('keydown', (e) => {
    // Check Konami Code
    if (e.key === konamiPattern[konamiProgress]) {
      konamiProgress++;
      if (konamiProgress === konamiPattern.length) {
        konamiProgress = 0;
        openTerminal('🎉 KONAMI CODE KEŞFEDİLDİ! Gizli Terminal Arayüzü Aktif Edildi.\n');
      }
    } else {
      konamiProgress = (e.key === konamiPattern[0]) ? 1 : 0;
    }

    // Toggle with backtick (`) or tilde (~)
    if (e.key === '`' || e.key === '~') {
      e.preventDefault();
      if (terminalModal.classList.contains('open')) {
        closeTerminal();
      } else {
        openTerminal();
      }
    }

    // Close on Escape if terminal open
    if (e.key === 'Escape' && terminalModal.classList.contains('open')) {
      closeTerminal();
    }
  });

  function openTerminal(extraMessage = '') {
    terminalModal.classList.add('open');
    if (extraMessage) {
      appendLine(extraMessage, 'cmd-echo');
    }
    setTimeout(() => terminalInput.focus(), 80);
  }

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

  function appendLine(text, className = '') {
    const div = document.createElement('div');
    div.className = `terminal-output-line ${className}`;
    div.innerHTML = text;
    terminalOutput.appendChild(div);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  // Command Dispatcher
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
      if (historyIndex > 0) {
        historyIndex--;
        terminalInput.value = commandHistory[historyIndex] || '';
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        terminalInput.value = commandHistory[historyIndex] || '';
      } else {
        historyIndex = commandHistory.length;
        terminalInput.value = '';
      }
    }
  });

  function executeCommand(cmd) {
    switch (cmd) {
      case 'help':
        appendLine(`
Kullanılabilir Komutlar:
  <strong>about</strong>     - Baran Deniz Mutluoğlu profil detayları
  <strong>skills</strong>    - Uzmanlık alanları ve teknolojiler
  <strong>projects</strong>  - Öne çıkan projeler ve bağlantılar
  <strong>contact</strong>   - E-posta ve sosyal profil linkleri
  <strong>music</strong>     - Lofi Synthesizer müziğini aç / kapat
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
E-posta: 240208406@ostimteknik.edu.tr
GitHub:  https://github.com/2f7fjrk4sw-prog
Durum:   Staj ve ortak projelere açık.
        `, 'info');
        break;

      case 'music':
      case 'lofi':
        if (window.toggleLofiFromTerminal) {
          const res = window.toggleLofiFromTerminal();
          appendLine(res, 'cyan');
        } else {
          appendLine('Müzik motoru henüz yüklenmedi.', 'error');
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

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

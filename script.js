let currentDay = 0;
const totalDays = 9; // 0..8

const music = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');
const progressDots = document.getElementById('progressDots');
const exitOverlay = document.getElementById('exitOverlay');

/* Initialize floating background */
createFloating();

/* Build progress dots */
function buildProgressDots() {
  progressDots.innerHTML = "";   // ✅ Prevent duplication

  for (let i = 0; i < totalDays; i++) {
    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.dataset.day = i;
    dot.addEventListener('click', () => goToDay(i));
    progressDots.appendChild(dot);
  }

  updateDots();
}
buildProgressDots();

/* Update active dot */
function updateDots() {
  document.querySelectorAll('.dot').forEach((dot, idx) => {
    dot.classList.toggle('active', idx === currentDay);
  });
}

/* Page navigation */
function goToDay(day) {
  if (day < 0 || day >= totalDays || day === currentDay) return;

  const currentPage = document.getElementById(`day-${currentDay}`);
  const nextPage = document.getElementById(`day-${day}`);

  if (!currentPage || !nextPage) return; // ✅ Safety

  currentPage.classList.remove('active');
  currentDay = day;
  nextPage.classList.add('active');

  updateDots();

  /* ✅ Prevent scroll anchoring / viewport twitch */
  nextPage.scrollTo(0, 0);
}

/* Next / Prev */
function nextDay() {
  if (currentDay < totalDays - 1) {
    goToDay(currentDay + 1);
  }
}

function prevDay() {
  if (currentDay > 0) {
    goToDay(currentDay - 1);
  }
}

/* Enter experience */
function enterExperience() {
  nextDay();
  music.play().catch(() => {});
  musicBtn.innerText = '⏸';
}

/* Unlock memory */
function openMemory(button) {
  if (button.dataset.unlocked === 'true') return;

  const card = button.closest('.card');
  const content = card?.querySelector('.locked-content');

  if (!card || !content) return; // ✅ Safety

  /* Reveal smoothly */
  content.classList.add('revealed');

  button.dataset.unlocked = 'true';

  /* ✅ Fade text BEFORE swapping */
  button.classList.add("btn-fade");

  setTimeout(() => {
    button.innerText = 'Continue to Next Day →';
    button.classList.remove("btn-fade");
  }, 120);

  button.classList.remove('open-btn');
  button.classList.add('primary');

  button.onclick = () => nextDay();

  confettiBurst();
}

/* Music control */
function toggleMusic() {
  if (music.paused) {
    music.currentTime = 20;
    music.play();
    musicBtn.innerText = '⏸';
  } else {
    music.pause();
    musicBtn.innerText = '▶';
  }
}

/* Floating background */
function createFloating() {
  const bg = document.getElementById('floating-bg');
  bg.innerHTML = '';

  const shapes = ['heart', 'flower'];
  const counts = { heart: 25, flower: 25 };

  Object.entries(counts).forEach(([shape, count]) => {
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = shape;

      if (shape === 'heart') {
        const size = 14 + Math.floor(Math.random() * 20);
        el.style.width = size + 'px';
        el.style.height = size + 'px';
      } else {
        el.textContent = '💮';
        const size = 18 + Math.floor(Math.random() * 22);
        el.style.fontSize = size + 'px';
      }

      el.style.left = Math.random() * 100 + '%';

      const duration = 15 + Math.random() * 10;
      el.style.animationDuration = duration + 's';
      el.style.animationDelay = Math.random() * 8 + 's';

      if (shape === 'heart') {
        el.style.transform = `rotate(${Math.random() * 360}deg)`;
      }

      bg.appendChild(el);
    }
  });
}

/* Confetti */
function confettiBurst() {
  const colors = ['#FF6F91', '#FFB3C6', '#FF2E63', '#FF4D6D'];
  const types = ['circle', 'heart', 'flower'];

  for (let i = 0; i < 40; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const c = document.createElement('div');

    c.className = 'confetti';
    c.style.position = 'fixed';
    c.style.left = Math.random() * 100 + 'vw';
    c.style.top = '40vh';
    c.style.zIndex = '999';
    c.style.willChange = 'transform';

    const size = 8 + Math.floor(Math.random() * 16);
    const color = colors[Math.floor(Math.random() * colors.length)];

    if (type === 'circle') {
      c.style.background = color;
      c.style.width = size + 'px';
      c.style.height = size + 'px';
      c.style.borderRadius = '50%';
    } else if (type === 'heart') {
      c.textContent = '❤️';
      c.style.fontSize = size + 'px';
      c.style.color = color;
    } else {
      c.textContent = '💮';
      c.style.fontSize = size + 'px';
      c.style.color = color;
    }

    document.body.appendChild(c);

    const duration = 800 + Math.random() * 700;
    const rotation = Math.random() * 360;
    const xOffset = (Math.random() - 0.5) * 100;

    c.animate([
      { transform: `translate(0, 0) rotate(0deg) scale(1)`, opacity: 1 },
      { transform: `translate(${xOffset}px, 300px) rotate(${rotation}deg) scale(0.5)`, opacity: 0 }
    ], {
      duration: duration,
      easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      fill: 'forwards'
    });

    setTimeout(() => c.remove(), duration);
  }
}

/* WhatsApp */
function sendLove() {
  const phone = '918879528437';
  const message = encodeURIComponent('Hey… I just finished something that made me smile ❤️');
  window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
}

/* Exit */
function exitExperience() {
  exitOverlay.classList.remove('hidden');
}

/* Restart */
function restartExperience() {
  exitOverlay.classList.add('hidden');
  goToDay(0);

  document.querySelectorAll('.locked-content.revealed')
    .forEach(el => el.classList.remove('revealed'));

  document.querySelectorAll('.nav-btn')
    .forEach(btn => {
      if (btn.dataset.unlocked === 'true') {
        btn.innerText = 'Open Your Gift';
        btn.classList.remove('primary');
        btn.classList.add('open-btn');
        btn.onclick = function () { openMemory(this); };
        btn.dataset.unlocked = 'false';
      }
    });
}

/* Keyboard Nav */
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') nextDay();
  if (e.key === 'ArrowLeft') prevDay();
});

/* Pause music when tab hidden */
document.addEventListener('visibilitychange', () => {
  if (document.hidden) music.pause();
});

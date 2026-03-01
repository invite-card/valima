// --- 1. LOADER & MASTER TRIGGER ---
window.addEventListener('load', function () {
    // Set a timer for 3 seconds (3000 milliseconds)
    setTimeout(function () {
        const loader = document.getElementById('loader');

        // 1. Hide the loader
        loader.classList.add('hidden');

        // 2. START THE REST OF THE SITE NOW
        initWeddingSite();

    }, 2000);
});

// --- 2. MASTER INITIALIZATION FUNCTION ---
startCountdown();
// This holds all the logic that should run AFTER the loader is gone
function initWeddingSite() {

    const flowers = document.querySelectorAll('.corner-flower');
    flowers.forEach(flower => {
        flower.classList.add('start-bloom');
    });

    // A. Start Countdown

    // B. Start Petals
    startPetalEffect();

    // C. Start Text Animations (Roll & Wrap)
    rollEachCharacter();

    // Wrap specific names
    const nameEl1 = document.getElementById('name1');
    const nameEl2 = document.getElementById('name2');
    if (nameEl1) wrapLetters(nameEl1);
    if (nameEl2) wrapLetters(nameEl2);

    // D. Trigger CSS Animations for other elements
    document.querySelectorAll('.names, .fname, .ampersand')
        .forEach(el => el.classList.add('run-animation'));
}

const spans = document.querySelectorAll('.word span');

// 1. Wrap the timeout logic in a reusable function
function playAnimationSequence() {
    spans.forEach((span, idx) => {
        setTimeout(() => {
            span.classList.add('active');
        }, 750 * (idx + 1));
    });
}

spans.forEach((span, idx) => {
    span.addEventListener('click', (e) => {
        e.target.classList.add('active');
    });

    span.addEventListener('animationend', (e) => {
        e.target.classList.remove('active');

        // 2. CHECK: Is this the LAST letter?
        if (idx === spans.length - 1) {
            // If yes, the full wave is done. Restart from the beginning!
            playAnimationSequence();
        }
    });
});

// 3. Start the first sequence
playAnimationSequence();


// --- 3. COUNTDOWN LOGIC ---
function startCountdown() {
    const weddingDate = new Date("March 29, 2026 13:00:00").getTime();

    const x = setInterval(function () {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        // Fixed minutes calculation (it was missing in your snippet)
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const countdownElement = document.getElementById("countdown");
        if (!countdownElement) return; // Safety check

        if (distance < 0) {
            clearInterval(x);
            countdownElement.innerHTML = "We are married!";
        } else {
            // Added minutes to the display
            countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
    }, 1000);
}


// --- 4. PETAL EFFECT LOGIC ---
function startPetalEffect() {
    // Respect accessibility setting
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const container = document.getElementById('inner-petals-container');
    if (!container) return;

    const isMobile = window.innerWidth < 600;
    const spawnInterval = isMobile ? 1200 : 600;
    const minSize = isMobile ? 20 : 40;
    const sizeRange = isMobile ? 30 : 60;

    const petalImages = [
        './images/vecteezy_elegant-floral-composition-featuring-detailed-art-inspired_55531363.png',
        './images/vecteezy_ai-generated-watercolor-painting-of-rose_41321019.png',
        './images/vecteezy_fresh-leaves-in-outdoor-setting-highlighting-natural_47649585.png'
    ];

    let petalTimer;

    function createPetal() {
        const petal = document.createElement('img');
        petal.src = petalImages[Math.floor(Math.random() * petalImages.length)];
        petal.className = 'inner-petal';

        petal.style.left = (Math.random() * 70 + 10) + '%';
        petal.style.width = (Math.random() * sizeRange + minSize) + 'px';
        petal.style.animationDuration = (Math.random() * 5 + 5) + 's';

        container.appendChild(petal);
        petal.addEventListener('animationend', () => petal.remove());
    }

    function start() {
        if (!petalTimer) {
            petalTimer = setInterval(createPetal, spawnInterval);
        }
    }

    function stop() {
        clearInterval(petalTimer);
        petalTimer = null;
    }

    // Pause when tab hidden (huge battery win)
    document.addEventListener('visibilitychange', () => {
        document.hidden ? stop() : start();
    });

    start();
}


// --- 5. TEXT ANIMATION LOGIC (ROLLING) ---
function rollEachCharacter() {
    // Reset delay to 0 or small amount so it starts immediately after loader vanishes
    const initialDelay = 0.2;

    document.querySelectorAll('.roll-line').forEach((lineEl, lineIndex) => {
        const text = lineEl.dataset.text || lineEl.textContent;
        lineEl.innerHTML = '';

        [...text].forEach((char, charIndex) => {
            const span = document.createElement('span');

            if (char === ' ') {
                span.className = 'roll-text space';
                span.textContent = '\u00A0';
            } else {
                span.className = 'roll-text';
                span.textContent = char;
                span.style.animationDelay = `${(initialDelay + lineIndex * 0.2 + charIndex * 0.1).toFixed(2)}s`;
            }

            lineEl.appendChild(span);
        });
    });
}


// --- 6. WRAP LETTERS LOGIC ---
function wrapLetters(nameEl) {
    if (!nameEl) return;
    const text = nameEl.textContent;
    nameEl.textContent = ''; // clear original text

    text.split('').forEach((char, idx) => {
        const span = document.createElement('span');
        span.textContent = char;
        nameEl.appendChild(span);

        // Add staggered animation delay
        span.style.animationDelay = `${idx * 0.05}s`;
        span.classList.add('letter'); // class for animation
    });
}
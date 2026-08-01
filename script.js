document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    const nextBtns = document.querySelectorAll('.next-btn');
    let currentCardIndex = 0;

    // --- AUDIO LOGIC ---
    const bgMusic = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-btn');
    const startStoryBtn = document.getElementById('start-story-btn');

    // Browsers require a user interaction before audio can play
    startStoryBtn.addEventListener('click', () => {
        bgMusic.play().then(() => {
            musicBtn.classList.remove('hidden'); // Show toggle button once playing starts
        }).catch(e => console.log("Audio autoplay prevented by browser. Click toggle manually."));
    });

    musicBtn.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            musicBtn.textContent = '🔊';
        } else {
            bgMusic.pause();
            musicBtn.textContent = '🔇';
        }
    });


    // --- STAGGER LOGIC ---
    function triggerStagger(card) {
        const items = card.querySelectorAll('.stagger-item');
        items.forEach((item, index) => {
            item.classList.remove('visible');
            setTimeout(() => {
                item.classList.add('visible');
            }, 300 + (index * 200));
        });
    }

    // --- NAVIGATION LOGIC ---
    function goToNextCard() {
        if (currentCardIndex >= cards.length - 1) return;

        const currentCard = cards[currentCardIndex];
        currentCard.classList.remove('active');
        currentCard.classList.add('outgoing');

        currentCardIndex++;
        const nextCard = cards[currentCardIndex];
        nextCard.classList.remove('outgoing');
        nextCard.classList.add('active');

        // Trigger animations based on card
        if (nextCard.querySelector('.stagger-item')) {
            triggerStagger(nextCard);
        }

        if (currentCardIndex === 8) { // Screen 9 (index 8) - Outro
            startConfetti();
        }
    }

    nextBtns.forEach(btn => {
        btn.addEventListener('click', goToNextCard);
    });


    // --- SCREEN 3: MUSEUM LOGIC ---
    window.showExhibit = function (id) {
        document.querySelectorAll('.exhibit-info').forEach(info => info.classList.add('hidden'));
        document.getElementById(`exhibit-info-${id}`).classList.remove('hidden');
        document.getElementById('back-hallway-btn').classList.remove('hidden');
        const exhibits = document.querySelectorAll('.exhibit .tap-hint');
        exhibits[id - 1].textContent = '✓';
    };

    window.hideExhibits = function () {
        document.querySelectorAll('.exhibit-info').forEach(info => info.classList.add('hidden'));
        document.getElementById('back-hallway-btn').classList.add('hidden');
    };


    // --- SCREEN 4: DO NOT PRESS LOGIC ---
    const redBtn = document.getElementById('do-not-press-btn');
    const terminal = document.getElementById('diagnostic-terminal');
    const termLinesContainer = document.getElementById('terminal-lines');
    const termResult = document.getElementById('terminal-result');
    const seriouslyText = document.getElementById('seriously-text');

    const diagnosticLines = [
        "Checking loyalty... ✓ SUSPICIOUS",
        "Checking emotional damage... ✓ MUTUAL",
        "Checking stupid conversations... ✓ COUNT FAILED",
        "Checking embarrassing intel... ✓ CLASSIFIED"
    ];

    redBtn.addEventListener('click', () => {
        redBtn.classList.add('hidden');
        seriouslyText.classList.add('hidden');
        terminal.classList.remove('hidden');
        termLinesContainer.innerHTML = '';

        diagnosticLines.forEach((line, index) => {
            setTimeout(() => {
                const p = document.createElement('p');
                p.className = 'term-line';
                p.textContent = line;
                termLinesContainer.appendChild(p);
            }, index * 800);
        });

        setTimeout(() => {
            termResult.classList.remove('hidden');
        }, diagnosticLines.length * 800 + 500);
    });


    // --- SCREEN 6: SYSTEM POPUP LOGIC ---
    const cryBtn = document.getElementById('cry-btn');
    const systemPopup = document.getElementById('system-popup');

    cryBtn.addEventListener('click', () => {
        systemPopup.classList.remove('hidden');
    });


    // --- SCREEN 8: AGREEMENT CHECKBOX & STAMP LOGIC ---
    const checklistItems = document.querySelectorAll('.checklist li');
    const checks = document.querySelectorAll('.check');
    const acceptBtn = document.getElementById('accept-btn');
    const stamp = document.getElementById('renewal-stamp');

    checklistItems.forEach((li, index) => {
        li.addEventListener('click', () => {
            checks[index].classList.toggle('checked');
        });
    });

    acceptBtn.addEventListener('click', () => {
        checks.forEach(check => check.classList.add('checked'));

        acceptBtn.style.opacity = '0.5';
        acceptBtn.style.pointerEvents = 'none';
        stamp.classList.remove('hidden');

        setTimeout(() => {
            goToNextCard();
        }, 1500);
    });


    // --- SCREEN 9: CONFETTI LOGIC ---
    let confettiAnimationId;
    function startConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const particles = [];
        const colors = ['#FF9AA2', '#FBEA92', '#FFDDE1', '#FF8C42', '#ffffff'];

        for (let i = 0; i < 80; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                w: Math.random() * 8 + 4,
                h: Math.random() * 8 + 4,
                c: colors[Math.floor(Math.random() * colors.length)],
                s: Math.random() * 4 + 2,
                r: Math.random() * 360,
                rs: (Math.random() - 0.5) * 5
            });
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.y += p.s;
                p.r += p.rs;
                if (p.y > canvas.height) {
                    p.y = -10;
                    p.x = Math.random() * canvas.width;
                }
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.r * Math.PI / 180);
                ctx.fillStyle = p.c;
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                ctx.restore();
            });
            confettiAnimationId = requestAnimationFrame(draw);
        }

        if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);
        draw();
    }

    // Initialize first card
    triggerStagger(cards[0]);
});
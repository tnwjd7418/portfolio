document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const element = entry.target;
            if (entry.isIntersecting) {
                animateTicker(element);
            } else {
                resetTicker(element);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.count-up').forEach(el => {
        const targetValue = el.getAttribute('data-target');
        setupTicker(el, targetValue);
        observer.observe(el);
    });

    function setupTicker(element, targetValue) {
        element.innerHTML = '';
        element.classList.add('ticker-view');

        const digits = targetValue.split('');

        digits.forEach((digit) => {
            const column = document.createElement('div');

            if (isNaN(parseInt(digit))) {
                // Static column for non-digits
                column.className = 'ticker-static';
                column.innerHTML = `<div class="ticker-digit">${digit}</div>`;
            } else {
                column.className = 'ticker-column';
                const targetDigit = parseInt(digit);
                const loops = 2;
                let content = '';

                for (let l = 0; l < loops; l++) {
                    for (let i = 0; i <= 9; i++) {
                        content += `<div class="ticker-digit">${i}</div>`;
                    }
                }

                for (let i = 0; i <= targetDigit; i++) {
                    content += `<div class="ticker-digit">${i}</div>`;
                }

                column.innerHTML = content;
            }
            element.appendChild(column);
        });
    }

    function animateTicker(element) {
        const columns = element.querySelectorAll('.ticker-column');
        columns.forEach((col, index) => {
            const digitHeight = 28;
            const totalDigits = col.children.length;
            const finalPosition = (totalDigits - 1) * digitHeight;

            setTimeout(() => {
                col.style.transition = 'transform 1.5s cubic-bezier(0.12, 0.8, 0.32, 1)'; // Smooth ease-out
                col.style.transform = `translateY(-${finalPosition}px)`;
            }, index * 60);
        });
    }

    function resetTicker(element) {
        const columns = element.querySelectorAll('.ticker-column');
        columns.forEach((col) => {
            col.style.transition = 'none'; // Instant reset
            col.style.transform = 'translateY(0)';
        });
    }

    // Speech Bubble Observer
    const bubbleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            } else {
                entry.target.classList.remove('animate');
            }
        });
    }, { threshold: 0.5 }); // Trigger when 50% visible

    const bubbles = document.querySelectorAll('.speech-bubble');
    bubbles.forEach(bubble => {
        bubbleObserver.observe(bubble);
    });
    // Insights Slider Logic
    const track = document.getElementById('insight-track');
    const prevBtn = document.getElementById('insight-prev');
    const nextBtn = document.getElementById('insight-next');
    const items = document.querySelectorAll('.insight-item');

    let currentSlide = 0;
    const slideCount = items.length;

    function upgradeSlider() {
        const slideWidth = 1400; // Increased to match new CSS width with gap
        track.style.transform = `translateX(-${currentSlide * slideWidth}px)`;

        // Update buttons
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === slideCount - 1;


        // Re-trigger counter animations for the new slide
        const activeSlide = items[currentSlide];
        activeSlide.querySelectorAll('.count-up').forEach(el => {
            animateTicker(el);
        });

        // Background toggle for Insight Emphasis slides (1-3, 2-2, 3-3, 4-2)
        const insightsSection = document.querySelector('.insights');
        if (insightsSection) {
            // Slide indices: 0(News), 1(News1-2), 2(News1-3), 3(Webtoon2), 4(Webtoon2-2), 5(Shopping3), 6(Shopping3-2), 7(Shopping3-3), 8(Reward4), 9(Reward4-2)
            if (currentSlide === 2 || currentSlide === 4 || currentSlide === 7 || currentSlide === 9) {
                insightsSection.classList.add('special-news');
            } else {
                insightsSection.classList.remove('special-news');
            }
        }
    }

    if (prevBtn && nextBtn && track) {
        prevBtn.addEventListener('click', () => {
            if (currentSlide > 0) {
                currentSlide--;
                upgradeSlider();
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentSlide < slideCount - 1) {
                currentSlide++;
                upgradeSlider();
            }
        });
    }

    // Survey Section Animation Observer
    const surveyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            } else {
                // Remove class when exiting to allow replay on re-entry
                entry.target.classList.remove('animate');
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.ordi-survey-section, .ordi-survey-section-3col, .ordi-pillared-section, .ordi-insight-summary-section').forEach(section => {
        surveyObserver.observe(section);
    });

    // Strategy Cards Fade-in Observer
    const strategyFadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.strategy-fade, .footer-fade').forEach(card => {
        strategyFadeObserver.observe(card);
    });
});
// ORDI Scrollytelling Clip-Path Sync
const initOrdiSync = () => {
    const ordiImage = document.querySelector('.ordi-image-placeholder');
    const ordiTitleFg = document.querySelector('.title-layer-fg');

    if (ordiImage && ordiTitleFg) {
        const syncClipPath = () => {
            const imgRect = ordiImage.getBoundingClientRect();
            const titleRect = ordiTitleFg.getBoundingClientRect();

            // The user requested the white text to ONLY exist in the bottom 525.8213px of the image!
            const clipTopY = imgRect.bottom - 525.8213;

            const topInset = Math.max(0, clipTopY - titleRect.top);
            const rightInset = Math.max(0, titleRect.right - imgRect.right);
            const bottomInset = Math.max(0, titleRect.bottom - imgRect.bottom);
            const leftInset = Math.max(0, imgRect.left - titleRect.left);

            if (clipTopY >= titleRect.bottom || imgRect.bottom <= titleRect.top) {
                ordiTitleFg.style.clipPath = `inset(100%)`;
            } else {
                const clipValue = `inset(${topInset}px ${rightInset}px ${bottomInset}px ${leftInset}px round 40px)`;
                ordiTitleFg.style.clipPath = clipValue;
            }
        };

        window.addEventListener('scroll', syncClipPath, { passive: true });
        window.addEventListener('resize', syncClipPath);

        // Initial triggers
        syncClipPath();
        setTimeout(syncClipPath, 100);
        setTimeout(syncClipPath, 500);
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOrdiSync);
} else {
    initOrdiSync();
}

// Image Gallery Slider Logic
document.addEventListener('DOMContentLoaded', () => {
    const galleryTrack = document.querySelector('.gallery-track');
    if (galleryTrack) {
        const galleryPrev = document.querySelector('.gallery-prev');
        const galleryNext = document.querySelector('.gallery-next');
        const galleryImages = document.querySelectorAll('.gallery-img');
        let currentGalleryIndex = 0;

        function updateGallerySlider() {
            galleryTrack.style.transform = `translateX(-${currentGalleryIndex * 100}%)`;
        }

        if (galleryPrev && galleryNext) {
            galleryNext.addEventListener('click', () => {
                currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
                updateGallerySlider();
            });

            galleryPrev.addEventListener('click', () => {
                currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
                updateGallerySlider();
            });
        }
    }
});

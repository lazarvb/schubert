document.addEventListener('DOMContentLoaded', () => {
    // --- Menu déroulant au survol ---
    const menuBtn = document.querySelector('.menu-btn');
    const dropMenu = document.getElementById('menu-dropdown');

    const showMenu = () => dropMenu.classList.add('show');
    const hideMenu = () => {
        setTimeout(() => {
            if (!menuBtn.matches(':hover') && !dropMenu.matches(':hover')) {
                dropMenu.classList.remove('show');
            }
        }, 100);
    };

    [menuBtn, dropMenu].forEach((el) => {
        el.addEventListener('mouseenter', showMenu);
        el.addEventListener('mouseleave', hideMenu);
    });

    // --- Changement d'image devant chaque lien ---
    const menuLinks = dropMenu.querySelectorAll('a');

    menuLinks.forEach((link) => {
        const img = link.querySelector('img');
        const originalSrc = img.src;
        const hoverSrc = link.dataset.hover; // assure-toi d'avoir data-hover dans le HTML

        link.addEventListener('mouseenter', () => {
            img.src = hoverSrc;
        });

        link.addEventListener('mouseleave', () => {
            img.src = originalSrc;
        });
    });

    // --- Affichage du bouton "Upload & Process" seulement quand un fichier est choisi ---
    const fileInput = document.getElementById('file');
    const submitBtn = document.getElementById('submit-btn');

    if (fileInput && submitBtn) {
        submitBtn.style.display = 'none'; // caché au départ

        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                submitBtn.style.display = 'inline-block';
            } else {
                submitBtn.style.display = 'none';
            }
        });
    }

    // Enregistre les plugins GSAP
    gsap.registerPlugin(SplitText, ScrambleTextPlugin);

    const root = document.querySelector('#scrambled');
    if (!root) return;

    // Séparation du texte en caractères
    const split = new SplitText(root.querySelector('p'), {
        type: 'chars',
        charsClass: 'char',
    });
    const chars = split.chars;

    const radius = 100; // distance autour du curseur
    const duration = 1.2; // durée de l’effet
    const speed = 0.5; // vitesse de scrambling
    const scrambleChars = '.:'; // caractères utilisés pour brouiller

    // Sauvegarde du contenu d’origine
    chars.forEach((c) => {
        gsap.set(c, {
            display: 'inline-block',
            attr: { 'data-content': c.innerHTML },
        });
    });

    // Fonction appelée quand la souris bouge
    const handleMove = (e) => {
        chars.forEach((c) => {
            const rect = c.getBoundingClientRect();
            const dx = e.clientX - (rect.left + rect.width / 2);
            const dy = e.clientY - (rect.top + rect.height / 2);
            const dist = Math.hypot(dx, dy);

            if (dist < radius) {
                gsap.to(c, {
                    overwrite: true,
                    duration: duration * (1 - dist / radius),
                    scrambleText: {
                        text: c.dataset.content || '',
                        chars: scrambleChars,
                        speed,
                    },
                    ease: 'none',
                });
            }
        });
    };

    root.addEventListener('pointermove', handleMove);
});

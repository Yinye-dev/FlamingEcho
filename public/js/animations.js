// public/js/animations.js

document.addEventListener('DOMContentLoaded', function() {

    const siteHeader = document.querySelector('header');
    if (!siteHeader) return; // Exit if there's no header

    // ---===============================================---
    // --- 1. UNLOCK HEADER AFTER HOMEPAGE ANIMATION ---
    // ---===============================================---
    // This code only runs if the body has the class "home"
    if (document.body.classList.contains('home')) {
        // Listen for the 'animationend' event on the header
        siteHeader.addEventListener('animationend', () => {
            // Once the slideDown animation finishes, remove the animation property.
            // This "unlocks" the transform property so the scroll transition can work.
            siteHeader.style.animation = 'none';
        }, { once: true }); // { once: true } makes the listener remove itself after it runs.
    }

    // ---===================================---
    // --- 2. SITE-WIDE AUTO-HIDING HEADER ON SCROLL ---
    // ---===================================---
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        if (lastScrollY < window.scrollY && window.scrollY > 150) {
            siteHeader.classList.add('header-hidden');
        } else {
            siteHeader.classList.remove('header-hidden');
        }
        lastScrollY = window.scrollY;
    });

     // ---===================================---
    // --- 4. MOBILE MENU TOGGLE ---
    // ---===================================---
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            // The 'show' class is what makes the menu visible
            navMenu.classList.toggle('show');
        });
    }

    // ---===========================================---
    // --- 3. FADE-IN ANIMATION FOR STORY CARDS (Stories Page ONLY) ---
    // ---===========================================---
    if (document.body.classList.contains('stories')) {
        const storyCards = document.querySelectorAll('.story-card');
        if (storyCards.length > 0) {
            storyCards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            });
            const cardObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        cardObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            storyCards.forEach(card => cardObserver.observe(card));
        }
    }

    // ---===================================================---
    // --- 4. POST PAGE STICKY/SHRINKING TITLE (Post Page ONLY) ---
    // ---===================================================---
    if (document.body.classList.contains('post')) {
        const postHeader = document.querySelector('.post-header');
        if (postHeader) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > postHeader.offsetTop) {
                    postHeader.classList.add('scrolled');
                } else {
                    postHeader.classList.remove('scrolled');
                }
            });
        }
    }

}); // End of DOMContentLoaded
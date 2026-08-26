/***************************************************
    Good Apples — Website 2.0
    01. Preloader
    02. Smooth scroll (ScrollSmoother)
    03. Fade-in animation
    04. Hero hover / active state
    05. Magic cursor
    06. Back to top
****************************************************/

(function () {
    "use strict";

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    /*----------------------------------------*/
    /*  01. Preloader
    /*----------------------------------------*/
    const countText = document.querySelector(".loader__count .count__text");
    const countBdr = document.querySelector(".loader__wrapper > .count__bdr");

    function startLoader() {
        let t = 0;
        (function updateCount() {
            if (t < 100) {
                const increment = Math.floor(Math.random() * 10) + 1;
                t = Math.min(t + increment, 100);
                countText.textContent = t;
                countBdr.style.width = t + "%";
                setTimeout(updateCount, Math.floor(Math.random() * 120) + 25);
            } else {
                hideLoader();
            }
        })();
    }

    function hideLoader() {
        gsap.to(".loader__count", { duration: 0.8, ease: "power2.in", y: "100%", delay: 0.5 });
        gsap.to(".loader__wrapper", { duration: 0.8, ease: "power4.in", y: "-100%", delay: 0.7 });
        setTimeout(function () {
            document.getElementById("loader").classList.add("loaded");
        }, 1600);
    }

    function imagesReady() {
        // Lazy images below the fold never start loading, so waiting on them
        // would hang the loader forever. Only the eager ones gate the reveal.
        const imgs = Array.from(document.images).filter(function (img) {
            return img.loading !== "lazy";
        });
        return Promise.all(imgs.map(function (img) {
            if (img.complete) return Promise.resolve();
            return new Promise(function (res) {
                img.addEventListener("load", res, { once: true });
                img.addEventListener("error", res, { once: true });
            });
        }));
    }

    if (countText && countBdr) {
        imagesReady().then(startLoader);
    }

    /*----------------------------------------*/
    /*  02. Smooth scroll
    /*----------------------------------------*/
    if (document.querySelector("#smooth-wrapper") && document.querySelector("#smooth-content")) {
        ScrollSmoother.create({
            smooth: 1.35,
            effects: true,
            smoothTouch: 0.15,
            ignoreMobileResize: true
        });
    }

    /*----------------------------------------*/
    /*  03. Fade-in animation
    /*----------------------------------------*/
    gsap.utils.toArray(".px-fade-anim").forEach(function (item) {
        const offset = item.getAttribute("data-fade-offset") || 40,
            duration = item.getAttribute("data-duration") || 0.75,
            direction = item.getAttribute("data-fade-from") || "bottom",
            onScroll = item.getAttribute("data-on-scroll") || 1,
            delay = item.getAttribute("data-delay") || 0.15,
            ease = item.getAttribute("data-ease") || "power2.out",
            settings = {
                opacity: 0,
                ease: ease,
                duration: duration,
                delay: delay,
                x: (direction === "left" ? -offset : (direction === "right" ? offset : 0)),
                y: (direction === "top" ? -offset : (direction === "bottom" ? offset : 0))
            };

        if (onScroll == 1) {
            settings.scrollTrigger = { trigger: item, start: "top 85%" };
        }

        gsap.from(item, settings);
    });

    /*----------------------------------------*/
    /*  04. Hero hover / active state
    /*----------------------------------------*/
    document.querySelectorAll(".px-hero-2-thumb").forEach(function (thumb) {
        thumb.addEventListener("mouseenter", function () {
            const parent = thumb.closest(".px-hero-2-item");
            document.querySelectorAll(".px-hero-2-item").forEach(function (item) {
                item.classList.remove("active");
            });
            if (parent) parent.classList.add("active");
        });
    });

    /*----------------------------------------*/
    /*  04b. Hero slider (tablet / mobile)
    /*----------------------------------------*/
    if (typeof Swiper !== "undefined" && document.querySelector(".gallery-thumbs")) {
        const thumbs = new Swiper(".gallery-thumbs", {
            slidesPerView: 3,
            spaceBetween: 10,
            centeredSlides: true,
            slideToClickedSlide: true,
            loop: true,
            autoplay: { delay: 3000, disableOnInteraction: false }
        });

        const slider = new Swiper(".px-hero-2-top-active", {
            slidesPerView: 1,
            centeredSlides: true,
            loop: true,
            allowTouchMove: false
        });

        thumbs.on("slideChange", function () {
            slider.slideToLoop(thumbs.realIndex);
        });
    }

    /*----------------------------------------*/
    /*  04c. Full bleed banner — GIF-style frame cycle
    /*----------------------------------------*/
    (function bannerFlipbook() {
        const FRAME_MS = 175;

        const wrap = document.querySelector(".ga-banner-frames");
        if (!wrap) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const frames = Array.from(wrap.querySelectorAll(".ga-banner-frame"));
        if (frames.length < 2) return;

        let index = 0;
        let timer = null;

        function step() {
            frames[index].classList.remove("is-active");
            index = (index + 1) % frames.length;
            frames[index].classList.add("is-active");
        }

        function start() {
            if (timer === null) timer = setInterval(step, FRAME_MS);
        }

        function stop() {
            if (timer !== null) {
                clearInterval(timer);
                timer = null;
            }
        }

        // Hold until every frame has decoded, otherwise the first pass through
        // the loop stutters while the later images are still downloading
        Promise.all(frames.map(function (img) {
            if (img.complete) return Promise.resolve();
            return new Promise(function (res) {
                img.addEventListener("load", res, { once: true });
                img.addEventListener("error", res, { once: true });
                // never let a stalled frame hold the whole cycle hostage
                setTimeout(res, 8000);
            });
        })).then(function () {
            // only run while the band is actually on screen
            if ("IntersectionObserver" in window) {
                new IntersectionObserver(function (entries) {
                    entries[0].isIntersecting ? start() : stop();
                }, { rootMargin: "200px 0px" }).observe(wrap);
            } else {
                start();
            }
        });

        document.addEventListener("visibilitychange", function () {
            if (document.hidden) stop();
        });
    })();

    /*----------------------------------------*/
    /*  05. Magic cursor
    /*----------------------------------------*/
    (function magicCursor() {
        if (!document.body.classList.contains("tp-magic-cursor")) return;

        const ball = document.getElementById("ball");
        if (!ball) return;

        const mouse = { x: 0, y: 0 };
        const pos = { x: 0, y: 0 };
        const ratio = 0.15;
        let active = false;

        const ballWidth = 14;
        const ballHeight = 14;
        const ballScale = 1;
        const ballOpacity = 1;
        const ballBorderWidth = 1;

        gsap.set(ball, {
            xPercent: -50,
            yPercent: -50,
            width: ballWidth,
            height: ballHeight,
            borderWidth: ballBorderWidth,
            opacity: ballOpacity
        });

        document.addEventListener("mousemove", function (e) {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        gsap.ticker.add(function () {
            if (active) return;
            pos.x += (mouse.x - pos.x) * ratio;
            pos.y += (mouse.y - pos.y) * ratio;
            gsap.set(ball, { x: pos.x, y: pos.y });
        });

        // Hide on hover over links and buttons
        document.querySelectorAll("a, button").forEach(function (el) {
            if (el.classList.contains("cursor-hide")) return;
            el.addEventListener("mouseenter", function () {
                gsap.to(ball, { duration: 0.3, scale: 0, opacity: 0 });
            });
            el.addEventListener("mouseleave", function () {
                gsap.to(ball, { duration: 0.3, scale: ballScale, opacity: ballOpacity });
            });
        });

        document.addEventListener("mouseleave", function () {
            gsap.to("#magic-cursor", { duration: 0.3, autoAlpha: 0 });
        });

        document.addEventListener("mouseenter", function () {
            gsap.to("#magic-cursor", { duration: 0.3, autoAlpha: 1 });
        });

        document.addEventListener("mousemove", function () {
            gsap.to("#magic-cursor", { duration: 0.3, autoAlpha: 1 });
        });
    })();

    /*----------------------------------------*/
    /*  06. Back to top
    /*----------------------------------------*/
    const backToTopWrapper = document.querySelector(".back-to-top-wrapper");
    const backToTopBtn = document.getElementById("back_to_top");

    if (backToTopWrapper && backToTopBtn) {
        ScrollTrigger.create({
            start: "top -200",
            end: 99999,
            onUpdate: function (self) {
                backToTopWrapper.classList.toggle("back-to-top-btn-show", self.scroll() > 200);
            }
        });

        backToTopBtn.addEventListener("click", function () {
            const smoother = ScrollSmoother.get();
            if (smoother) smoother.scrollTo(0, true);
            else window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

})();

/***************************************************
    Good Apples Website 2.0
    01. Preloader
    02. Smooth scroll (ScrollSmoother)
    03. Fade-in animation
    04. Hero hover / active state
    05. Magic cursor
    06. Back to top
    07. Header reveal
    08. Menu
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
        // Only the first-impression images gate the reveal: the hero grid and
        // the banner frames. Gating on every image on the page would make the
        // loader hang around while things far below the fold download.
        const imgs = Array.from(document.querySelectorAll(
            ".px-hero-2-thumb img, .px-hero-2-thumbs img, .ga-banner-frame"
        ));
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
    /*  02. Smooth scroll (pointer devices only)
    /*----------------------------------------*/
    // ScrollSmoother drives scrolling with a CSS transform on #smooth-content.
    // On touch devices that fights the platform's own scrolling and leaves
    // anything position-dependent (lazy loading, scroll triggers) reading
    // stale geometry, so phones and tablets get native scrolling instead.
    const useSmoother = window.matchMedia("(min-width: 1200px) and (pointer: fine)").matches;

    if (useSmoother && document.querySelector("#smooth-wrapper") && document.querySelector("#smooth-content")) {
        ScrollSmoother.create({
            smooth: 1.35,
            effects: true,
            ignoreMobileResize: true
        });
    }

    /*----------------------------------------*/
    /*  03. Fade-in animation
    /*----------------------------------------*/
    // The reveal is a plain CSS transition toggled by a class, not a GSAP
    // tween. GSAP runs on requestAnimationFrame, so a throttled frame loop
    // (backgrounded tab, low power mode) can leave an element stuck at
    // opacity 0 with no way back. A CSS transition cannot fail that way.
    //
    // The hidden state also only applies once JS has marked the document, so
    // if any of this breaks the page simply renders fully visible.
    (function fadeIns() {
        // Tells the inline head failsafe that a current main.js is in charge,
        // so it leaves the hidden state alone.
        window.gaFadesReady = true;

        let pending = Array.prototype.slice.call(document.querySelectorAll(".px-fade-anim"));
        if (!pending.length) return;

        function showAllNow() {
            document.documentElement.classList.remove("ga-fades");
            pending = [];
            window.removeEventListener("scroll", sweep);
            window.removeEventListener("resize", sweep);
            if (window.gsap && gsap.ticker) gsap.ticker.remove(sweep);
        }

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            showAllNow();
            return;
        }

        pending.forEach(function (item) {
            const delay = parseFloat(item.getAttribute("data-delay"));
            if (delay) item.style.transitionDelay = delay + "s";
        });

        function sweep() {
            if (!pending.length) return;
            const fold = window.innerHeight * 0.92;
            pending = pending.filter(function (item) {
                // top < fold catches both "just entered" and "already scrolled
                // past", so a fast flick cannot skip anything
                if (item.getBoundingClientRect().top < fold) {
                    item.classList.add("is-in");
                    return false;
                }
                return true;
            });
            if (!pending.length) {
                window.removeEventListener("scroll", sweep);
                window.removeEventListener("resize", sweep);
                if (window.gsap && gsap.ticker) gsap.ticker.remove(sweep);
            }
        }

        // Two drivers, because neither covers both cases on its own.
        // ScrollSmoother hijacks scrolling and drives it from GSAP's ticker, so
        // the window fires no scroll events while it is running and a
        // scroll-only sweep would stall after the first screen. The ticker
        // covers that; the scroll listener covers phones, where the smoother is
        // off. Both call the same idempotent sweep and both detach once the
        // pending list is empty, so nothing runs for the rest of the visit.
        window.addEventListener("scroll", sweep, { passive: true });
        window.addEventListener("resize", sweep);
        if (window.gsap && gsap.ticker) gsap.ticker.add(sweep);
        sweep();

        window.addEventListener("load", function () {
            sweep();
            setTimeout(sweep, 300);
        });

        // Hard backstop. Whatever happens, nothing stays invisible: if anything
        // is still waiting well after load, drop the hidden state altogether.
        setTimeout(function () {
            if (pending.length) {
                const fold = window.innerHeight;
                const offscreen = pending.filter(function (item) {
                    return item.getBoundingClientRect().top >= fold;
                });
                if (offscreen.length !== pending.length) showAllNow();
            }
        }, 6000);
    })();

    // Fonts and images settling after first paint shift the layout, which
    // leaves every ScrollTrigger pointing at a stale scroll position.
    window.addEventListener("load", function () {
        ScrollTrigger.refresh();
    });

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () {
            ScrollTrigger.refresh();
        });
    }

    // Without the smoother the banner gets no data-speed parallax, which is
    // fine: its frame box is taller than the band at every breakpoint, so it
    // still fills correctly, just without the drift.

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
    /*  04c. Full bleed banner, GIF-style frame cycle
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
    /*  04d. Banner parallax without the smoother
    /*----------------------------------------*/
    // ScrollSmoother's data-speed only exists where the smoother runs, which is
    // pointer devices. Everywhere else the band would sit flat, so the drift is
    // done here instead. It stays inside the frame box's overhang, so the band
    // is always covered no matter where the drift sits.
    if (!useSmoother) {
        (function bannerDrift() {
            const band = document.querySelector(".ga-banner-img");
            const frames = document.querySelector(".ga-banner-frames");
            if (!band || !frames) return;

            function update() {
                const r = band.getBoundingClientRect();
                if (r.bottom < -100 || r.top > window.innerHeight + 100) return;
                const slack = (frames.offsetHeight - band.offsetHeight) / 2;
                if (slack <= 0) return;
                // -1 once the band has passed above, +1 while still below
                const progress = ((r.top + r.height / 2) - window.innerHeight / 2) /
                    ((window.innerHeight + r.height) / 2);
                const clamped = Math.max(-1, Math.min(1, progress));
                frames.style.transform = "translate3d(0," + (-clamped * slack).toFixed(1) + "px,0)";
            }

            window.addEventListener("scroll", update, { passive: true });
            window.addEventListener("resize", update);
            window.addEventListener("load", update);
            update();
        })();
    }

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

    /*----------------------------------------*/
    /*  07. Header reveal
    /*----------------------------------------*/
    (function headerReveal() {
        const header = document.querySelector(".px-header-2-area.header-fixed");
        if (!header) return;

        // The header floats over the page with no background of its own. On a
        // tall window that reads fine, because the hero fills the first screen
        // and the wordmark sits on empty space. On a short laptop window you
        // scroll straight into dense content and the wordmark lands on top of
        // the section titles. So: transparent while still at the top, then it
        // gets out of the way on the way down and comes back on its own
        // background on the way up.
        // Driven by ScrollTrigger rather than a window scroll listener, so it
        // behaves the same with ScrollSmoother running and without it.
        ScrollTrigger.create({
            start: 1,
            end: 99999,
            onUpdate: function (self) {
                if (self.scroll() < 60) {
                    header.classList.remove("is-stuck", "is-hidden");
                    return;
                }
                header.classList.add("is-stuck");
                header.classList.toggle("is-hidden", self.direction === 1);
            }
        });
    })();

    /*----------------------------------------*/
    /*  08. Menu
    /*----------------------------------------*/
    (function menu() {
        const btn = document.getElementById("hamburger-open-btn");
        const panel = document.getElementById("ga_menu");
        const header = document.querySelector(".px-header-2-area.header-fixed");
        if (!btn || !panel) return;

        let open = false;

        function setOpen(next) {
            if (next === open) return;
            open = next;

            panel.classList.toggle("is-open", open);
            panel.setAttribute("aria-hidden", open ? "false" : "true");
            btn.classList.toggle("active", open);
            btn.setAttribute("aria-expanded", open ? "true" : "false");
            if (header) header.classList.toggle("menu-open", open);

            // Freeze the page underneath. With ScrollSmoother running the body
            // does not scroll at all, so pausing the smoother is what actually
            // stops it; without it, the body does, so lock that instead.
            const smoother = window.ScrollSmoother && ScrollSmoother.get();
            if (smoother) smoother.paused(open);
            else document.body.style.overflow = open ? "hidden" : "";
        }

        btn.setAttribute("aria-expanded", "false");
        btn.setAttribute("aria-controls", "ga_menu");

        btn.addEventListener("click", function () {
            setOpen(!open);
        });

        // Closing on link click matters for the in-page anchors, where nothing
        // navigates and the panel would otherwise stay over the section.
        panel.addEventListener("click", function (e) {
            if (e.target.closest("a")) setOpen(false);
        });

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && open) {
                setOpen(false);
                btn.focus();
            }
        });
    })();

})();

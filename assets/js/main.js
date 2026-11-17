/***************************************************
    Good Apples Website 2.0
    01. Preloader
    02. Smooth scroll (ScrollSmoother)
    03. Fade-in animation
    04. Hero flipbook
    05. Hero parallax without the smoother
    06. Magic cursor
    07. Back to top
    08. Header reveal
    09. Menu
    10. Hero rotator
    11. Wordmark dock
    12. Project gallery video
****************************************************/

(function () {
    "use strict";

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    /*----------------------------------------*/
    /*  01. Preloader
    /*----------------------------------------*/
    // Joey, 18 Nov: "an apple being bitten into until its gone, then a smooth
    // way into the main page". Bites come off both sides until only the core
    // is left, the core drops away, and the black opens out from where the
    // apple was. The bites are the progress: the last one waits until the
    // hero can actually show. Everything else on the page keys off the
    // loader's `loaded` class (the wordmark dock waits for it).
    // Then: "use an actual real etched apple" (deep-etched, i.e. cut out: the
    // photo from the current site), and give each bite "some impactful subtle
    // shake, zoom, and alternate rotations" with "very subtle crumbs".
    (function splash() {
        const loader = document.getElementById("loader");
        if (!loader) return;
        const wrapper = loader.querySelector(".loader__wrapper");
        const svg = loader.querySelector(".ga-apple");
        const maskSkin = loader.querySelector("#ga_bites");
        const maskFlesh = loader.querySelector("#ga_bites_flesh");
        const crumbs = loader.querySelector(".ga-crumbs");
        const photo = loader.querySelector(".ga-apple-photo");
        const NS = "http://www.w3.org/2000/svg";
        let finished = false;

        function done() {
            if (finished) return;
            finished = true;
            loader.classList.add("loaded");
            try { sessionStorage.setItem("ga-splash-seen", "1"); } catch (e) { /* private mode */ }
        }

        // Never leave anyone on a black screen, whatever happens below.
        setTimeout(done, 10000);

        if (!wrapper || !svg || !maskSkin || !maskFlesh || !window.gsap) { done(); return; }

        // Only the hero's first frame and the wordmark font gate the exit.
        // The flipbook already holds on frame one until the rest decode, and
        // waiting on all 16 frames (3.5 MB) kept phones on the splash for ages.
        function heroReady() {
            const first = document.querySelector(".ga-banner-frame");
            const img = new Promise(function (res) {
                if (!first || first.complete) return res();
                first.addEventListener("load", res, { once: true });
                first.addEventListener("error", res, { once: true });
            });
            const fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
            const cap = new Promise(function (res) { setTimeout(res, 6000); });
            return Promise.race([Promise.all([img, fonts]), cap]);
        }

        // The apple photo itself (83 KB, preloaded in the head) has to be in
        // before the first bite, or the bites would land on nothing.
        function appleReady() {
            const src = photo && (photo.getAttribute("href") || photo.getAttributeNS("http://www.w3.org/1999/xlink", "href"));
            if (!src) return Promise.resolve();
            const im = new Image();
            im.src = src;
            const loaded = im.decode ? im.decode().catch(function () {}) : new Promise(function (res) { im.onload = im.onerror = res; });
            return Promise.race([loaded, new Promise(function (res) { setTimeout(res, 2500); })]);
        }

        // The black opens from the middle, so the hero shows through where the
        // apple was. The wordmark is handed in while the hole is still opening.
        function openUp() {
            const big = Math.ceil(Math.hypot(window.innerWidth, window.innerHeight) / 2) + 40;
            return gsap.timeline({ onComplete: done })
                .to(wrapper, { "--ga-hole": big + "px", duration: 0.95, ease: "power3.inOut" }, 0)
                .call(function () { loader.classList.add("loaded"); }, null, 0.6);
        }

        let seen = false;
        try { seen = sessionStorage.getItem("ga-splash-seen") === "1"; } catch (e) { /* private mode */ }
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (reduced) {
            // no bites, no movement: a plain fade once the hero is ready
            gsap.set(svg, { opacity: 1, scale: 1 });
            heroReady().then(done);
            return;
        }

        if (seen) {
            // back on the home page in the same visit: skip the meal
            gsap.set(svg, { opacity: 0 });
            heroReady().then(openUp);
            return;
        }

        // Side bites, alternating, each a little deeper. The last pair are big
        // enough to leave only the core: the top with its stem and leaf, the
        // base, and a narrow waist. Coordinates are in the SVG's 200 x 224 box,
        // measured off the photo's own outline (widest at y 112, x 3 to 196).
        const CENTRE = { x: 100, y: 118 };
        // Flesh shows along each bite edge, widest in the middle of the bite
        // and tapering to nothing at the ends, as it does on a real apple.
        const FLESH = 4.5;
        // The big right-hand bite sits lower than the left one so it never
        // reaches the leaf (the leaf has no flesh to show).
        const BITES = [
            { cx: 212, cy: 98,  r: 37 },
            { cx: -12, cy: 133, r: 37 },
            { cx: 220, cy: 152, r: 49 },
            { cx: -20, cy: 88,  r: 49 },
            { cx: 239, cy: 128, r: 98 },
            { cx: -39, cy: 118, r: 98 }
        ];

        // A bite is a circle with a row of small, slightly uneven bumps along
        // the edge facing the apple's middle: tooth marks, not a cookie cutter.
        // Each bite goes into both masks. On the flesh it is the same circle
        // nudged outwards by FLESH, so the photo is cut a little deeper than
        // the flesh: a crescent of flesh shows, widest mid-bite.
        function biteShape(b, cx, cy, mask, teethSeed) {
            const g = document.createElementNS(NS, "g");
            const main = document.createElementNS(NS, "circle");
            main.setAttribute("cx", cx.toFixed(1)); main.setAttribute("cy", cy.toFixed(1)); main.setAttribute("r", b.r);
            main.setAttribute("fill", "#000");
            g.appendChild(main);
            const toward = Math.atan2(CENTRE.y - cy, CENTRE.x - cx);
            const teeth = 7, spread = 1.25;
            teethSeed.forEach(function (j, i) {
                const a = toward - spread / 2 + (spread * i) / (teeth - 1) + j.da;
                const t = document.createElementNS(NS, "circle");
                t.setAttribute("cx", (cx + Math.cos(a) * b.r * j.dr).toFixed(1));
                t.setAttribute("cy", (cy + Math.sin(a) * b.r * j.dr).toFixed(1));
                t.setAttribute("r", (Math.min(Math.max(b.r * 0.1, 3), 5.2) * j.ds).toFixed(1));
                t.setAttribute("fill", "#000");
                g.appendChild(t);
            });
            mask.appendChild(g);
            gsap.set(g, { scale: 0, svgOrigin: cx.toFixed(1) + " " + cy.toFixed(1) });
            return g;
        }

        function makeBite(b) {
            // one set of uneven teeth shared by both masks, so the flesh
            // follows the same tooth marks as the skin
            const seed = [];
            for (let i = 0; i < 7; i++) seed.push({ da: (Math.random() - 0.5) * 0.06, dr: 0.99 + Math.random() * 0.025, ds: 0.75 + Math.random() * 0.5 });
            const away = Math.atan2(b.cy - CENTRE.y, b.cx - CENTRE.x);
            return [
                biteShape(b, b.cx, b.cy, maskSkin, seed),
                biteShape(b, b.cx + Math.cos(away) * FLESH, b.cy + Math.sin(away) * FLESH, maskFlesh, seed)
            ];
        }

        // Very subtle crumbs: a few small specks of flesh, the odd fleck of
        // skin, flicked out from where the teeth went in.
        function spray(b) {
            const away = Math.atan2(b.cy - CENTRE.y, b.cx - CENTRE.x);
            const d = Math.hypot(CENTRE.x - b.cx, CENTRE.y - b.cy) || 1;
            const px = b.cx + ((CENTRE.x - b.cx) / d) * b.r * 0.92;
            const py = b.cy + ((CENTRE.y - b.cy) / d) * b.r * 0.92;
            const tl = gsap.timeline();
            const count = 5;
            for (let i = 0; i < count; i++) {
                const c = document.createElementNS(NS, "circle");
                c.setAttribute("cx", (px + (Math.random() - 0.5) * 10).toFixed(1));
                c.setAttribute("cy", (py + (Math.random() - 0.5) * 14).toFixed(1));
                c.setAttribute("r", (0.9 + Math.random() * 1.4).toFixed(1));
                if (i === 0) c.setAttribute("class", "is-skin");
                crumbs.appendChild(c);
                const a = away + (Math.random() - 0.5) * 1.4;
                const dist = 16 + Math.random() * 26;
                tl.fromTo(c, { opacity: 0.95 }, {
                    x: Math.cos(a) * dist,
                    y: Math.sin(a) * dist + 14 + Math.random() * 16,
                    opacity: 0,
                    duration: 0.45 + Math.random() * 0.2,
                    ease: "power2.out",
                    onComplete: function () { c.remove(); }
                }, 0);
            }
            return tl;
        }

        // One chomp. The bite snaps in, and the apple takes the hit: a short
        // shake, a little punch of zoom and a tilt away from the side that was
        // bitten, so the tilts alternate as the bites swap sides. Everything
        // settles back within about a third of a second.
        function chomp(b, pair) {
            const tilt = b.cx > CENTRE.x ? -3.2 : 3.2;
            return gsap.timeline()
                .to(pair, { scale: 1, duration: 0.13, ease: "back.out(2.4)" }, 0)
                .fromTo(svg, { scale: 1.045 }, { scale: 1, duration: 0.42, ease: "elastic.out(1, 0.45)", overwrite: "auto" }, 0)
                .fromTo(svg, { rotation: tilt }, { rotation: 0, duration: 0.5, ease: "elastic.out(1, 0.4)", overwrite: "auto" }, 0)
                .to(svg, { keyframes: { x: [0, tilt * -1.1, tilt * 0.8, tilt * -0.4, 0] }, duration: 0.24, ease: "none", overwrite: "auto" }, 0)
                .add(spray(b), 0.03);
        }

        const pairs = BITES.map(makeBite);
        const last = BITES.length - 1;
        const STEP = 0.3;   // between bites
        const FIRST = 0.6;  // after the apple lands

        appleReady().then(function () {
            const meal = gsap.timeline();
            meal.to(svg, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.6)", transformOrigin: "50% 55%" }, 0);
            for (let i = 0; i < last; i++) meal.add(chomp(BITES[i], pairs[i]), FIRST + i * STEP);

            // The last bite is due one beat after the one before it. Waiting
            // for the whole timeline would also wait for the crumbs to land,
            // which left the core sitting there doing nothing.
            const mealDone = new Promise(function (res) { meal.call(res, null, FIRST + last * STEP); });

            Promise.all([mealDone, heroReady()]).then(function () {
                const drop = Math.round(window.innerHeight * 0.55);
                gsap.timeline()
                    .add(chomp(BITES[last], pairs[last]), 0)
                    // core left, a beat, then it drops away
                    .to(svg, { y: drop, rotation: 16, duration: 0.7, ease: "power2.in", overwrite: "auto" }, 0.34)
                    .to(svg, { opacity: 0, duration: 0.25, ease: "none" }, 0.79)
                    .add(openUp(), 0.62);
            });
        });
    })();

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
    /*  04. Hero flipbook, GIF-style frame cycle
    /*----------------------------------------*/
    (function bannerFlipbook() {
        // Pace. It read fine at 175 as a mid-page band, but the hero fills the
        // whole screen now, so the same rate felt frantic. Another 25% slower.
        const FRAME_MS = 220;

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
    /*  05. Hero parallax without the smoother
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
    /*  06. Magic cursor
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
    /*  07. Back to top
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
    /*  08. Header reveal
    /*----------------------------------------*/
    (function headerReveal() {
        const header = document.querySelector(".px-header-2-area.header-fixed");
        if (!header) return;

        // On the home page the header's first screen is now the full bleed
        // hero, which is dark, so the black wordmark disappears into it. While
        // the header is still over the hero it inverts to cream; the moment it
        // picks up its own cream band it goes back to black.
        const heroEl = document.querySelector(".ga-hero");
        const overDark = !!heroEl;
        if (overDark) header.classList.add("over-hero");

        // The wordmark lands in the nav right at the end of the hero. Letting
        // the header hide on that very scroll would snatch the landing away
        // the moment it happened, so hiding only starts once the hero is well
        // behind us and the mark has had a beat to be seen in place.
        const holdUntil = function () {
            return heroEl ? heroEl.offsetHeight + 240 : 60;
        };

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
                // While the hero wordmark is still flying into the nav slot
                // (section 11) the header has to hold still and stay
                // transparent: if it slid away or took its cream band
                // mid-flight, the mark would land on a header that is not
                // there, over a band that should not be on the dark hero yet.
                if (header.classList.contains("logo-pending")) {
                    header.classList.remove("is-stuck", "is-hidden");
                    if (overDark) header.classList.add("over-hero");
                    return;
                }

                if (self.scroll() < 60) {
                    header.classList.remove("is-stuck", "is-hidden");
                    if (overDark) header.classList.add("over-hero");
                    return;
                }
                header.classList.remove("over-hero");
                header.classList.add("is-stuck");
                header.classList.toggle(
                    "is-hidden",
                    self.direction === 1 && self.scroll() > holdUntil()
                );
            }
        });
    })();

    /*----------------------------------------*/
    /*  09. Menu
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

    /*----------------------------------------*/
    /*  10. Hero rotator
    /*----------------------------------------*/
    (function heroRotator() {
        const lines = Array.from(document.querySelectorAll(".ga-hero-line"));
        if (lines.length < 2) return;

        // Reduced motion keeps the first line and never moves. The <p> carries
        // the full phrase in aria-label, so nothing is lost to a screen reader.
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const HOLD_MS = 2600;
        let index = 0;

        setInterval(function () {
            const current = lines[index];
            index = (index + 1) % lines.length;
            const next = lines[index];

            // Current slides down and out, next drops in from above.
            current.classList.remove("is-in");
            current.classList.add("is-out");

            // Park the incoming line above the box with no transition, so it
            // does not travel across the whole height on its way in.
            next.classList.remove("is-out");
            void next.offsetWidth;
            next.classList.add("is-in");

            setTimeout(function () {
                current.classList.remove("is-out");
            }, 760);
        }, HOLD_MS);
    })();

    /*----------------------------------------*/
    /*  11. Wordmark dock
    /*----------------------------------------*/
    (function wordmarkDock() {
        const dock = document.getElementById("ga_wordmark");
        const hero = document.querySelector(".ga-hero");
        const header = document.querySelector(".px-header-2-area.header-fixed");
        if (!dock || !hero || !header) return;

        const good = dock.querySelector(".ga-wm-good");
        const apples = dock.querySelector(".ga-wm-apples");
        const mid = dock.querySelector(".ga-wm-mid");
        const rotator = dock.querySelector(".ga-wm-above");
        const navGood = header.querySelector(".ga-logo-line");
        const navApples = header.querySelector(".ga-logo-word");
        if (!good || !apples || !navGood || !navApples) return;

        // The header owns the slot the wordmark is flying into, so until the
        // handover its own logo stays hidden and the two never both show.
        header.classList.add("logo-pending");

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        // Reveal once the splash is out of the way. The preloader marks itself
        // loaded; if there is no preloader on the page, go straight away.
        const loader = document.getElementById("loader");
        function reveal() { dock.classList.add("is-revealed"); }
        if (!loader || loader.classList.contains("loaded")) {
            reveal();
        } else {
            new MutationObserver(function (m, obs) {
                if (loader.classList.contains("loaded")) { reveal(); obs.disconnect(); }
            }).observe(loader, { attributes: true, attributeFilter: ["class"] });
            // belt and braces: never leave the hero wordless if the splash stalls
            setTimeout(reveal, 7000);
        }

        // Measure the flight. Both rects are read in viewport coordinates with
        // the dock untransformed, and the dock is fixed, so the delta holds for
        // the whole scroll. The target is measured with the header in its
        // scrolled state, because that is the slot the wordmark ends up in.
        function measure() {
            gsap.set([good, apples], { clearProps: "transform" });

            // .is-stuck drops the header's padding-top from 40 to 18, and that
            // property is transitioned. Measuring straight after adding the
            // class reads the padding the transition has not moved off yet, so
            // the target came out 22px low and the mark jumped on handover.
            // Transitions are suppressed for the measurement.
            const wasStuck = header.classList.contains("is-stuck");
            const prevTransition = header.style.transition;
            header.style.transition = "none";
            if (!wasStuck) header.classList.add("is-stuck");
            void header.offsetHeight;

            const tg = navGood.getBoundingClientRect();
            const ta = navApples.getBoundingClientRect();

            if (!wasStuck) header.classList.remove("is-stuck");
            void header.offsetHeight;
            header.style.transition = prevTransition;

            const g = good.getBoundingClientRect();
            const a = apples.getBoundingClientRect();
            if (!g.width || !tg.width) return null;

            return {
                good:   { x: tg.left - g.left, y: tg.top - g.top, scale: tg.width / g.width },
                apples: { x: ta.left - a.left, y: ta.top - a.top, scale: ta.width / a.width }
            };
        }

        if (reduced) {
            // No flight: hand straight over so the page still has exactly one
            // wordmark at any moment.
            ScrollTrigger.create({
                trigger: hero,
                start: "bottom 80%",
                onEnter: function () {
                    dock.classList.add("is-docked");
                    header.classList.remove("logo-pending");
                },
                onLeaveBack: function () {
                    dock.classList.remove("is-docked");
                    header.classList.add("logo-pending");
                }
            });
            return;
        }

        let tl;

        function build() {
            const d = measure();
            if (!d) return;

            if (tl) tl.scrollTrigger && tl.scrollTrigger.kill();
            if (tl) tl.kill();

            tl = gsap.timeline({
                defaults: { ease: "none" },
                scrollTrigger: {
                    trigger: hero,
                    start: "top top",
                    // lands a little before the hero fully clears, so the mark
                    // is already parked by the time the header takes its band
                    end: "bottom 22%",
                    scrub: 0.5,
                    invalidateOnRefresh: true,
                    onUpdate: function (self) {
                        const done = self.progress > 0.985;
                        dock.classList.toggle("is-docked", done);
                        header.classList.toggle("logo-pending", !done);
                    }
                }
            });

            tl.to(good,   { x: d.good.x,   y: d.good.y,   scale: d.good.scale }, 0)
              .to(apples, { x: d.apples.x, y: d.apples.y, scale: d.apples.scale }, 0);

            // The bar, the tagline and the rotating line are hero furniture,
            // not part of the mark, so they drop away early rather than
            // shrinking into the nav with it.
            const furniture = [mid, rotator].filter(Boolean);
            if (furniture.length) tl.to(furniture, { opacity: 0, duration: 0.3 }, 0);
        }

        // Fonts change the measured widths, so wait for them before measuring.
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(build);
        } else {
            build();
        }

        ScrollTrigger.addEventListener("refreshInit", function () {
            gsap.set([good, apples], { clearProps: "transform" });
        });

        let resizeTimer = null;
        window.addEventListener("resize", function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(build, 180);
        });
    })();

    /*----------------------------------------*/
    /*  12. Project gallery video
    /*----------------------------------------*/
    // Gallery videos (site scroll-throughs, film loops) load nothing until
    // they come near the screen, play only while on it, and pause when they
    // leave. Reduced motion gets the poster and the player controls instead.
    (function galleryVideo() {
        const vids = Array.from(document.querySelectorAll(".ga-g-video"));
        if (!vids.length) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            vids.forEach(function (v) { v.controls = true; });
            return;
        }
        if (!("IntersectionObserver" in window)) {
            vids.forEach(function (v) { v.autoplay = true; v.play().catch(function () {}); });
            return;
        }
        const io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                const v = e.target;
                if (e.isIntersecting) {
                    if (v.preload === "none") v.preload = "auto";
                    v.play().catch(function () {});
                } else {
                    v.pause();
                }
            });
        }, { threshold: 0.2 });
        vids.forEach(function (v) { io.observe(v); });
    })();

})();

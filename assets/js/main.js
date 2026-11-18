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
    10. (hero rotator, removed 18 Nov)
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

        if (!wrapper || !svg || !maskSkin || !window.gsap) { done(); return; }

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

        // Five big bites, alternating sides and getting deeper, leave a proper
        // apple core: the top with its stem and leaf, the base, and a thin
        // waist about 32 wide. Joey, 18 Nov: "more of the apple would get
        // eaten", "the top and bottom and thin core of apple should be left",
        // "this but much thinner", then "less bites". Coordinates are in the
        // SVG's 200 x 224 box, measured off the photo's own outline (widest at
        // y 112, x 3 to 196; the leaf sits above y 42 between x 108 and 190,
        // the stem at x 95). The last two bites alone carve the final core.
        const CENTRE = { x: 100, y: 118 };
        // The right-hand bites sit low so they never reach the leaf: the last
        // one is centred at y 145 for exactly that.
        const BITES = [
            { cx: 214, cy: 100, r: 56 },
            { cx: -16, cy: 130, r: 62 },
            { cx: 226, cy: 150, r: 86 },
            { cx: -19, cy: 118, r: 104 },
            { cx: 219, cy: 145, r: 104 }
        ];
        // It starts small (section 05 of the CSS) and every chomp leaves it
        // this much bigger, with a heavier punch on the way: about 2.1x by the
        // last bite, which is still smaller than the old starting size.
        const GROW = 1.16;
        const PUNCH = 1.12;

        // A bite edge, the way teeth actually leave it: a handful of wide,
        // shallow scoops of different sizes along the front of the bite, with
        // small sharp ridges where neighbouring scoops meet. (Joey, 18 Nov:
        // the old row of small round teeth looked "like repetitive cogs".)
        // Each scoop is a circle whose front sits on the bite's arc; together
        // with a fill circle behind them they make one solid shape, cut
        // straight out of the flat photo. Sizes, spacing and depth are
        // jittered per scoop and re-rolled every visit, so no two bites match.
        function biteShape(b, cx, cy, mask) {
            const g = document.createElementNS(NS, "g");
            function disc(x, y, r) {
                const c = document.createElementNS(NS, "circle");
                c.setAttribute("cx", x.toFixed(1)); c.setAttribute("cy", y.toFixed(1)); c.setAttribute("r", r.toFixed(1));
                c.setAttribute("fill", "#000");
                g.appendChild(c);
            }
            const jitter = function (amount) { return (Math.random() - 0.5) * 2 * amount; };

            // everything behind the tooth line
            disc(cx, cy, b.r * 0.9);

            // scoops across the front of the bite, about 23 degrees apiece,
            // covering more arc than ever shows inside the apple so the edge
            // is scooped all the way to where the bite leaves the outline
            const toward = Math.atan2(CENTRE.y - cy, CENTRE.x - cx);
            const half = 1.35;
            let a = -half;
            while (a <= half) {
                const ang = toward + a;
                const rs = b.r * (0.4 + jitter(0.07));
                const front = b.r * (1 + jitter(0.018));
                disc(cx + Math.cos(ang) * (front - rs), cy + Math.sin(ang) * (front - rs), rs);
                a += 0.4 * (1 + jitter(0.28));
            }

            mask.appendChild(g);
            gsap.set(g, { scale: 0, svgOrigin: cx.toFixed(1) + " " + cy.toFixed(1) });
            return g;
        }

        function makeBite(b) {
            return biteShape(b, b.cx, b.cy, maskSkin);
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

        // One chomp. The bite snaps in, and the apple takes the hit: a punch
        // of zoom, a short shake, and a tilt away from the side that was
        // bitten, then an easy return. Joey: "rotate back and forth per bite,
        // not always by the same amount, a bit of asymmetry", and then "its
        // not meant to swing back past centre before settling". So each bite
        // is one tilt (a fresh random size) and one smooth return that never
        // crosses upright: it settles leaning slightly towards the side it
        // tilted to, by a different small amount each time. As the bites swap
        // sides the tilts alternate, which gives the back and forth. It also
        // settles at its new, bigger size (level), so it grows bite by bite.
        const between = function (a, b) { return a + Math.random() * (b - a); };
        function chomp(b, bite, level) {
            const away = b.cx > CENTRE.x ? -1 : 1;
            const tilt = away * between(5.5, 10);
            const rest = away * between(0.3, 2.4);
            const shake = [between(2.2, 4.4), between(1.4, 3.4), between(0.5, 1.6)];
            return gsap.timeline()
                // a bite never overshoots: on the big ones a springy ease made
                // the apple look as if it grew back after each bite
                .to(bite, { scale: 1, duration: 0.2, ease: "power3.out" }, 0)
                .fromTo(svg, { scale: level * PUNCH }, { scale: level, duration: 0.62, ease: "elastic.out(1, 0.45)", overwrite: "auto" }, 0)
                .to(svg, {
                    keyframes: [
                        { rotation: tilt, duration: 0.12, ease: "power3.out" },
                        { rotation: rest, duration: 0.6, ease: "power2.out" }
                    ],
                    overwrite: "auto"
                }, 0)
                .to(svg, { keyframes: { x: [0, -away * shake[0], away * shake[1], -away * shake[2], 0] }, duration: 0.32, ease: "none", overwrite: "auto" }, 0)
                .add(spray(b), 0.04);
        }

        const bites = BITES.map(makeBite);
        const last = BITES.length - 1;
        const STEP = 0.75;  // between bites: fewer, bigger, unhurried
        const FIRST = 0.7;  // after the apple lands
        const level = function (i) { return Math.pow(GROW, i + 1); };

        appleReady().then(function () {
            const meal = gsap.timeline();
            meal.to(svg, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.6)", transformOrigin: "50% 55%" }, 0);
            for (let i = 0; i < last; i++) meal.add(chomp(BITES[i], bites[i], level(i)), FIRST + i * STEP);

            // The last bite is due one beat after the one before it. Waiting
            // for the whole timeline would also wait for the crumbs to land,
            // which left the core sitting there doing nothing.
            const mealDone = new Promise(function (res) { meal.call(res, null, FIRST + last * STEP); });

            Promise.all([mealDone, heroReady()]).then(function () {
                const drop = Math.round(window.innerHeight * 0.55);
                gsap.timeline()
                    .add(chomp(BITES[last], bites[last], level(last)), 0)
                    // core left, a beat, then it drops away
                    // it falls the way it is leaning, rather than swinging
                    // back across upright to fall the other way
                    .to(svg, { y: drop, rotation: function () { return gsap.getProperty(svg, "rotation") < 0 ? -16 : 16; }, duration: 0.75, ease: "power2.in", overwrite: "auto" }, 0.5)
                    .to(svg, { opacity: 0, duration: 0.25, ease: "none" }, 1.0)
                    .add(openUp(), 0.8);
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
                const y = self.scroll();
                // While the hero is still under the header (or the hero
                // wordmark is still flying into the nav slot, section 11) the
                // header holds still, stays transparent and keeps its logo
                // cream. The flight lands on exactly this slot, so the hand
                // over is invisible; the cream band and black logo only arrive
                // once the hero has scrolled out from under the header.
                const overHero = !!heroEl && y < heroEl.offsetHeight - header.offsetHeight;
                if (header.classList.contains("logo-pending") || overHero || y < 60) {
                    header.classList.remove("is-stuck", "is-hidden");
                    if (overDark) header.classList.add("over-hero");
                    return;
                }
                header.classList.remove("over-hero");
                header.classList.add("is-stuck");
                header.classList.toggle(
                    "is-hidden",
                    self.direction === 1 && y > holdUntil()
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
    /*  10. (hero rotator, removed 18 Nov)
    /*----------------------------------------*/
    // Removed 18 Nov with the rest of the hero furniture (bar, tagline,
    // rotating line). The hero is now just the gif and the logo.

    /*----------------------------------------*/
    /*  11. Wordmark dock
    /*----------------------------------------*/
    (function wordmarkDock() {
        const dock = document.getElementById("ga_wordmark");
        const hero = document.querySelector(".ga-hero");
        const header = document.querySelector(".px-header-2-area.header-fixed");
        if (!dock || !hero || !header) return;

        const stage = dock.querySelector(".ga-wm-stage");
        const meta = hero.querySelector(".ga-hero-meta");
        const navLogo = header.querySelector(".ga-logo");
        if (!stage || !navLogo) return;

        // The header owns the slot the wordmark is flying into, so until the
        // handover its own logo stays hidden and the two never both show.
        header.classList.add("logo-pending");

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        // Reveal once the splash is out of the way. The preloader marks itself
        // loaded; if there is no preloader on the page, go straight away.
        const loader = document.getElementById("loader");
        function reveal() {
            dock.classList.add("is-revealed");
            if (meta) meta.classList.add("is-revealed");
        }
        if (!loader || loader.classList.contains("loaded")) {
            reveal();
        } else {
            new MutationObserver(function (m, obs) {
                if (loader.classList.contains("loaded")) { reveal(); obs.disconnect(); }
            }).observe(loader, { attributes: true, attributeFilter: ["class"] });
            // belt and braces: never leave the hero wordless if the splash stalls
            setTimeout(reveal, 10500);
        }

        // The hero lockup and the header logo are the same shape in em, so the
        // flight is one scale + translate from corner to corner. The target is
        // the logo as it sits while the header is still over the hero (not
        // stuck, not hidden), because section 08 holds it there until the hero
        // has gone, so that is where the hand-over happens. The header's
        // padding is transitioned, so transitions are off while measuring.
        function measure() {
            gsap.set(stage, { clearProps: "transform" });

            const wasStuck = header.classList.contains("is-stuck");
            const wasHidden = header.classList.contains("is-hidden");
            const prevTransition = header.style.transition;
            header.style.transition = "none";
            header.classList.remove("is-stuck", "is-hidden");
            void header.offsetHeight;

            const t = navLogo.getBoundingClientRect();

            if (wasStuck) header.classList.add("is-stuck");
            if (wasHidden) header.classList.add("is-hidden");
            void header.offsetHeight;
            header.style.transition = prevTransition;

            const s = stage.getBoundingClientRect();
            if (!s.width || !t.width) return null;
            return { x: t.left - s.left, y: t.top - s.top, scale: t.width / s.width };
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
            if (meta) gsap.set(meta, { clearProps: "opacity" });

            tl = gsap.timeline({
                scrollTrigger: {
                    trigger: hero,
                    start: "top top",
                    // parked a little before the hero clears, while the header
                    // is still transparent over it
                    end: "bottom 22%",
                    scrub: 0.6,
                    invalidateOnRefresh: true,
                    onUpdate: function (self) {
                        const done = self.progress > 0.985;
                        dock.classList.toggle("is-docked", done);
                        header.classList.toggle("logo-pending", !done);
                    }
                }
            });

            // Eased out, so it lifts off the bottom straight away (it never
            // sits over the ticker or the cream section rising underneath) and
            // settles gently into the slot.
            tl.to(stage, { x: d.x, y: d.y, scale: d.scale, ease: "power1.out", duration: 1 }, 0);

            // The context block scrolls up with the hero, so it has to be gone
            // before it reaches the header, or it slides under the menu
            // button. Below xl it sits right above the logo, in its flight
            // path, so it goes over the first ~30px of scroll. On a desktop it
            // sits bottom right, clear of the logo, and fades through the
            // middle of the flight, while it is still well down the screen.
            // (This fades the block; the entrance runs on its spans, so the
            // two never fight over the same opacity.)
            if (meta) {
                const narrow = window.matchMedia("(max-width: 1199px)").matches;
                tl.fromTo(meta, { opacity: 1 }, { opacity: 0, duration: narrow ? 0.05 : 0.2, ease: "none" }, narrow ? 0 : 0.5);
            }
        }

        // Fonts change the measured widths, so wait for them before measuring.
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(build);
        } else {
            build();
        }

        ScrollTrigger.addEventListener("refreshInit", function () {
            gsap.set(stage, { clearProps: "transform" });
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

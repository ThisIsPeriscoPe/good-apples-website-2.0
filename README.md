# Good Apples Website 2.0

Static marketing site for Good Apples. No build step: open `index.html`, or serve
the folder over HTTP (the fonts need a real origin, so `file://` won't do).

```bash
python3 -m http.server 4321
```

## Handoff (updated 18 Nov 2026)

Read this first when picking the project up, from either Claude account.

**Where it's up to**
- The site is a one-page homepage: hero, statement, banner flipbook, values
  ticker, services, work index, manifesto, footer.
- It IS deployed, despite what this note said before 17 Nov:
  https://thisisperiscope.github.io/good-apples-website-2.0/ returns 200.
  GitHub Pages serves main from the repo root. Assets carry a `?v=` stamp
  (currently 20261118p); bump it in index.html, studio.html, contact.html
  AND in every work/*.html
  whenever CSS or JS changes, or phones serve a stale mix.
- Done 17 Nov (second pass, personal account):
  - Services regrouped to 10 across Brand / Digital / Content / Marketing,
    written from the real-work evidence in Notes, not the old site's six.
  - All 18 heroes cropped to 3:2 at 1600px into `assets/img/work/<slug>.jpg`
    (4.7 MB total). Every crop was eyeballed on a contact sheet: no cut faces
    or bad framing. Slugs are the kebab-case project names.
  - Work index rebuilt for all 18: 3 columns with the middle column staggered,
    2 columns under 1200px, 1 under 768px. Checked at 1440x650 and 375px, no
    horizontal overflow.
  - Eight project pages built and linked: she-means-business, healthy-rituals,
    kioni, bskt, harvest-and-halo, cmbt, sprout, outer-bound. The other ten
    render as unlinked `.is-pending` cards, because there is no sourced copy
    for them yet and nothing on this site is invented. No dead links remain.
  - `content/SOURCES.md` records, per project, where the copy came from or
    that there is none. Read it before writing any project page.
- Two faults found and fixed 17 Nov while checking every size:
  - **The reveal stalled on every desktop viewport.** ScrollSmoother drives
    scrolling from the GSAP ticker, so the window fires no scroll events while
    it runs and the `.px-fade-anim` sweep stopped after the first screen.
    Anything at or above 1200px with a fine pointer stayed invisible below the
    fold. It passed the earlier check only because that ran at 965px, where the
    smoother is off and native scroll events fire. The sweep now runs off
    `gsap.ticker` as well as the scroll listener; both detach once nothing is
    pending. **Lesson: verify above 1200px as well as below, or you are testing
    a different code path.**
  - **The header collided with content on short windows.** It floats with no
    background of its own, which only reads well while the hero fills the
    screen. It now slides away going down and returns on a solid band going up
    (`.is-stuck` / `.is-hidden`, section 07 of main.js), driven by ScrollTrigger
    so it is identical with and without the smoother. At the very top it is
    transparent exactly as before.
  - Verified with zero elements left hidden in view across a full-page sweep at
    1800x775, 1440x473 and 500x723, on the home page and on project pages.
    Note Chrome on macOS will not make a window narrower than ~500px; for a
    true 375px check use the in-app browser pane, and make sure it is VISIBLE,
    because a hidden pane fires no scroll events and no frames at all and will
    report everything as broken.

**Also done 17 Nov (later in the session)**
- `studio.html` and `contact.html` built. Both use real facts only: founded
  2016, rebrands 2018 and 2024, owned and operated by PeriscoPe, studio at
  1/76 Township Dr Burleigh Heads, and the five values from the showcase deck.
  No team names, bios or client counts, because none are sourced. No fake
  contact form either: a form with nowhere to submit is not usable.
- **The hamburger menu now works** (section 08 of main.js, section 21 of the
  CSS). It had to: Studio and Contact were otherwise unreachable from every
  page except the home footer. Full-screen black panel, closes on link click
  and Escape, and pauses ScrollSmoother while open (with the smoother running
  the body does not scroll at all, so `body { overflow: hidden }` does nothing
  on its own). The panel sits outside `#smooth-wrapper` so the smoother's
  transform cannot move it.
- The theme's hamburger active-state CSS assumed two bars while the markup has
  three, so the third bar was left sitting there and the cross came out as a
  `<`. Fixed, and the open state now inverts to a cream disc, because a black
  circle on the black panel was invisible.

**Checked and NOT yet checked (be honest about this)**
- Verified: the menu opens, closes, navigates and releases the scroll lock, and
  both new pages render, at 1440x473 with the smoother on.
- Verified 18 Nov: the menu and both new pages at 375px phone width and on a
  tall 1920x1200 window too (see "Done 18 Nov" below for how).

**Joey's calls, 18 Nov (fourth round)**
- **Outer Bound is cafe work only.** "outerbound music stuff do not include,
  just cafe related stuff." No record store, record launch, community record
  digs or other music material anywhere on the site, including galleries. The
  Run Club (the cafe's own run club), cafe merch, menus and the gift voucher
  are fine.
- **Splash:** "use an actual real etched apple" means deep-etched (cut out),
  and each bite gets "impactful subtle shake, zoom, and alternate rotations"
  with "very subtle apple crumbs". See "Done 18 Nov".

**Joey's calls, 18 Nov (fifth round): image freshness**
- **CMBT: no old shots.** "i swear you are picking like the most ancient
  outdated cmbt photos." The gallery is now all 2024 work from CMBT's own
  Instagram export (Drive, shared by CMBT in May 2025; copies in
  `Desktop/Good Apples/Web/Assets/CMBT/2024 Instagram (Drive)`), and the
  hero is the May 2024 Hydrate can-in-hand shot. The 2019-2022 shoot images
  in "Best picks (Nov 2026)" are not to be used on the site.
- **BSKT: the colour studio shots.** "all these suck for BSKT", "nicer studio
  shot images". The gallery is the 2025 studio set already saved in
  `Desktop/Good Apples/Web/Assets/BSKT` (bars on red, granola pours on
  yellow and blue, Davidson Plum on red earth, Dark Cocoa grid, Cinnamon
  Myrtle launch), not the 2021-22 shoot in "Best picks".
- Lesson for picking images anywhere on this site: newest and boldest first.
  Check the date before the content.

**Joey's calls, 18 Nov (seventh round): hero rebuilt, splash bites redone**
- **The hero was broken, and it was a real bug, not taste.** Joey: "black on
  black drop shadow", "lazy and shit", "you can remove filler if needed or
  redesign it". The hero wordmark was an `<h1>` and inherited the theme's
  black heading colour, so GOOD APPLES rendered black on the dark gif. Every
  automated check passed, because none of them looks at colour. **Lesson:
  look at the hero yourself, at the user's own window size (Joey's is about
  1490 wide), before calling it done.**
- **Redesigned, the "logo is the hero" way** (Joey: "look at industry gold
  standard bespoke logo transitions from hero to nav"; Gucci and Fergus are
  the usual references). Rules from Joey: the full bleed gif stays, and so
  does the ticker strip directly under it. Everything else was open.
  - The hero now carries one thing: a giant cream copy of the stacked
    GOOD / APPLES logo, bottom left, in the same `.container` as the header
    logo and with exactly its metrics in em. On scroll the whole lockup
    rises and shrinks straight into the header logo in one transform (eased
    out, scrubbed), then hands over to it. Same shape, so it lands with no
    jump: checked frame by frame either side of the hand-over.
  - Gone: the green bar, "A Human-Led Creative Agency" between the words,
    the rotator (section 10 of main.js removed), and every text-shadow. A
    scrim (bottom, top band, bottom-left corner) keeps the cream readable on
    light frames.
  - Context, small: "A human-led creative agency" (green), "Burleigh Heads,
    Australia", "Since 2016", bottom right on the logo's baseline on a
    desktop; above the logo on tablets and phones, where it fades within the
    first ~30px of scroll so the rising logo never crosses it. It lives in
    the hero and scrolls away with it (pinned, it ghosted over the ticker).
  - The header now stays transparent with a cream logo until the hero has
    scrolled out from under it, then takes its cream band and black logo.
- **Work section gap fixed.** "GOOD WORK, FOR GOOD PEOPLE" sat jammed against
  the dark services band because `.ga-work-area` had no top padding.
- **Splash:** "bigger slower bites", "gradually increase in size each bite",
  "less 3d bite effect and just direct bite etch into flat image", then the
  tooth marks "look way too unnatural and like repetitive cogs".
  - Flat cut-outs: the flesh layer (filter + second mask) is gone.
  - Side bites a third bigger (r 50 and 64), 0.6s apart (was 0.3s); the
    whole meal is about 5.5s before the hole opens.
  - The apple grows 1.07x per bite (about 1.5x by the core), sized to stay
    clear of the edges on a 1440x650 window.
  - Bite edges are a handful of wide, shallow, uneven scoops with small
    ridges between them, re-rolled every visit, instead of seven small round
    teeth.
- Tools: `Claude tools/herorec.mjs` screenshots the hero after the splash and
  at chosen scroll positions (desktop with a fake mouse, or `WxHm` for a
  phone). `qa.mjs` and `herorec.mjs` used to start their "wait for the
  splash" on the blank tab before the page loaded, so they shot mid-splash;
  both now wait for the real page.

**Joey's calls, 18 Nov (sixth round): the three held pages go up**
- **Take Me Wellness: build it.** "as long as the copy isn't claiming we did
  the branding/packaging, then its fine." The identity and packaging were made
  by another studio before we came on, so the page claims only the Shopify
  store: proposal, wireframes, theme, page design and homepage banners, built
  with PeriscoPe's developers. Never write that we did the brand or the
  packaging, and don't call the store live. The `TakeMe_Home.jpg` website
  mockup and the phone mockups in `GIF Full Bleed` are that studio's concepts,
  dated before we started, so they are not in the gallery.
- **Rygg: build it.** "we did the work so we showing it." The page covers the
  website (2025) and the US packaging adaptation of the HEATE and KHULE tubes.
  The packaging files are marked confidential, so only the copy mentions that
  work: no packaging images until the US tubes are on sale.
- **Rygg hero replaced.** Joey: "rygg needs a better hero bro, that webby
  screenshot doesn't cut it." It is now Rygg's own campaign photo (two athletes
  holding HEATE and KHULE against blue sky), taken full size from rygg.au and
  trimmed to drop a flare at the bottom edge. Copies are in
  `Desktop/Good Apples/Web/Assets/Rygg/Site photos (rygg.au, Nov 2026)`.
  **Lesson: heroes are full-bleed photography, never a website screenshot.**
  Screens belong in the gallery.
- **Fjord hero replaced too.** It was also a homepage screenshot. A still from
  Fjord's homepage film went up first and Joey binned it: "fjord hero is
  trash", "fjord probably has the most beautiful shots out of all the
  projects, even video". It is now Fjord's own install photo "Hakea" (a man
  in a bronze Fjord bath under a spotlight, "10-12°" on the wall), and the
  gallery now shows their install photography (Alchemy Saunas, Si Studio,
  Limfjord renders) and a clip of their homepage film alongside our site, GIF
  ad and apparel. Sources are in `Desktop/Good Apples/Web/Assets/Fjord/Site
  photos (fjord.com.au, Nov 2026)` and `Assets/Fjord`. **Lesson: a video
  frame is never a hero; use the brand's best stills, at full size.** No other
  hero is a screenshot.
- **CMBT question closed.** Joey, 18 Nov: "yes anything cmbt we did". All
  CMBT work on the page is ours, including the 2024 Hydrate cans and the plant
  protein bar packs, so those images stay.
- **Pharmacy Guild: build it,** crediting Akin Agency for the QSPP animation
  ("just mention akin where suitable"). Shown: QSPP "Pharmacy has Evolved"
  and the PAM explainer. Only finished, delivered pieces; nothing from the
  2026 library that is still in production.

**Project pages and galleries (18 Nov, in progress)**
- **Veteran Games page built** (work/veteran-games.html), copy sourced from the
  2027 Partnership Report HANDOFF and written to the VG Tone of Voice sheet
  (all rows read 18 Nov). Its card on the home page is now a link.
- **Every built page now has a gallery** under the copy, Motion Sickness style:
  full-width shots and two-up pairs, with video loops (site scroll-throughs,
  film clips) that only load and play while on screen.
- **Pages and galleries are built by a script**, not by hand:
  `python3 "Desktop/Good Apples/Web/Claude tools/build_pages.py" [slug ...]`
  reads `Claude tools/site-pages.json` (copy for new pages, gallery source
  files, crops, alt text), writes the media into `assets/img/work/<slug>/` and
  `assets/video/`, writes or updates `work/<slug>.html` (new pages use
  work/kioni.html as the template), and links the home card. Edit the JSON
  and re-run rather than hand-editing gallery markup.
- **All 18 pages are built and linked** (18 Nov). No `.is-pending` cards
  remain. New on 18 Nov: Veteran Games, ICONIC Beverages, BikeChain, Fjord,
  Zesty Paws, TreeArc, ELMNT H3O, then Take Me Wellness, Rygg and Pharmacy
  Guild. Their copy comes only from the private fact sheets in
  `Desktop/Good Apples/Web/Project facts/` (not in this public repo).
- Years corrected from the fact sheets: Take Me Wellness 2025–26 (was 2024;
  its card moved up beside the other 2025–26 work), Rygg 2025 (was 2025–26).
- **Take Me Wellness, Rygg and Pharmacy Guild were held, then cleared by Joey
  on 18 Nov** (see "Joey's calls, 18 Nov (sixth round)" below). This README is
  public; keep client-sensitive detail in the private fact sheets, not here.
- Image choices made with care on the new pages: no disputed offers (the
  Santini percentage is unresolved, so that clip is out), no Nike press
  imagery (rights open), no staff names or headshots (TreeArc cards and team
  photos left out), 4:5 BikeChain statics only.
- Favicon and touch icon added (made from the splash apple); the console 404
  is gone.

**Next (as of 18 Nov, all 18 pages built)**
1. Per-service image thumbs (see "second round" below) can now cover nine of
   the ten services from built pages: Pharmacy Guild shows Video and Motion,
   Fjord and Zesty Paws show Email and CRM, ELMNT shows Decks and Sales
   Collateral. 3D and Product Renders still has no project. Ask Joey before
   building them.
2. Take Me Wellness: when the store launches, add real screens of it to the
   gallery (today it shows the homepage banners and brand imagery only).
3. Rygg: add packaging images once the US tubes are on sale.
4. Before showing Joey anything, check desktop, phone and 1440x650, and read
   the two faults above so they are not reintroduced.

**Where things live**
- Hero contact sheet: Desktop/Good Apples/Web/Work hero picks (17 Nov).jpg.
  Rebuild it with Claude tools/build_sheet.py and hero-picks.tsv. Every path in
  the .tsv is a real file.
- Assets: Desktop/Good Apples/Web/Assets/<client>/
  - CMBT and BSKT: "Best picks (Nov 2026)"
  - Kioni: "Shoot originals (Drive)"
  - Fjord, Rygg and Veteran Games: site scroll videos and homepage stills
  - Rygg: "Rygg site scroll, no promo strip (18 Nov 2026).mp4" (the gallery
    video; the older scroll shows a dated promo bar), "Site screens (Nov
    2026)" (phone and desktop captures plus the orange and blue phone
    panels), "Site photos (rygg.au, Nov 2026)" (campaign photos, full size)
  - Sprout: brand video and frame
  - Pharmacy Guild: in Pharma; gallery stills in "Pharma/Stills (Nov 2026)".
    The QSPP masters are in Desktop/Archive/QSPP/Animation/01. Pharmacy has
    Evolved/Final Exports, the PAM explainer in Desktop/Archive/Pharmacy Guild
  - Take Me Wellness: Desktop/Archive/Take Me Wellness (homepage banners in
    Web/Assets/1.Hero Content)
- Heroes kept in client folders:
  - Veteran Games: Desktop/Veteran Games/Design Assets/VG Event Announcement
    Template/(Footage)/SAMPLE - Ninja Wall.jpg
  - Zesty Paws: Desktop/Zesty Paws/Supplied Brand Assets/Licensed Stock (Sep 26)/
  - BikeChain: ~/BikeChain/BikeChain Batch 1 Assets/04 Santini riding video (B1-10
    to 12)/Stills from full film (1080p)/
  - Healthy Rituals: Desktop/Archive/Healthy Rituals/Content/Shoot 1/Stills/DSC09248.jpg
- Tools (Desktop/Good Apples/Web/Claude tools/):
  - scrollrec.mjs records a live site scrolling, frame by frame, in headless
    Chrome. Pass kill-modals.js to strip popups.
  - shiftcheck.py checks the frames move evenly.
  - encode_scroll.py makes the eased mp4.
  - shot.mjs takes screenshots.
  - shotlist.mjs screenshots a list of pages in one go, phone or desktop,
    with CSS injected first (used to hide rygg.au's dated promo strip).
  - sheet.py and build_sheet.py make contact sheets.
  - qa.mjs: headless QA pass per page and size (overflow, hidden reveals,
    menu, console errors, a screenshot per scroll step).
  - splashrec.mjs: records a page load as a strip of screenshots, to play the
    splash through frame by frame.
  - herorec.mjs: the hero after the splash and at chosen scroll positions
    (`WxH` desktop with a fake mouse, `WxHm` phone).
  - The site is served locally on port 4321 (`python3 -m http.server 4321`
    from the repo; the in-app preview launcher can't read the Desktop, so run
    it from a shell and point `.claude/launch.json` at the URL).
- Session transcripts (either account):
  ~/.claude/projects/-Users-hypedesign-Desktop-Good-Apples-Web-Website-2-0/.
  The 17 Nov session is 3e89cdea-….

**Joey's calls, 18 Nov 2026 (both were open questions, now closed)**
- **"Skilled Operators", not the deck's "Expert Operators".** Used on the home
  ticker, the Studio values list and the manifesto. Do not change it back.
- **Phone number is 0450 534 610**, Martin Corr's, from his email signature.
  It is now on the Contact page, under the big email address and in the side
  column. Linked as `tel:+61450534610`.

**Joey's calls, 18 Nov (second round)**
- **The full bleed flipbook is the hero now.** The scattered image grid is
  gone from the home page: "not a fan of the scattered images for hero".
  The hero is 100svh of the cycling frames. (What sits on it was redesigned
  in the seventh round: see below. The rotator is gone.) The markup still
  uses `.ga-banner-img` and `.ga-banner-frames`, so the frame cycling and the
  no-smoother parallax fallback kept working untouched.
- **`assets/img/hero/*.jpg` are deliberately kept** even though nothing on
  the site references them. Joey: the scattered selects "are still a decent
  image reffo for general image selection taste for case study thumbs and
  whatnot". They are a taste reference, not dead weight. Do not bin them.
- **Flipbook pace is now 220ms per frame** (`FRAME_MS`, section 04 of
  main.js), up from 175. Joey, 18 Nov: "gif is a bit too rapid". It read fine
  as a mid-page band but felt frantic once it filled the screen.
- **Services section is dark and regrouped.** Joey: dark mode, and the flat
  list "feels a bit vanilla". It now runs as four discipline groups (Brand /
  Digital / Content / Marketing), each with its own sticky header column,
  blurb and count, beside its numbered rows. Hovering any row dims every
  other row in the section to 0.32 via `:has()`, turns the name and number
  green and slides an arrow in. Jack Nimble's own "What We Do" is dark with
  images, which backed the dark call; theirs is stacked blocks, which is the
  "bit basic" Joey means.
- **Per-service image thumbs are NOT in yet, on purpose.** Joey was open to
  them. Mapping them honestly against the projects' own discipline lists only
  covers 6 of the 10 services: Brand Identity, Packaging, Websites,
  Photography, Ad Creative and Print and Merch. Nothing in the eight built
  case studies demonstrates Email and CRM, Video and Motion, 3D and Product
  Renders or Decks and Sales Collateral, and putting a photo of a tote bag
  next to "3D and Product Renders" would claim work we cannot show. Ask Joey
  which jobs cover those four, then add all ten.
- Removed with the old hero: the scattered grid's hover and tablet Swiper
  slider in main.js, and the Swiper library itself (151K off the home page,
  it had no markup left to act on).

**Joey's calls, 18 Nov (third round)**
- **The ticker moved to sit directly under the gif hero.** Joey likes "the
  black moving strip beneath the full bleed gif, nice contrast", but "it only
  works when its white below it". Dark services straight under it killed that.
  Order is now hero (gif) -> ticker (black strip) -> statement (cream) ->
  services (dark) -> work. The strip gets the gif above and cream below, and
  services stays dark, separated. **Do not put a dark block directly under
  the ticker.**
- **One wordmark, not two.** Joey: the stacked nav mark and the full width
  hero mark were both on screen at once. The hero wordmark lives in a fixed
  dock (`#ga_wordmark`, section 23 of the CSS, section 11 of main.js) outside
  `#smooth-wrapper` and is flown into the nav slot on scroll. At the end the
  dock hides and the real header logo takes over, so only one mark exists at
  any moment. It reverses fully on the way back up. (Since the seventh round
  the hero mark is the stacked logo itself, flown as one piece: see below.)
  - It must live outside `#smooth-wrapper`: ScrollSmoother transforms
    `#smooth-content`, and a transformed ancestor makes `position: fixed`
    behave like `absolute`.
  - The header is pinned visible and transparent for the whole flight
    (`logo-pending`), or the mark would land on a header that had slid away.
  - It stays visible for 240px past the hero before it can hide again,
    otherwise the landing was snatched away the instant it happened.
  - **The target is measured with transitions suppressed.** The header's
    padding is transitioned, so a measurement taken mid-transition lands the
    mark off target. Since the seventh round the target is the header as it
    sits over the hero (not stuck), and the header stays that way until the
    hero has gone, so the hand-over happens there.
- **Work thumbs colour on hover again.** The ten unlinked cards had been
  locked to greyscale to flag they have no page; that rule had equal
  specificity to the hover rule and sat later in the file, so it won. Ten of
  eighteen cards never came to life and the grid read as broken. Lock removed.
- **Flipbook: 220ms a frame** (was 175). Joey: "gif is a bit too rapid".
- Joey on the hero copy, 18 Nov: "good work for good people or human led
  agency, or that green line, all can be adjusted / moved / removed if
  needed... not attached tho those, but appreciate some detailed contextual
  text or elements". So the strapline, tagline and green bar are all free to
  change; he just wants *some* supporting detail there. (Seventh round: the
  bar and rotator are gone; the detail is now three small facts beside the
  logo.)

**Done 18 Nov (Good Apples account, picking up from the team account)**
- **Bitten-apple splash replaces the percent counter** (section 01 of
  main.js, section 05 of the CSS, markup at the top of index.html; the splash
  only exists on the home page).
  - Joey's brief: "an apple being bitten into untill its gone, then a smooth
    way into the main page". Then "use an actual real etched apple" for "that
    motion sickness vibe". **"Etched" means deep-etched (cut out), not an
    engraving.** It is the real apple photo already on the current
    good-apples.com.au: `Desktop/Good Apples/Web/Brand Assets/Image 7.png`,
    exported to `assets/img/splash/apple.webp` (83 KB, preloaded in the head).
  - Six bites alternate sides until only the core is left; the core drops and
    the black opens out from the middle onto the hero (a radial mask driven by
    `--ga-hole`). Each bite lands with a shake, a small zoom punch, a tilt
    away from the bitten side and a few tiny crumbs (Joey: "impactful subtle
    shake, zoom, and alternate rotations... very subtle apple crumbs").
  - Seventh round: bites are now flat cut-outs straight out of the photo
    (no flesh layer), bigger, slower and edged with uneven tooth scoops; the
    apple grows with each bite. See "seventh round" below. The big right bite
    still sits low on purpose so it never touches the leaf.
  - Only the hero's first frame and the fonts gate the exit (it used to wait
    for all 16 frames, 3.5 MB, which held phones on the splash for 10s+). The
    flipbook already holds on frame one until the rest decode.
  - Full meal on the first visit per session (~5.5s since the seventh round); coming back to home in
    the same visit skips straight to the opening (~0.6s); reduced motion gets
    a plain fade. A 10s hard stop means nobody is ever left on black.
- **Work thumbs show in colour on phones.** They only coloured on hover, and
  touch screens never hover, so every card was grey on a phone. Now
  `@media (hover: none)` shows them in full colour.
- **Checked, with headless Chrome (`Claude tools/qa.mjs`)**: home, Studio,
  Contact and Kioni at 375x812 (phone emulation), 1440x650 and 1920x1200, with
  the ScrollSmoother path actually on at desktop sizes (the script fakes a
  mouse, since headless has none). No horizontal overflow, no reveal left
  hidden in view, the menu opens, covers the screen, closes on Escape and
  releases the scroll lock. Only console error: no favicon (404).
  The splash was played through frame by frame with `Claude tools/splashrec.mjs`
  at 1440x900, 1440x650 and 375x812, including the same-visit reload.
  Use these instead of the in-app browser when the session isn't on screen:
  a hidden pane stops animating and reports everything as broken.

**Open questions (owner: Joey)**
- ~~CMBT Hydrate can photos: did we design that can?~~ Closed 18 Nov: yes, all CMBT work is ours (Joey).
- Client OK needed for testimonials.
- No results for Good Apples-era projects.
- No team or studio photos.

## Layout

```
index.html            markup for every section
assets/css/style.css  all styling, numbered sections in the header comment
assets/js/main.js     preloader, smooth scroll, hero hover, banner flipbook, cursor
assets/fonts/         Archivo variable (OFL). The wordmark is the Condensed
                      ExtraBold instance, wdth 75% / wght 800
assets/vendor/        GSAP + ScrollTrigger + ScrollSmoother, Swiper
assets/img/hero/      hero grid thumbnails, cropped per subject
assets/img/banner/    16 frames for the full-bleed flipbook band
images/               original uncropped source images
```

## Notes

- Layout and motion follow the Pixora "Design Studio" template; class names are
  kept from it so the two can be diffed.
- Smooth scrolling is GSAP ScrollSmoother, so anything needing parallax takes a
  `data-speed` attribute rather than bespoke scroll maths.
- The banner flipbook speed is `FRAME_MS` at the top of its block in `main.js`.
- Brand colours live as custom properties at the top of `style.css`
  (`--ga-black`, `--ga-green-light`).
- Creative direction (Joey's brief, 26 Aug 2026):
  - Design, structure and motion: a hybrid of motionsickness.company and the
    Pixora WordPress theme family (any Pixora variation, not one exact page).
  - Copy: Good Apples' own positioning, reworked, inspired by the tone of Motion
    Sickness and Jack Nimble. Nothing copied from either.
  - Motion Sickness: liked for copy, tone, positioning and design.
    Jack Nimble: copy, tone and positioning only; its design is "a bit basic".
  - Imagery can come from good-apples.com.au or Joey's Desktop.
  - Joey says Martin liked these two references (recorded 17 Nov 2026).
- Content sources for the full prototype (researched 17 Nov 2026):
  - Old good-apples.com.au copy is not to be trusted (Joey). Services should
    reflect real work from the inbox plus PeriscoPe's services, in a less nerdy
    voice. Good Apples is essentially a creative sub-agency of PeriscoPe.
  - Real work since May 2025, per inbox: websites/Shopify, email/CRM, packaging,
    brand identity, video/motion, ad creative, decks, 3D renders, merch.
    Email/CRM, decks and 3D aren't in the current six services.
  - Best case-study copy: Drive deck "Good Apples Project Showcase" (Sept 2025),
    and the Kioni case study PDF in Desktop/Good Apples/Case Studies. The Brand
    Deck case-study pages are lorem ipsum.
  - Hero-ready assets: Desktop/Good Apples/Web/Assets, Desktop/Archive/<client>,
    and Desktop/Good Apples/Web/GIF Full Bleed.
  - Strongest set: Healthy Rituals, Kioni, ELMNT H3O, Outer Bound,
    Harvest & Halo, Take Me Wellness, TreeArc, Seed Sticks.
  - Brand guidelines PDF is in Desktop/Good Apples/Brand Assets: Archivo Narrow
    Bold + Neue Haas Grotesk Display; Skin Green #9DC93B, Core Green #0D3B01,
    Pulp White #F3F2EE, Plum #40303A. The site currently uses #AAE060.
- Work section format (17 Nov 2026): like Motion Sickness, every project
  gets its own short page (a hook, the client, about 150 words, a hero video
  and images). There is no separate case studies section.
- Work list, per Joey (17 Nov 2026):
  - Out: Zinc Club, Caffeination, Seed Sticks (a fun ecom product, not work).
  - In: ICONIC, Veteran Games, Fjord, Zesty Paws, Bikechain, Rygg (whole
    website plus packaging), She Means Business, BSKT, Sprout, CMBT. Joey says
    BSKT, Sprout and CMBT were bigger jobs than the asset search suggested.
  - Light: Harvest & Halo (not much to show).
  - Hero standard (Joey, 17 Nov 2026):
    - Every project hero is a high-quality full-bleed photo or video.
    - No ad cards, fake mockups on white, AI or stock-mockup renders, or
      dated or amateur design.
    - Heroes can be brand or client photography ("even if it isn't photos we
      took ourselves").
    - Case study galleries show our strongest real work: photography, real
      packaging, websites, socials.
  - Contact sheet "Desktop/Good Apples/Web/Work hero picks (17 Nov).jpg"
    accepted by Joey as good enough for now (17 Nov 2026, v3). Heroes can be
    revisited during the build.
    - v1 rejected for CMBT, Zesty Paws, BikeChain, Kioni and Veteran Games.
    - v2 heroes:
      - Veteran Games: ninja wall event photo.
      - Kioni: shoot close-up, from Drive Kioni/Content/Shoot 1/Photos edited.
      - Zesty Paws: licensed stock of a dog in a field.
      - BikeChain: Santini SS25 film still.
      - Fjord and Rygg: live-site heroes.
      - Healthy Rituals: shoot still DSC09248.
    - v3 adds CMBT and BSKT, re-dug for real photography, packaging, web and
      socials ("best of the best", Joey):
      - CMBT hero: Volkanovski interview still (2022).
      - BSKT hero: Native Davidson Plum pouches (2022).
      - Shortlists are in Desktop/Good Apples/Web/Assets/CMBT/Best picks (Nov
        2026) (15 files) and Assets/BSKT/Best picks (Nov 2026) (13 files).
      - Kioni shoot originals are in Assets/Kioni/Shoot originals (Drive).
      - The live cmbt.com.au is a 2025 rebuild, not HYPE's design; don't use
        it. The live BSKT site still matches HYPE's 2022 design.
      - Closed 18 Nov: the CMBT Hydrate can photos (May 2024, from CMBT's own
        Drive) are our design. Joey: "yes anything cmbt we did".
  - Live-site scroll videos (1440x900, about 14–16 s each) are in
    Desktop/Good Apples/Web/Assets/<client>/ for Rygg, Veteran Games and Fjord.
  - Caveats found:
    - Zesty Paws pack renders were supplied by the client, not made by us.
    - BikeChain and ICONIC imagery is brand or press photography we treated.
    - Veteran Games event photos are Litl Creative's.
    - Real results exist for Veteran Games (2027 Partnership Report/HANDOFF.md)
      and She Means Business (SMB Final Report on Drive).
    - Sprout, CMBT and BSKT assets live mainly on Drive (HYPE folders).
  - Rygg: the old laptop/phone mockups are out of date (Joey, 17 Nov). The
    hero is now Rygg's own campaign photo (Joey, 18 Nov: no screenshot
    heroes), and the live-site scroll video sits in the gallery. A live-site
    scroll video works in any web project's gallery.
- Open questions (owner: Joey/Martin):
  - No results or numbers exist for any Good Apples-era project.
  - Client testimonials found in email need each client's OK before going live.
  - There's no Good Apples team or studio photography; PeriscoPe headshots exist.
- References stay as Motion Sickness and Jack Nimble (Joey, 17 Nov 2026). A
  wider board of 12 agency sites was built and set aside:
  https://claude.ai/artifact/XbQdqnJxgyHgCc13KKpGdB

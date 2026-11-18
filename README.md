# Good Apples Website 2.0

Static marketing site for Good Apples. No build step: open `index.html`, or serve
the folder over HTTP (the fonts need a real origin, so `file://` won't do).

```bash
python3 -m http.server 4321
```

## Handoff (updated 17 Nov 2026)

Read this first when picking the project up, from either Claude account.

**Where it's up to**
- The site is a one-page homepage: hero, statement, banner flipbook, values
  ticker, services, work index, manifesto, footer.
- It IS deployed, despite what this note said before 17 Nov:
  https://thisisperiscope.github.io/good-apples-website-2.0/ returns 200.
  GitHub Pages serves main from the repo root. Assets carry a `?v=` stamp
  (currently 20261118o); bump it in index.html, studio.html, contact.html
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
- Nine pages still to build: ICONIC Beverages, BikeChain, Fjord, Zesty Paws,
  Pharmacy Guild, TreeArc, Rygg, Take Me Wellness, ELMNT H3O. Their facts are
  being gathered, with sources, into `Desktop/Good Apples/Web/Project facts/`
  (private: not in the public repo). Write their copy only from those files.
- Favicon and touch icon added (made from the splash apple); the console 404
  is gone.

**Next: the remaining ten project pages**
1. Copy research still to do:
   - Drive deck "Good Apples Project Showcase" (Sept 2025). Not yet read.
   - Drive "SMB - Final Report". Not yet read.
   - Kioni: DONE. Full copy extracted to the scratchpad from
     `Desktop/Good Apples/Case Studies/Good Apples Case Study - Kioni Skin.pdf`
     (use pdftotext -layout; pdfplumber and pypdf are not installed, pdftotext
     is at /opt/homebrew/bin). Story: founder Maria Mandroules, ex ED nurse
     practitioner, two kids with eczema, microbiome and the gut-skin-brain
     axis. Name from Kioni, a village on Ikaria, a Blue Zone. Design route:
     classic blue and white Greek pottery crossed with illustrations of
     microbiomes and cells.
   - Veteran Games: DONE, numbers verified in
     `Desktop/Veteran Games/2027 Partnership Report/HANDOFF.md`. 2026 had four
     events; 367 competitor entries; Finals 11 teams from AUS/UK/USA at
     Sunshine Coast Stadium; 3,001 live stream views; 376K IG views over Finals
     weekend; 52 media items, 1,554,691 reach, $764,261 ASR; Chin-Up Challenge
     raised $51,065 across the year. Survey n=11 so quote it as a small sample
     or not at all.
     **Before writing any VG copy, read the whole VG Tone of Voice sheet**
     (spreadsheet 1iphskWF1R6_cHF6qhK1MQGsDI0-gBJ8aeWXVnwnziwQ, all four tabs,
     download as .xlsx because the connector only shows the first rows).
2. Disciplines per project are deliberately NOT on the cards yet. Only the name
   and year are shown, because both are real. Do not guess disciplines; take
   them from the showcase deck.
3. Ten projects still have no copy at all: ICONIC Beverages, BikeChain, Fjord,
   Zesty Paws, Pharmacy Guild, TreeArc, Rygg, Take Me Wellness, ELMNT H3O.
   Worth digging: `Good Apples Case Studies 2.0.xd` (Aug 2026) and the inbox.
   Leave a card unlinked rather than inventing a description for it.
4. Then the Studio page and the Contact page.
5. Check desktop, phone and 1440x650 before showing Joey, and read the two
   faults above first so they are not reintroduced.

**Where things live**
- Hero contact sheet: Desktop/Good Apples/Web/Work hero picks (17 Nov).jpg.
  Rebuild it with Claude tools/build_sheet.py and hero-picks.tsv. Every path in
  the .tsv is a real file.
- Assets: Desktop/Good Apples/Web/Assets/<client>/
  - CMBT and BSKT: "Best picks (Nov 2026)"
  - Kioni: "Shoot originals (Drive)"
  - Fjord, Rygg and Veteran Games: site scroll videos and homepage stills
  - Sprout: brand video and frame
  - Pharmacy Guild: frame, in Pharma
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
  - sheet.py and build_sheet.py make contact sheets.
  - qa.mjs: headless QA pass per page and size (overflow, hidden reveals,
    menu, console errors, a screenshot per scroll step).
  - splashrec.mjs: records a page load as a strip of screenshots, to play the
    splash through frame by frame.
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
  The hero is 100svh of the cycling frames with the GOOD / APPLES lockup
  over it, inverted to cream, plus a three line rotator (Good Work / By Good
  People / For Good People). The markup still uses `.ga-banner-img` and
  `.ga-banner-frames`, so the frame cycling and the no-smoother parallax
  fallback kept working untouched.
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
  hero mark were both on screen at once. The hero wordmark now lives in a
  fixed dock (`#ga_wordmark`, section 23 of the CSS, section 11 of main.js)
  outside `#smooth-wrapper`, and is flown into the nav slot on scroll: the two
  words scale and translate to land exactly on the header's two logo lines,
  while the green bar, tagline and rotating line fade out as hero furniture.
  At the end the dock hides and the real header logo takes over, so only one
  mark exists at any moment. It reverses fully on the way back up.
  - It must live outside `#smooth-wrapper`: ScrollSmoother transforms
    `#smooth-content`, and a transformed ancestor makes `position: fixed`
    behave like `absolute`.
  - The header is pinned visible and transparent for the whole flight
    (`logo-pending`), or the mark would land on a header that had slid away.
  - It stays visible for 240px past the hero before it can hide again,
    otherwise the landing was snatched away the instant it happened.
  - **The target is measured with transitions suppressed.** `.is-stuck` drops
    the header's padding-top 40 -> 18 and that property is transitioned, so
    measuring straight after adding the class read the old padding and the
    mark jumped 22px on handover. Verified landing delta is now [0,0,0] on
    both words.
- **Work thumbs colour on hover again.** The ten unlinked cards had been
  locked to greyscale to flag they have no page; that rule had equal
  specificity to the hover rule and sat later in the file, so it won. Ten of
  eighteen cards never came to life and the grid read as broken. Lock removed.
- **Flipbook: 220ms a frame** (was 175). Joey: "gif is a bit too rapid".
- Joey on the hero copy, 18 Nov: "good work for good people or human led
  agency, or that green line, all can be adjusted / moved / removed if
  needed... not attached tho those, but appreciate some detailed contextual
  text or elements". So the strapline, tagline and green bar are all free to
  change; he just wants *some* supporting detail there.

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
  - Bites cut the photo slightly deeper than a flesh-toned copy underneath,
    so a thin crescent of flesh shows along the tooth marks, tapering at the
    ends. The big right bite sits low on purpose so it never touches the leaf.
  - Only the hero's first frame and the fonts gate the exit (it used to wait
    for all 16 frames, 3.5 MB, which held phones on the splash for 10s+). The
    flipbook already holds on frame one until the rest decode.
  - Full meal on the first visit per session (~3.5s); coming back to home in
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
- CMBT Hydrate can photos (May 2024): did we design that can?
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
      - Open (Joey): the CMBT Hydrate can photos are a May 2024 shoot from
        CMBT's own Drive. Confirm we designed that can before they go live.
  - Live-site scroll videos (1440x900, about 14–16 s each) are in
    Desktop/Good Apples/Web/Assets/<client>/ for Rygg, Veteran Games and Fjord.
  - Caveats found:
    - Zesty Paws pack renders were supplied by the client, not made by us.
    - BikeChain and ICONIC imagery is brand or press photography we treated.
    - Veteran Games event photos are Litl Creative's.
    - Real results exist for Veteran Games (2027 Partnership Report/HANDOFF.md)
      and She Means Business (SMB Final Report on Drive).
    - Sprout, CMBT and BSKT assets live mainly on Drive (HYPE folders).
  - Rygg: the old laptop/phone mockups are out of date (Joey, 17 Nov). The hero
    is now a scroll video of the live rygg.au, saved in
    Desktop/Good Apples/Web/Assets/Rygg as "Rygg site scroll (Nov 2026).mp4"
    (1440x900, 14 s), plus a homepage still. A live-site scroll video works for
    any web project.
- Open questions (owner: Joey/Martin):
  - No results or numbers exist for any Good Apples-era project.
  - Client testimonials found in email need each client's OK before going live.
  - There's no Good Apples team or studio photography; PeriscoPe headshots exist.
- References stay as Motion Sickness and Jack Nimble (Joey, 17 Nov 2026). A
  wider board of 12 agency sites was built and set aside:
  https://claude.ai/artifact/XbQdqnJxgyHgCc13KKpGdB

# Good Apples — Website 2.0

Static marketing site for Good Apples. No build step: open `index.html`, or serve
the folder over HTTP (the fonts need a real origin, so `file://` won't do).

```bash
python3 -m http.server 4321
```

## Layout

```
index.html            markup for every section
assets/css/style.css  all styling, numbered sections in the header comment
assets/js/main.js     preloader, smooth scroll, hero hover, banner flipbook, cursor
assets/fonts/         Archivo variable (OFL) — the wordmark is the Condensed
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

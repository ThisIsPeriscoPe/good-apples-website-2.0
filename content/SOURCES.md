# Project copy: what is sourced and what is missing

Every line of body copy on a project page must come from one of these. Do not
invent descriptions, disciplines, stockists or numbers.

## Sourced and written (8 pages live)

From the Drive deck **"Good Apples Project Showcase"** (Sept 2025,
`10LrJlxDgj0zmYfGPvF_k0dBDzbZw40cvzffqLfwUVCY`). The "GSM Consultants" copy of
the same deck is identical apart from the cover, so there is nothing extra in it.

- She Means Business, Healthy Rituals, Kioni, BSKT, Harvest & Halo, CMBT,
  Sprout, Outer Bound.
- The deck also gives each project its real discipline list. Those lists are
  what the pages show. It covers four more brands that are not in the 18:
  Good Sleep Co, Switch Nutrition, Super Cubes, Before You Speak.

**Kioni** also has the full case study PDF in
`Desktop/Good Apples/Case Studies/Good Apples Case Study - Kioni Skin.pdf`.
Raw text is in `kioni-case-study-raw.txt` next to this file. Extract with
`/opt/homebrew/bin/pdftotext -layout` (pdfplumber and pypdf are not installed).

## Veteran Games (written 18 Nov 2026)

- Every line traces to `Desktop/Veteran Games/2027 Partnership Report/HANDOFF.md`:
  the purpose line quotes the VG website's Our Purpose page as recorded there
  ("proactive health initiative designed to address key findings from the
  Royal Commission into Defence and Veteran Suicide"); the 2026 events, 11
  Finals Teams from Australia, the UK and the USA, 376K Instagram views over
  Finals weekend, website visitors 28x the weekend before; and Joey's design
  and web delivery list (VeteranGames.com, 18 stadium screen sequences, 21
  sponsor lower thirds + 31 awards/presenter/winner graphics, 12 team intro
  films, 12 billboards, stage sponsor wall, 35 emails).
- Written after reading every row of the VG Tone of Voice sheet (18 Nov).
  It follows R29 (purpose first; reach is evidence, not the story), R01 (no
  grit), R02/R03 (Veterans in full, never "the Games"), R05 (the Finals),
  R07 (VeteranGames.com) and R28 (no em dashes). The standard description is
  the sheet's own: "Australia's premier military-inspired team competition
  for Veterans".
- The merch billboard frame was left out of the gallery on purpose: its line
  "Every order backs the Veteran Games" breaks R22 (Support, not Back).

## Galleries (18 Nov 2026)

Each project page now ends with a gallery built by
`Desktop/Good Apples/Web/Claude tools/build_pages.py` from
`Claude tools/site-pages.json`, which lists every source file. Media is
cropped, resized and compressed into `assets/img/work/<slug>/` and
`assets/video/`. Galleries carry alt text only, no captions or claims.

## No copy yet (9 projects, being sourced 18 Nov into Desktop/Good Apples/Web/Project facts/)

ICONIC Beverages, BikeChain, Fjord, Zesty Paws, Pharmacy Guild, TreeArc, Rygg,
Take Me Wellness, ELMNT H3O.

These are all 2024 or later, so they post-date the Sept 2025 showcase deck.
Their cards are deliberately rendered without links until copy exists, so the
index has no dead links. Places worth digging:
- `Desktop/Good Apples/Case Studies/Good Apples Case Studies 2.0.xd` (Aug 2026)
- The inbox, which is where the 2025-26 work was found in the first place
- Drive "SMB - Final Report" is She Means Business results, not new copy

## Facts worth keeping (from the showcase deck)

- Good Apples: inception 2016, rebrands 2018 and 2024.
- Owned and operated by PeriscoPe, the broader agency group.
- Studio address: 1/76 Township Dr, Burleigh Heads QLD 4220.
- The five values on the site's ticker are the deck's own: Expert Operators,
  Honesty & Transparency, Wellness Driven, Active Lifestyles, No Bad Humans.
  The Sept 2025 deck says "Expert Operators"; the live site said "Skilled
  Operators". **Joey's call, 18 Nov 2026: "Skilled Operators" wins.** It is
  what the home page ticker, the Studio values list and the manifesto all use.
  Do not switch it back to the deck's wording.
- **Phone: 0450 534 610.** Joey's call, 18 Nov 2026, in answer to this file
  noting that no number existed anywhere in the project. It is Martin Corr's
  (PeriscoPe Managing Partner) number, taken from his own email signature,
  which is the same in every email he sends. Joey's own signature already
  points people at Martin for anything urgent. Written as `0450 534 610` and
  linked as `tel:+61450534610`, because the signature's "(+61) 0450 534 610"
  is not a dialable format.

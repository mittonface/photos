# Photo Blog Design

A simple personal photography blog hosted on GitHub Pages at `photos.mittn.ca`.

## Overview

Single-page photo gallery built with Hugo. Drop photos into a folder with YAML sidecar files for metadata. GitHub Actions auto-deploys on push.

## Project Structure

```
photos/
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions build & deploy
├── content/
│   └── _index.md             # Homepage intro text (optional)
├── static/
│   ├── photos/               # Photo images + metadata
│   │   ├── sunset.jpg
│   │   ├── sunset.yaml
│   │   └── ...
│   └── CNAME                 # Custom domain: photos.mittn.ca
├── layouts/
│   └── index.html            # Main template - renders grid
├── assets/
│   └── css/
│       └── main.css          # Styling
├── config.toml               # Hugo config
└── README.md
```

## Adding Photos

1. Drop `myphoto.jpg` into `static/photos/`
2. Create `myphoto.yaml`:
   ```yaml
   caption: "Morning fog in the hills"
   date: 2024-06-10
   location: "Marin County, CA"
   tags:
     - landscape
     - nature
   ```
3. Commit and push - auto-deploys

## Gallery Features

- **Layout**: Responsive grid (3 columns desktop, 2 tablet, 1 mobile)
- **Sorting**: By date, newest first
- **Tag filtering**: Click tags to filter, click again to clear
- **Lightbox**: Click photo for fullscreen view with navigation
- **Metadata display**: Caption, date, location, tags shown on each photo

## Visual Design

**Colors:**
- Background: `#ffffff`
- Text: `#1a1a1a`
- Secondary (date/location): `#666666`
- Tags: `#f0f0f0` background, `#333` text

**Typography:**
- System font stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- Captions: 16px medium
- Date/location: 14px regular
- Site title: 24px light

**Layout:**
- Max width: 1200px centered
- Grid gap: 16px
- Cards: No border, subtle shadow on hover
- Photos: Original aspect ratio preserved

**Lightbox:**
- Overlay: `rgba(0,0,0,0.9)`
- White caption text
- Keyboard navigation (arrows, escape)

## Deployment

**GitHub Actions workflow:**
- Trigger: Push to `main`
- Build: `peaceiris/actions-hugo`
- Deploy: `peaceiris/actions-gh-pages`

**DNS setup (manual):**
- CNAME record: `photos.mittn.ca` → `<username>.github.io`

**GitHub repo settings:**
- Pages source: GitHub Actions

## Out of Scope

- RSS feed
- Search
- Comments
- Analytics
- Dark mode
- Individual photo pages

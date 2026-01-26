# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal photo blog at [photos.mittn.ca](https://photos.mittn.ca). A Hugo-based static photo gallery with masonry layout, tag filtering, and lightbox viewer.

## Commands

```bash
hugo serve          # Dev server at localhost:1313 with live reload
hugo                # Build static site to public/
hugo --minify       # Production build with optimization
```

Deployment is automatic via GitHub Actions on push to `main`.

## Architecture

### Photo Storage Pattern

Photos are hosted on S3 with CloudFront CDN (`photo-cdn.mittn.ca`). Metadata lives in `static/photos/`:
- Metadata file: `photo-name.yaml` (contains `url` pointing to CDN)
- Image files are NOT stored in git

The YAML contains `caption`, `date`, `location`, `tags` array, and `url` (CDN link).

### Adding New Photos

1. Add photo + YAML to `staging/` folder
2. Push to `main`
3. GitHub Action uploads to S3, moves YAML to `static/photos/` with `url` field

See `staging/README.md` for details.

### Hugo Template Processing

`layouts/index.html` scans `static/photos/` for YAML files, uses the `url` field for image source (falls back to local path for legacy photos), sorts by date (newest first), and renders the grid.

### Tag System

`data/tagcategories.yaml` organizes tags into categories (Places, Wildlife, Themes, Culture, Mood). The template renders collapsible tag groups. Uncategorized tags appear in "Other".

### Frontend

Vanilla JavaScript in `assets/js/main.js` handles:
- Macy.js masonry layout initialization and recalculation
- Single-select tag filtering with URL state
- Lightbox with keyboard navigation (arrows, Escape)
- Collapsible tag category headers

### Key Files

| File | Purpose |
|------|---------|
| `layouts/index.html` | Photo grid template with YAML loading logic |
| `assets/js/main.js` | All frontend interactivity (~140 lines) |
| `assets/css/main.css` | Styling for grid, cards, lightbox, tags |
| `data/tagcategories.yaml` | Tag organization by category |
| `config.toml` | Hugo config (baseURL, title) |
| `.github/workflows/process-photos.yml` | Uploads staging photos to S3 |
| `staging/` | Drop zone for new photos |
| `scripts/migrate-to-s3.sh` | One-time migration of existing photos |

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

Photos use a sidecar file convention in `static/photos/`:
- Image file: `photo-name.jpg`
- Metadata file: `photo-name.yaml`

The YAML contains `caption`, `date`, `location`, and `tags` array.

### Hugo Template Processing

`layouts/index.html` scans `static/photos/` for images, loads matching YAML metadata, merges them into photo objects, sorts by date (newest first), and renders the grid.

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

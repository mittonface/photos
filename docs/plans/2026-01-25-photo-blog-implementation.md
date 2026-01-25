# Photo Blog Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a Hugo-based photo gallery that auto-deploys to photos.mittn.ca via GitHub Pages.

**Architecture:** Single-page gallery using Hugo templates. Photos stored in `static/photos/` with YAML sidecar files for metadata. Hugo template scans for images and renders a responsive grid with tag filtering and lightbox.

**Tech Stack:** Hugo, vanilla CSS, vanilla JavaScript, GitHub Actions

---

### Task 1: Initialize Hugo Site

**Files:**
- Create: `config.toml`
- Create: `content/_index.md`
- Create: `static/CNAME`

**Step 1: Create Hugo config**

Create `config.toml`:

```toml
baseURL = "https://photos.mittn.ca/"
languageCode = "en-us"
title = "Photos"

[markup]
  [markup.goldmark]
    [markup.goldmark.renderer]
      unsafe = true
```

**Step 2: Create homepage content**

Create `content/_index.md`:

```markdown
---
title: "Photos"
---
```

**Step 3: Create CNAME for custom domain**

Create `static/CNAME`:

```
photos.mittn.ca
```

**Step 4: Verify Hugo builds**

Run: `hugo`
Expected: Build succeeds, creates `public/` directory

**Step 5: Commit**

```bash
git add config.toml content/_index.md static/CNAME
git commit -m "feat: initialize Hugo site with config"
```

---

### Task 2: Create Base Layout Template

**Files:**
- Create: `layouts/_default/baseof.html`

**Step 1: Create base template**

Create `layouts/_default/baseof.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ .Site.Title }}</title>
  {{ $style := resources.Get "css/main.css" | minify }}
  <link rel="stylesheet" href="{{ $style.Permalink }}">
</head>
<body>
  <div class="container">
    <header>
      <h1>{{ .Site.Title }}</h1>
    </header>
    <main>
      {{ block "main" . }}{{ end }}
    </main>
  </div>
  {{ $js := resources.Get "js/main.js" | minify }}
  <script src="{{ $js.Permalink }}"></script>
</body>
</html>
```

**Step 2: Commit**

```bash
git add layouts/_default/baseof.html
git commit -m "feat: add base layout template"
```

---

### Task 3: Create CSS Styles

**Files:**
- Create: `assets/css/main.css`

**Step 1: Create stylesheet**

Create `assets/css/main.css`:

```css
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: #ffffff;
  color: #1a1a1a;
  line-height: 1.5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
}

header h1 {
  font-size: 24px;
  font-weight: 300;
  margin-bottom: 24px;
}

/* Tag Filter Bar */
.tag-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.tag-filter {
  background: #f0f0f0;
  color: #333;
  border: none;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.tag-filter:hover {
  background: #e0e0e0;
}

.tag-filter.active {
  background: #333;
  color: #fff;
}

/* Photo Grid */
.photo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

@media (max-width: 900px) {
  .photo-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .photo-grid {
    grid-template-columns: 1fr;
  }
}

/* Photo Card */
.photo-card {
  cursor: pointer;
  transition: box-shadow 0.2s;
}

.photo-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.photo-card img {
  width: 100%;
  height: auto;
  display: block;
}

.photo-card .caption {
  font-size: 16px;
  font-weight: 500;
  margin-top: 8px;
}

.photo-card .meta {
  font-size: 14px;
  color: #666666;
  margin-top: 4px;
}

.photo-card .tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 8px;
}

.photo-card .tag {
  background: #f0f0f0;
  color: #333;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

/* Lightbox */
.lightbox {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.lightbox.active {
  display: flex;
}

.lightbox img {
  max-width: 90%;
  max-height: 80%;
  object-fit: contain;
}

.lightbox .lightbox-caption {
  color: #fff;
  text-align: center;
  margin-top: 16px;
  padding: 0 16px;
}

.lightbox .lightbox-caption .caption {
  font-size: 18px;
  font-weight: 500;
}

.lightbox .lightbox-caption .meta {
  font-size: 14px;
  color: #ccc;
  margin-top: 4px;
}

.lightbox .close {
  position: absolute;
  top: 20px;
  right: 20px;
  color: #fff;
  font-size: 32px;
  cursor: pointer;
  background: none;
  border: none;
}

.lightbox .nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;
  font-size: 48px;
  cursor: pointer;
  background: none;
  border: none;
  padding: 20px;
}

.lightbox .nav.prev {
  left: 10px;
}

.lightbox .nav.next {
  right: 10px;
}

.lightbox .nav:hover {
  color: #ccc;
}
```

**Step 2: Commit**

```bash
git add assets/css/main.css
git commit -m "feat: add CSS styles for grid, cards, and lightbox"
```

---

### Task 4: Create Homepage Template with Photo Grid

**Files:**
- Create: `layouts/index.html`

**Step 1: Create homepage template**

Create `layouts/index.html`:

```html
{{ define "main" }}
{{- $photos := slice -}}
{{- $photoFiles := readDir "static/photos" -}}
{{- range $photoFiles -}}
  {{- if or (strings.HasSuffix .Name ".jpg") (strings.HasSuffix .Name ".jpeg") (strings.HasSuffix .Name ".png") (strings.HasSuffix .Name ".webp") -}}
    {{- $baseName := replaceRE "\\.(jpg|jpeg|png|webp)$" "" .Name -}}
    {{- $yamlPath := printf "static/photos/%s.yaml" $baseName -}}
    {{- $meta := dict "caption" $baseName "date" "" "location" "" "tags" slice -}}
    {{- if fileExists $yamlPath -}}
      {{- $meta = readFile $yamlPath | transform.Unmarshal -}}
    {{- end -}}
    {{- $photo := dict "file" .Name "src" (printf "/photos/%s" .Name) "caption" (default $baseName $meta.caption) "date" (default "" $meta.date) "location" (default "" $meta.location) "tags" (default slice $meta.tags) -}}
    {{- $photos = $photos | append $photo -}}
  {{- end -}}
{{- end -}}

{{- $sortedPhotos := sort $photos "date" "desc" -}}

{{/* Collect all unique tags */}}
{{- $allTags := slice -}}
{{- range $sortedPhotos -}}
  {{- range .tags -}}
    {{- if not (in $allTags .) -}}
      {{- $allTags = $allTags | append . -}}
    {{- end -}}
  {{- end -}}
{{- end -}}
{{- $allTags = sort $allTags -}}

{{/* Tag Filter Bar */}}
{{ if gt (len $allTags) 0 }}
<div class="tag-filters">
  {{- range $allTags }}
  <button class="tag-filter" data-tag="{{ . }}">{{ . }}</button>
  {{- end }}
</div>
{{ end }}

{{/* Photo Grid */}}
<div class="photo-grid">
  {{- range $sortedPhotos }}
  <div class="photo-card" data-tags="{{ delimit .tags "," }}" data-src="{{ .src }}" data-caption="{{ .caption }}" data-date="{{ .date }}" data-location="{{ .location }}">
    <img src="{{ .src }}" alt="{{ .caption }}" loading="lazy">
    <div class="caption">{{ .caption }}</div>
    <div class="meta">
      {{- if .date }}{{ .date }}{{ end }}
      {{- if and .date .location }} · {{ end }}
      {{- if .location }}{{ .location }}{{ end }}
    </div>
    {{ if .tags }}
    <div class="tags">
      {{- range .tags }}
      <span class="tag">{{ . }}</span>
      {{- end }}
    </div>
    {{ end }}
  </div>
  {{- end }}
</div>

{{/* Lightbox */}}
<div class="lightbox" id="lightbox">
  <button class="close" aria-label="Close">&times;</button>
  <button class="nav prev" aria-label="Previous">&lsaquo;</button>
  <button class="nav next" aria-label="Next">&rsaquo;</button>
  <img src="" alt="">
  <div class="lightbox-caption">
    <div class="caption"></div>
    <div class="meta"></div>
  </div>
</div>
{{ end }}
```

**Step 2: Commit**

```bash
git add layouts/index.html
git commit -m "feat: add homepage template with photo grid and lightbox markup"
```

---

### Task 5: Create JavaScript for Tag Filtering and Lightbox

**Files:**
- Create: `assets/js/main.js`

**Step 1: Create JavaScript**

Create `assets/js/main.js`:

```javascript
(function() {
  // Tag filtering
  const tagButtons = document.querySelectorAll('.tag-filter');
  const photoCards = document.querySelectorAll('.photo-card');
  let activeTag = null;

  tagButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tag = button.dataset.tag;

      if (activeTag === tag) {
        // Clear filter
        activeTag = null;
        button.classList.remove('active');
        photoCards.forEach(card => card.style.display = '');
      } else {
        // Apply filter
        activeTag = tag;
        tagButtons.forEach(b => b.classList.remove('active'));
        button.classList.add('active');

        photoCards.forEach(card => {
          const cardTags = card.dataset.tags.split(',');
          if (cardTags.includes(tag)) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      }
    });
  });

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption .caption');
  const lightboxMeta = lightbox.querySelector('.lightbox-caption .meta');
  const closeBtn = lightbox.querySelector('.close');
  const prevBtn = lightbox.querySelector('.nav.prev');
  const nextBtn = lightbox.querySelector('.nav.next');

  let currentIndex = 0;

  function getVisiblePhotos() {
    return Array.from(photoCards).filter(card => card.style.display !== 'none');
  }

  function showPhoto(index) {
    const visiblePhotos = getVisiblePhotos();
    if (visiblePhotos.length === 0) return;

    currentIndex = (index + visiblePhotos.length) % visiblePhotos.length;
    const card = visiblePhotos[currentIndex];

    lightboxImg.src = card.dataset.src;
    lightboxImg.alt = card.dataset.caption;
    lightboxCaption.textContent = card.dataset.caption;

    const date = card.dataset.date;
    const location = card.dataset.location;
    let meta = '';
    if (date) meta += date;
    if (date && location) meta += ' · ';
    if (location) meta += location;
    lightboxMeta.textContent = meta;
  }

  function openLightbox(index) {
    showPhoto(index);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  photoCards.forEach((card, index) => {
    card.addEventListener('click', () => {
      const visiblePhotos = getVisiblePhotos();
      const visibleIndex = visiblePhotos.indexOf(card);
      openLightbox(visibleIndex);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', () => showPhoto(currentIndex - 1));
  nextBtn.addEventListener('click', () => showPhoto(currentIndex + 1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPhoto(currentIndex - 1);
    if (e.key === 'ArrowRight') showPhoto(currentIndex + 1);
  });
})();
```

**Step 2: Commit**

```bash
git add assets/js/main.js
git commit -m "feat: add JavaScript for tag filtering and lightbox"
```

---

### Task 6: Add Sample Photos for Testing

**Files:**
- Create: `static/photos/sample1.yaml`
- Create: `static/photos/sample2.yaml`

**Step 1: Create photos directory and sample metadata**

We'll use placeholder images from the web for testing. Create two sample YAML files.

Create `static/photos/sample1.yaml`:

```yaml
caption: "Mountain sunrise"
date: "2025-06-15"
location: "Colorado, USA"
tags:
  - landscape
  - mountains
```

Create `static/photos/sample2.yaml`:

```yaml
caption: "City streets at night"
date: "2025-04-22"
location: "Tokyo, Japan"
tags:
  - street
  - night
```

**Step 2: Download sample images**

Run:
```bash
mkdir -p static/photos
curl -L -o static/photos/sample1.jpg "https://picsum.photos/seed/mountain/800/600"
curl -L -o static/photos/sample2.jpg "https://picsum.photos/seed/citynight/800/600"
```

**Step 3: Test Hugo build**

Run: `hugo serve`
Expected: Site builds and serves at localhost:1313, showing 2 photos in grid

**Step 4: Commit**

```bash
git add static/photos/
git commit -m "feat: add sample photos for testing"
```

---

### Task 7: Create GitHub Actions Workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

**Step 1: Create workflow file**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Hugo site to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

defaults:
  run:
    shell: bash

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v3
        with:
          hugo-version: 'latest'
          extended: true

      - name: Build
        run: hugo --minify

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./public

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "feat: add GitHub Actions workflow for deployment"
```

---

### Task 8: Update README with Usage Instructions

**Files:**
- Modify: `README.md`

**Step 1: Update README**

Replace contents of `README.md`:

```markdown
# Photos

Personal photo blog at [photos.mittn.ca](https://photos.mittn.ca)

## Adding Photos

1. Add your image to `static/photos/` (jpg, jpeg, png, or webp)
2. Create a matching `.yaml` file with metadata:

```yaml
caption: "Photo description"
date: "2025-01-25"
location: "City, Country"
tags:
  - tag1
  - tag2
```

3. Commit and push to `main` - site auto-deploys

## Local Development

```bash
hugo serve
```

Site available at http://localhost:1313

## Setup

1. Enable GitHub Pages in repo settings (source: GitHub Actions)
2. Configure DNS: CNAME record `photos.mittn.ca` → `<username>.github.io`
```

**Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add usage instructions to README"
```

---

### Task 9: Final Verification

**Step 1: Run Hugo locally and verify all features**

Run: `hugo serve`

Verify:
- [ ] Site loads at localhost:1313
- [ ] Two sample photos display in grid
- [ ] Tag filter buttons appear and work
- [ ] Clicking photo opens lightbox
- [ ] Arrow keys navigate in lightbox
- [ ] Escape closes lightbox
- [ ] Responsive: resize browser to verify grid changes

**Step 2: Stop server and verify build**

Run: `hugo`
Expected: Build succeeds with no errors

**Step 3: Verify git status is clean**

Run: `git status`
Expected: Nothing to commit, working tree clean

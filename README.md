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

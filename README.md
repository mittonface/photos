# Photos

Personal photo blog at [photos.mittn.ca](https://photos.mittn.ca)

## Adding Photos

1. Add your image to the `staging/` folder (supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`)
2. Create a matching YAML file with the same base name (e.g., `my-photo.jpg` → `my-photo.yaml`):

```yaml
caption: "Photo description"
date: "2025-01-25"
location: "City, Country"
tags:
  - tag1
  - tag2
```

3. Commit and push to `main`

The GitHub Action automatically:
- Uploads the image to S3/CloudFront CDN
- Generates a 600px-wide WebP thumbnail
- Extracts image dimensions (for layout stability)
- Adds `url`, `thumbnail_url`, and dimension fields to your YAML
- Moves the YAML to `static/photos/`
- Deletes the image from `staging/`

**Notes:**
- If you add an image without a YAML file, minimal metadata will be auto-generated
- Duplicate filenames (already in S3) will be skipped to prevent overwrites
- YAML files without matching images will be skipped with a warning

## Available Tags

Tags are organized by category in `data/tagcategories.yaml`. Check that file when adding tags to ensure consistency.

## Local Development

```bash
hugo serve
```

Site available at http://localhost:1313

## Setup

1. Enable GitHub Pages in repo settings (source: GitHub Actions)
2. Configure DNS: CNAME record `photos.mittn.ca` → `<username>.github.io`
3. Set repository secrets for S3 upload: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`

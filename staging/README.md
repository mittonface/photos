# Staging Folder

Add new photos here to upload them to the site.

## How to Add Photos

1. Add your photo file (`.jpg`, `.jpeg`, `.png`, or `.webp`)
2. Add a matching YAML file with the same name (e.g., `my-photo.jpg` + `my-photo.yaml`)
3. Push to `main`

The GitHub Action will automatically:
- Upload the image to S3/CloudFront CDN
- Add the CDN URL to your YAML file
- Move the YAML to `static/photos/`
- Delete the image from this folder

## YAML Format

```yaml
caption: "Description of the photo"
date: "2024-06-25"
location: "Location name"
tags:
  - tag1
  - tag2
```

The `url` field is added automatically - don't include it yourself.

## Notes

- If you add an image without a YAML file, minimal metadata will be generated
- Duplicate filenames (already in S3) will cause the action to fail
- YAML files without matching images will be skipped with a warning

#!/bin/bash
# Migrate existing photos to S3 and update YAML files with CDN URLs
#
# Prerequisites:
#   - AWS CLI configured with credentials
#   - Run from repo root: ./scripts/migrate-to-s3.sh
#
# What this script does:
#   1. Uploads all photos from static/photos/ to S3
#   2. Adds 'url' field to each YAML file
#   3. Optionally deletes local photo files (prompts first)

set -e

BUCKET="bm-new-photo-blog"
CDN_DOMAIN="photo-cdn.mittn.ca"
PHOTOS_DIR="static/photos"

cd "$(dirname "$0")/.."

echo "=== Photo Migration to S3 ==="
echo ""

# Find all image files
shopt -s nullglob
IMAGE_FILES=("$PHOTOS_DIR"/*.jpg "$PHOTOS_DIR"/*.jpeg "$PHOTOS_DIR"/*.png "$PHOTOS_DIR"/*.webp)
shopt -u nullglob

PHOTO_COUNT=${#IMAGE_FILES[@]}
echo "Found $PHOTO_COUNT photo(s) to migrate"
echo ""

if [ "$PHOTO_COUNT" -eq 0 ]; then
    echo "No photos to migrate."
    exit 0
fi

# Upload photos
echo "Uploading photos to S3..."
for img in "${IMAGE_FILES[@]}"; do
    filename=$(basename "$img")
    echo "  Uploading $filename..."
    aws s3 cp "$img" "s3://$BUCKET/$filename" --quiet
done
echo "Done uploading."
echo ""

# Update YAML files
echo "Updating YAML files with CDN URLs..."
for img in "${IMAGE_FILES[@]}"; do
    filename=$(basename "$img")
    base="${filename%.*}"
    yaml_file="$PHOTOS_DIR/$base.yaml"

    if [ -f "$yaml_file" ]; then
        # Check if url already exists
        if grep -q "^url:" "$yaml_file"; then
            echo "  $base.yaml already has url, skipping"
        else
            echo "  Adding url to $base.yaml"
            echo "url: \"https://$CDN_DOMAIN/$filename\"" >> "$yaml_file"
        fi
    else
        echo "  WARNING: No YAML file for $filename"
    fi
done
echo "Done updating YAML files."
echo ""

# Prompt for deletion
echo "Photos are now on S3 and YAML files have been updated."
echo ""
read -p "Delete local photo files from static/photos/? (y/N) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Deleting local photo files..."
    for img in "${IMAGE_FILES[@]}"; do
        rm "$img"
        echo "  Deleted $(basename "$img")"
    done
    echo "Done."
else
    echo "Keeping local photo files."
fi

echo ""
echo "=== Migration complete ==="
echo ""
echo "Next steps:"
echo "  1. Run 'hugo serve' to verify the site works"
echo "  2. Commit and push the changes"

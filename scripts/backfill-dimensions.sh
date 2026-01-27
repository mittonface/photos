#!/bin/bash
# Backfill image dimensions to existing photo YAML files
# Requires: curl, imagemagick (identify command)

set -e

PHOTOS_DIR="static/photos"

# Check dependencies
if ! command -v identify &> /dev/null; then
    echo "Error: ImageMagick (identify) is required but not installed."
    exit 1
fi

if ! command -v curl &> /dev/null; then
    echo "Error: curl is required but not installed."
    exit 1
fi

echo "Backfilling dimensions to YAML files in $PHOTOS_DIR..."

count=0
skipped=0

for yaml_file in "$PHOTOS_DIR"/*.yaml; do
    [ -f "$yaml_file" ] || continue

    # Skip if dimensions already present
    if grep -q "^width:" "$yaml_file"; then
        echo "Skipping $(basename "$yaml_file") - dimensions already present"
        skipped=$((skipped + 1))
        continue
    fi

    # Extract URLs from YAML
    url=$(grep "^url:" "$yaml_file" | sed 's/url: *"\(.*\)"/\1/')
    thumbnail_url=$(grep "^thumbnail_url:" "$yaml_file" | sed 's/thumbnail_url: *"\(.*\)"/\1/')

    if [ -z "$url" ]; then
        echo "Warning: No URL found in $(basename "$yaml_file"), skipping"
        continue
    fi

    echo "Processing $(basename "$yaml_file")..."

    # Create temp files
    tmp_img=$(mktemp)
    tmp_thumb=$(mktemp)

    # Download images
    curl -sL "$url" -o "$tmp_img"

    # Get original dimensions
    width=$(identify -format "%w" "$tmp_img" 2>/dev/null || echo "0")
    height=$(identify -format "%h" "$tmp_img" 2>/dev/null || echo "0")

    # Get thumbnail dimensions if URL exists
    if [ -n "$thumbnail_url" ]; then
        curl -sL "$thumbnail_url" -o "$tmp_thumb"
        thumb_width=$(identify -format "%w" "$tmp_thumb" 2>/dev/null || echo "0")
        thumb_height=$(identify -format "%h" "$tmp_thumb" 2>/dev/null || echo "0")
    else
        # Use original dimensions as fallback
        thumb_width=$width
        thumb_height=$height
    fi

    # Clean up temp files
    rm -f "$tmp_img" "$tmp_thumb"

    # Validate dimensions
    if [ "$width" = "0" ] || [ "$height" = "0" ]; then
        echo "  Warning: Could not extract dimensions, skipping"
        continue
    fi

    # Append dimensions to YAML
    echo "width: $width" >> "$yaml_file"
    echo "height: $height" >> "$yaml_file"
    echo "thumbnail_width: $thumb_width" >> "$yaml_file"
    echo "thumbnail_height: $thumb_height" >> "$yaml_file"

    echo "  Added: ${width}x${height}, thumbnail: ${thumb_width}x${thumb_height}"
    count=$((count + 1))
done

echo ""
echo "Done! Updated $count file(s), skipped $skipped file(s) with existing dimensions."

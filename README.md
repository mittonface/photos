# Photos

A Hugo-based photo gallery site deployed to photos.mittn.ca.

## Prerequisites

### Install Hugo

**macOS (Homebrew):**
```bash
brew install hugo
```

**Windows (Chocolatey):**
```bash
choco install hugo-extended
```

**Linux (Snap):**
```bash
snap install hugo
```

For other installation methods, see the [Hugo installation docs](https://gohugo.io/installation/).

## Development

### Run locally

Start the development server with live reload:

```bash
hugo server -D
```

The site will be available at http://localhost:1313/

### Build for production

Generate the static site:

```bash
hugo
```

Output will be in the `public/` directory.

## Project Structure

```
.
├── config.toml          # Hugo configuration
├── content/             # Markdown content files
│   └── _index.md        # Homepage content
├── layouts/             # HTML templates (coming soon)
├── static/              # Static assets (images, CNAME, etc.)
│   └── CNAME            # Custom domain for GitHub Pages
└── public/              # Generated site (git-ignored)
```
# Peter Mitchell — Portfolio

Personal portfolio site. Static HTML, CSS, and a small amount of vanilla JavaScript —
no build step, no dependencies, no framework.

**Live site:** _(add the URL once GitHub Pages is enabled)_

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Landing page — hero and intro |
| `experience.html` | Work experience, education, technical skills |
| `projects.html` | Projects — websites and web apps built |
| `3d-models.html` | 3D renders |
| `contact.html` | Email (click to copy), GitHub, LinkedIn |

## Structure

```
.
├── index.html, experience.html, projects.html, 3d-models.html, contact.html
├── stylesheet.css      # all styles for every page
├── script.js           # prev/next page arrows, arrow-key navigation, prefetching
├── icons/              # favicon set — svg, png, ico, apple-touch
├── images/             # project thumbnails
├── 3d-renders/         # rendered video clips (mp4)
└── Documents/
    └── Resume.pdf
```

## Notes

- **One stylesheet, one script**, shared by all five pages.
- **Page order** for the prev/next arrows and ← / → keyboard shortcuts is defined by the
  `PAGES` array at the top of `script.js`. Reordering or adding a page means editing that
  list — it is independent of the navbar markup, so update both.
- **Adjacent pages are preloaded** — Chromium prerenders them via the Speculation Rules
  API, other browsers fall back to `<link rel="prefetch">`. An inline script in each
  `<head>` pauses CSS animations while a page is being prerendered so the intro
  animation still plays on arrival rather than finishing in the background.
- **Current page** in the navbar is marked with `aria-current="page"`, which drives the
  amber underline.
- Motion respects `prefers-reduced-motion`.

## Running locally

Any static server works. The pages use relative paths, so opening `index.html`
directly from disk mostly works too:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Deploying

Settings → Pages → deploy from the default branch, root folder. No build step required.

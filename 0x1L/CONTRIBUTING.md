# Contributing to 0x1L

Thanks for considering it — this is a small, intentionally simple codebase, so contributing
should be quick.

## Setup

No build step. Clone the repo, then load it as an unpacked extension:
1. `chrome://extensions`
2. Enable Developer mode
3. Load unpacked → select the repo folder

Edit a file, reload the extension (small refresh icon on its card in `chrome://extensions`),
refresh a test tab, and you'll see your change immediately.

## Where things live

| File | What it does |
|---|---|
| `manifest.json` | extension config, permissions, icons |
| `content.js` | finds `0` characters on the page and wraps them |
| `style.css` | applies the dotted-zero font to wrapped characters |
| `popup.html` / `popup.js` | the toolbar popup UI and its on/off setting |
| `icons/` | toolbar/store icon, three sizes |

## Reporting bugs / requesting features

Open an issue — templates are provided for both and will guide you through what's useful to
include.

## Pull requests

Keep changes focused (one thing per PR is easier to review than five). Since there's no build
step, testing is just: load it unpacked, try it on a real page, confirm nothing else broke.

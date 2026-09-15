// 0x1L — by glyphex
// content script
// Walks the page's text and wraps every digit "0" in a small inline span,
// then style.css renders that span in a font with a built-in dotted zero
// (JetBrains Mono). Nothing else is touched — 1, l, I, and everything else
// render completely normally. Keeps watching for new content (infinite
// scroll, SPA navigation) via MutationObserver.
//
// Design choice: this is a font swap, not a hand-drawn mark. The character
// itself is never altered — selecting/copying the text still copies the
// exact original "0", so wallet addresses, codes, etc. are never at risk.

(function () {
  const SKIP_TAGS = new Set([
    "SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "INPUT", "SELECT",
    "IFRAME", "OBJECT", "CANVAS", "SVG", "CODE", "PRE",
  ]);

  let enabled = true;
  const charRegex = /0/;

  function shouldSkip(el) {
    if (!el || el.nodeType !== Node.ELEMENT_NODE) return false;
    if (SKIP_TAGS.has(el.tagName)) return true;
    if (el.isContentEditable) return true;
    if (el.classList && el.classList.contains("cfz-mark")) return true;
    return false;
  }

  function processTextNode(node) {
    const parent = node.parentNode;
    if (!parent || shouldSkip(parent)) return;
    const text = node.nodeValue;
    if (!text || !charRegex.test(text)) return;

    const frag = document.createDocumentFragment();
    let buffer = "";

    for (const ch of text) {
      if (ch === "0") {
        if (buffer) {
          frag.appendChild(document.createTextNode(buffer));
          buffer = "";
        }
        const span = document.createElement("span");
        span.className = "cfz-mark cfz-zero";
        span.textContent = ch;
        frag.appendChild(span);
      } else {
        buffer += ch;
      }
    }
    if (buffer) frag.appendChild(document.createTextNode(buffer));

    parent.replaceChild(frag, node);
  }

  function walk(root) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      processTextNode(root);
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE) return;
    if (shouldSkip(root)) return;

    // Snapshot children first — processTextNode mutates the tree as we go.
    const kids = Array.from(root.childNodes);
    for (const kid of kids) walk(kid);
  }

  let observer = null;

  function startObserving() {
    if (observer) return;
    observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((n) => walk(n));
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  function stopObserving() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  function run() {
    if (!enabled) return;
    walk(document.body);
    startObserving();
  }

  function loadSettingsAndRun() {
    chrome.storage.sync.get({ enabled: true }, (settings) => {
      enabled = settings.enabled;
      if (enabled) {
        run();
      } else {
        stopObserving();
      }
    });
  }

  loadSettingsAndRun();
})();

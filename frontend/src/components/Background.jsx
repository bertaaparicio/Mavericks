import * as React from "react";

const canUseDOM =
  typeof window !== "undefined" &&
  typeof window.document !== "undefined" &&
  typeof window.document.createElement !== "undefined";

function getOwnerWindow(node) {
  if (!canUseDOM) {
    throw new Error("Cannot access window outside of the DOM");
  }
  return node?.ownerDocument?.defaultView ?? globalThis.window;
}

const UNICORN_PROJECT_ID = "1nCWzmjSoyYtyrWcBsMi";
const UNICORN_SCRIPT_ID = "unicorn-studio-sdk";
const UNICORN_SDK_URL =
  "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.12/dist/unicornStudio.umd.js";
const UNICORN_WATERMARK_SELECTOR = [
  'a[href*="unicorn.studio" i]',
  'a[href*="hiunicornstudio" i]',
  'a[title*="made with" i]',
  'a[title*="unicorn" i]',
  'button[title*="made with" i]',
  'button[title*="unicorn" i]',
  'a[aria-label*="made with" i]',
  'a[aria-label*="unicorn" i]',
  'button[aria-label*="made with" i]',
  'button[aria-label*="unicorn" i]',
].join(",");
const UNICORN_WATERMARK_TEXT_SELECTOR = "a,button";

function isLowPowerDevice() {
  if (!canUseDOM) {
    return true;
  }
  const ownerWindow = getOwnerWindow();
  if (ownerWindow.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return true;
  }
  if (ownerWindow.matchMedia("(prefers-reduced-data: reduce)").matches) {
    return true;
  }
  if (ownerWindow.matchMedia("(hover: none) and (pointer: coarse)").matches) {
    return true;
  }
  if (
    "hardwareConcurrency" in navigator &&
    navigator.hardwareConcurrency <= 4
  ) {
    return true;
  }
  return false;
}

export function Background() {
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    if (isLowPowerDevice()) {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    removeUnicornWatermark(container);

    const observer = new MutationObserver(() => {
      removeUnicornWatermark(container);
    });
    observer.observe(container, { childList: true, subtree: true });

    if (window.UnicornStudio?.init) {
      initUnicornStudio();
      removeUnicornWatermark(container);

      return () => {
        observer.disconnect();
      };
    }

    const existingScript = document.getElementById(UNICORN_SCRIPT_ID);
    if (existingScript) {
      const handleLoad = () => {
        initUnicornStudio();
        removeUnicornWatermark(container);
      };

      existingScript.addEventListener("load", handleLoad);

      return () => {
        observer.disconnect();
        existingScript.removeEventListener("load", handleLoad);
      };
    }

    const script = document.createElement("script");
    script.async = true;
    script.id = UNICORN_SCRIPT_ID;
    script.src = UNICORN_SDK_URL;
    const handleLoad = () => {
      initUnicornStudio();
      removeUnicornWatermark(container);
    };
    script.addEventListener("load", handleLoad);
    document.head.appendChild(script);

    return () => {
      observer.disconnect();
      script.removeEventListener("load", handleLoad);
    };
  }, []);

  return (
    <div
      className="hero__background"
      data-us-project={UNICORN_PROJECT_ID}
      ref={containerRef}
      style={{ height: "100%", width: "100%" }}
    />
  );
}

function initUnicornStudio() {
  window.UnicornStudio?.init();
}

function removeUnicornWatermark(container) {
  const elements = container.querySelectorAll(UNICORN_WATERMARK_SELECTOR);
  for (const element of elements) {
    element.remove();
  }

  const descendants = container.querySelectorAll(
    UNICORN_WATERMARK_TEXT_SELECTOR,
  );
  for (const descendant of descendants) {
    const text = descendant.textContent?.toLowerCase() ?? "";
    if (!(text.includes("made with") || text.includes("unicorn"))) {
      continue;
    }

    descendant.remove();
  }
}

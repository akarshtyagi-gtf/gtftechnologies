export type HeaderTheme = "light" | "dark";

export const HEADER_THEME_EVENT = "gtf-header-theme";

declare global {
  interface Window {
    __gtfHeaderTheme?: HeaderTheme;
  }
}

/**
 * Dispatch a global event to change the fixed Header's color theme
 * (e.g. 'dark' section -> switches logo to GtfWhiteLogo).
 * Updates window.__gtfHeaderTheme and dispatches a CustomEvent.
 */
export function setHeaderTheme(theme: HeaderTheme) {
  if (typeof window !== "undefined") {
    window.__gtfHeaderTheme = theme;
    window.dispatchEvent(
      new CustomEvent(HEADER_THEME_EVENT, { detail: { theme } })
    );
  }
}

export function getHeaderTheme(): HeaderTheme {
  if (typeof window !== "undefined" && window.__gtfHeaderTheme) {
    return window.__gtfHeaderTheme;
  }
  return "light";
}

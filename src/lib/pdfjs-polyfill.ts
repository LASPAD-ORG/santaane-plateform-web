// Polyfill for URL.parse() which is not available in older Node.js versions
// This fixes the "URL.parse is not a function" error with pdfjs-dist

if (typeof URL !== 'undefined' && !(URL as any).parse) {
  (URL as any).parse = (url: string, base?: string | URL) => {
    try {
      return new URL(url, base);
    } catch {
      return null;
    }
  };
}

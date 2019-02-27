importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

// add custom files to precache
self.__precacheManifest = [
  {
    "url": "vendor.js",
    "revision": "fb47ebd287a34c66287e1e7ec85a57ca"
  },
  {
    "url": "polyfills.js",
    "revision": "fb47ebd287a34c66287e1e7ec85a57cz"
  }].concat(self.__precacheManifest || []);

workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute([]);

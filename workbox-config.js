module.exports = {
  "globDirectory": "dist/",
  "globPatterns": [
    "**/*.{jpg,png,icns,ico,html,js}"
  ],
  "swDest": "dist\\sw.js",
  "importScripts": ['workbox-manifest.js'],
};

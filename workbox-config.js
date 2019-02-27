module.exports = {
  "globDirectory": "dist/",
  "globPatterns": [
    "**/*.{jpg,png,icns,ico,html,js}"
  ],
  "maximumFileSizeToCacheInBytes": 10 * 1024 * 1024, // increase to 10 MB
  "swDest": "dist\\sw.js",
  "swSrc": "workbox-sw.js"
};

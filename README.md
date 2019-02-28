# Pokedex

This Pokedex applications was built to test the offline capabilities of both the web and electron using IndexedDB and workbox service workers.

## Running locally

You can run this project in the web or as an electron application. Note that running in the web with service workers does not work with hot reloading. So, if you want to see changes with service, you will need to rebuild and then refresh.

**Run in the web (no service workers):**
```
npm run web
```

**Run with service workers enabled:**
```
npm run offline
```

**Run via electron**
```
npm start
```

## Original Readme

The original readme for this template can be found [here](docs/Readme.md).

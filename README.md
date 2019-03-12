# Pokedex

This Pokedex applications was built to test the offline capabilities of both the web and electron using IndexedDB and workbox service workers.

## Running locally

You can run this project in the web or as an electron application. Note that running in the web with service workers *does not work with hot reloading*. So, if you want to see changes with service, you will need to rebuild and then refresh. Running in the web will spin up on `http://localhost:4200`.

**Run via web with hot reloading**
```
npm run web
```

**Run via web with service workers**
```
npm run offline
```

**Run via electron**
```
npm start
```

## Production builds

Production builds can be done locally or with CI. In each case, an installer will be generated. The installer comes packaged with auto-updating, a signed cert, and installs to a default location on the user's machine.

For windows:
```
npm run electron:windows
```

For linux:
```
npm run electron:linux
```

For mac:
```
npm run electron:mac
```

## Troubleshooting & development

### Dependencies vs DevDependencies
Most packages should be placed in devDependencies inside the `package.json` purely for compilation optimization. However, if you want to add new packages in the electron main thread (like rxjs), be sure to install the package into the dependencies rather than devDependencies otherwise production builds may not work with them. See the original readme for more.

## Original Readme

The original readme for this template can be found [here](docs/Readme.md).

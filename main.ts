import { app, BrowserWindow, screen, dialog, LoadURLOptions } from 'electron';
import { autoUpdater } from 'electron-updater';
import * as path from 'path';
import * as url from 'url';
import * as log from 'electron-log';

let win: BrowserWindow, serve: boolean;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

function createWindow() {
  log.info(`creating window...`);
  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true
    }
  });

  if (serve) {
    log.info(`serving electron reload...`);
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');
  } else {
    log.info(`serving index.html from ${__dirname}...`);
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  if (serve) {
    win.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
    log.info(`window closed...`);
  });
}

function checkForUpdates(): void {
  // todo: update menu item
  log.info('checkForUpdates initialized...');
  setAsOptional();
  autoUpdater.checkForUpdates().then((resp) => {
    log.info(`checkForUpdates completed. File count: ${resp.updateInfo.files.length}`);
    resp.updateInfo.files.forEach(file => {
      log.info(`${file.url}`);
    });
  }).catch((err) => {
    log.info(`checkForUpdates errored: ${err}`);
  });
}

function forceUpdate(): void {
  log.info('forceUpdate initialized...');
  autoUpdater.checkForUpdatesAndNotify();
}

function setAsOptional(): void {
  autoUpdater.autoDownload = false; // set to optional

  autoUpdater.on('error', (error) => {
    log.info(`autoupdater errored: ${error}`);
    dialog.showErrorBox('Error: ', error == null ? 'unknown' : (error.stack || error).toString());
  });

  autoUpdater.on('update-available', () => {
    log.info(`update available`);
    dialog.showMessageBox({
      type: 'info',
      title: 'Found Updates',
      message: 'Found updates, do you want update now?',
      buttons: ['Sure', 'No']
    }, (buttonIndex) => {
      if (buttonIndex === 0) {
        autoUpdater.downloadUpdate();
      } else {
        // todo: update menu item
      }
    });
  });

  autoUpdater.on('update-not-available', () => {
    log.info(`update not available`);
    // dialog.showMessageBox({
    //   title: 'No Updates',
    //   message: 'Current version is up-to-date.'
    // });
    // todo: update menu item
  });

  autoUpdater.on('update-downloaded', () => {
    log.info(`update downloaded`);
    dialog.showMessageBox({
      title: 'Install Updates',
      message: 'Updates downloaded, application will be quit for update...'
    }, () => {
      setImmediate(() => autoUpdater.quitAndInstall());
    });
  });
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', () => {
    const isOptional = true; // todo: replace this with call to api
    if (isOptional) {
      // enable optional download
      checkForUpdates();
    } else {
      // force auto download
      forceUpdate();
    }

    createWindow();
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  log.error(e);
  if (serve) {
    throw e;
  }
}


import { dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import * as log from 'electron-log';

// This updater uses the following: https://www.electron.build/auto-update
export class AutoUpdater {
  constructor() {
    log.transports.file.level = 'debug';
    autoUpdater.logger = log;
  }

  // optional update via menu item
  public checkForUpdates(): void {
    // todo: update menu item
    log.info('Optional update initialized...');
    this.setAsOptional();
    autoUpdater.checkForUpdates();
  }

  // forced update
  public forceUpdate(): void {
    log.info('Forced update initialized...');
    autoUpdater.checkForUpdatesAndNotify();
  }

  private setAsOptional(): void {
    autoUpdater.autoDownload = false; // set to optional

    autoUpdater.on('error', (error) => {
      dialog.showErrorBox('Error: ', error == null ? 'unknown' : (error.stack || error).toString());
    });

    autoUpdater.on('update-available', () => {
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
      // dialog.showMessageBox({
      //   title: 'No Updates',
      //   message: 'Current version is up-to-date.'
      // });
      // todo: update menu item
    });

    autoUpdater.on('update-downloaded', () => {
      dialog.showMessageBox({
        title: 'Install Updates',
        message: 'Updates downloaded, application will be quit for update...'
      }, () => {
        setImmediate(() => autoUpdater.quitAndInstall());
      });
    });
  }
}

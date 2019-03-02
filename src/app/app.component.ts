import { Component } from '@angular/core';
import { ElectronService } from './services/electron.service';
import { TranslateService } from '@ngx-translate/core';
import { Meta } from '@angular/platform-browser';
import { AppConfig } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public electronService: ElectronService,
    private translate: TranslateService, private meta: Meta) {
    this.translate.setDefaultLang('en');
    this.meta.updateTag({ name: 'origin-trial', content: AppConfig.experimentalKey });

    if (electronService.isElectron()) {
      console.log('Mode: electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
    } else {
      console.log('Mode: web');
    }
  }
}

import { Component } from '@angular/core';
import { ElectronService } from './services/electron.service';
import { Meta } from '@angular/platform-browser';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public electronService: ElectronService, private meta: Meta) {
    this.meta.updateTag({ name: 'origin-trial', content: environment.experimentalKey });

    if (electronService.isElectron()) {
      console.log('Mode: electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
    } else {
      console.log('Mode: web');
    }
  }
}

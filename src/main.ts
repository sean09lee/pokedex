import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { AppConfig } from './environments/environment';

if (AppConfig.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    preserveWhitespaces: false
  }).then(() => {
    registerServiceWorker('sw');
  })
  .catch(err => console.error(err));

function registerServiceWorker(swName: string) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register(`/${swName}.js`)
      .then(reg => {
        console.log('[App] Successful service worker registration', reg);
      })
      .catch(err =>
        console.log('[App] Service worker registration failed', err)
      );
  } else {
    console.log('[App] Service Worker API is not supported in current browser');
  }
}

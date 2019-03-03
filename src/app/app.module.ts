import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';

// services
import { ElectronService } from './services/electron.service';
import { PokemonService } from './services/pokemon.service';

// globals & offline database
import { Globals } from './utilities/globals.utilities';
import { PokemonDatabase } from './database/pokemon.database';

// directives
import { WebviewDirective } from './directives/webview.directive';

// components
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WebviewDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    HttpModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    ElectronService,
    PokemonService,
    PokemonDatabase,
    Globals
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, ResponseContentType } from '@angular/http';
import { PokemonModel } from '../models/pokemon.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { PokemonDatabase } from '../database/pokemon.database';
import { DomSanitizer } from '@angular/platform-browser';
import { StatsModel } from '../models/stats.model';
import { ElectronService } from './electron.service';
import { saveAs } from 'file-saver';
import * as blobutil from 'blob-util';

@Injectable()
export class PokemonService {
    private baseEndpoint: string;
    private pokemonSubject: BehaviorSubject<PokemonModel[]> = new BehaviorSubject<PokemonModel[]>([]);
    private isElectron: boolean;

    public pokemon: Observable<PokemonModel[]> = this.pokemonSubject.asObservable();
    public initialized: boolean;

    constructor(private httpClient: HttpClient,
              private http: Http,
              private sanitizer: DomSanitizer,
              private db: PokemonDatabase,
              private electronService: ElectronService) {
        this.baseEndpoint = `https://pokeapi.co/api/v2/`;
        this.isElectron = this.electronService.isElectron();
    }

    public async initializePokemon(update: boolean = false): Promise<boolean> {
      // first, try and get from indexeddb
      let pokemon: PokemonModel[] = await this.getFromIndexedDB();
      if (!update && pokemon && pokemon.length > 0) {
        this.pokemonSubject.next(pokemon);
        return true;
      }

      const data = await this.getFromAPI();
      if (data && data.length > 0) {
        console.log('Retrieved data from api successfully');
        pokemon = data;
      } else {
        if (this.isElectron) {
          // get data from disk
          this.upload();
        }
      }

      if (pokemon && pokemon.length > 0) {
        // set offline storage values
        this.setIndexedDb(pokemon);
        this.setSafeUrl(pokemon);

        // if electron backup to disk
        if (this.isElectron) {
          this.save();
        }

        this.pokemonSubject.next(pokemon);
        return true;
      } else {
        this.pokemonSubject.next([]);
        return false;
      }
    }

    public async save(): Promise<void> {
      // set content to save
      const pokemons: PokemonModel[] = await this.db.pokemon.toArray();
      const content = JSON.stringify(pokemons);

      if (this.isElectron) {
        // electron mode: so save file to custom path
        this.electronService.saveFile(content);
        console.log('Data saved to disk.');
      } else {
        // web mode: so save file to downloads
        const blob = new Blob([content], {type: 'data:text/json;charset=utf-8'});
        saveAs(blob, 'pokedex.json');
      }
    }

    public async upload(): Promise<void> {
      const pokemon: PokemonModel[] = this.electronService.upload();
      this.updatePokemonFromFile(pokemon);
      console.log('Upload from disk succesful');
    }

    public async updatePokemonFromFile(pokemon: PokemonModel[]): Promise<void> {
      for (let index = 0; index < pokemon.length; index++) {
        const p = pokemon[index];
        p.blob = await blobutil.base64StringToBlob(p.base64blob);
      }
      this.setSafeUrl(pokemon);
      this.pokemonSubject.next(pokemon);
    }

    private async getFromIndexedDB(): Promise<PokemonModel[]> {
      let data: PokemonModel[] = [];
      try {
        data = await this.db.pokemon.toArray();
      } catch {
        console.warn('Data could not be retrieved from IndexedDB. Database reinitializing..');
        this.db.reinitialize();
      }

      if (data) {
        this.setSafeUrl(data);
      }

      return data;
    }

    private async getFromAPI(): Promise<PokemonModel[]> {
      const endpoint = `${this.baseEndpoint}pokemon`;
      const response: any = await this.httpClient.get(endpoint).toPromise().catch(() => {
        console.warn('Data could not be retrieved from API.');
      });

      if (response && response.count && response.count > 0) {
        const pokemons: PokemonModel[] = response.results as PokemonModel[];
        for (let index = 0; index < pokemons.length; index++) {
          pokemons[index] = await this.updatePokemon(pokemons[index]);
        }
        return pokemons;
      }

      return [];
    }

    private setSafeUrl(data: PokemonModel[]): PokemonModel[] {
      data.map((pokemon: PokemonModel) => {
        if (pokemon && pokemon.blob) {
          pokemon.safeUrl = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(pokemon.blob));
        }
      });
      return data;
    }

    private async updatePokemon(pokemon: PokemonModel): Promise<PokemonModel> {
      const data: any = await this.httpClient.get(pokemon.url).toPromise();
      const res: any = await this.http.get(data.sprites.front_default, {responseType: ResponseContentType.Blob}).toPromise();
      const blob = new Blob([res._body], {type: res.headers.get('Content-Type')});
      pokemon.stats = data.stats as StatsModel[];
      pokemon.height = data.height;
      pokemon.weight = data.weight;
      pokemon.blob = blob;
      pokemon.base64blob = await blobutil.blobToBase64String(blob);
      pokemon.id = data.id;
      return pokemon;
    }

    private setIndexedDb(pokemon: PokemonModel[]): void {
      pokemon.forEach((p: PokemonModel) => {
        this.db.addPokemon(p);
      });
    }
}

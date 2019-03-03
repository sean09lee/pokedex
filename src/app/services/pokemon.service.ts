import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, ResponseContentType } from '@angular/http';
import { PokemonModel } from '../models/pokemon.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Globals } from '../utilities/globals.utilities';
import { PokemonDatabase } from '../database/pokemon.database';
import { DomSanitizer } from '@angular/platform-browser';
import { StatsModel } from '../models/stats.model';

@Injectable()
export class PokemonService {
    private baseEndpoint: string;
    private pokemonSubject: BehaviorSubject<PokemonModel[]> = new BehaviorSubject<PokemonModel[]>([]);

    public pokemon: Observable<PokemonModel[]> = this.pokemonSubject.asObservable();
    public initialized: boolean;

    constructor(private httpClient: HttpClient,
              private http: Http,
              private sanitizer: DomSanitizer,
              private globals: Globals,
              private db: PokemonDatabase) {
        this.baseEndpoint = `https://pokeapi.co/api/v2/`;
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
      }

      if (pokemon && pokemon.length > 0) {
        // set offline storage values
        this.setIndexedDb(pokemon);
        this.setSafeUrl(pokemon);

        this.pokemonSubject.next(pokemon);
        return true;
      } else {
        this.pokemonSubject.next([]);
        return false;
      }
    }

    private getFromLocalStorage(): PokemonModel[] {
      const data = localStorage.getItem(this.globals.pokemon);
      const pokemon = JSON.parse(data) as PokemonModel[];
      return pokemon;
    }

    private async getFromIndexedDB(): Promise<PokemonModel[]> {
      let data: PokemonModel[] = [];
      try {
        data = await this.db.pokemon.toArray();
      } catch {
        console.warn('Data could not be retrieved from IndexedDB.');
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
      pokemon.id = data.id;
      return pokemon;
    }

    private setLocalStorage(pokemon: PokemonModel[]): void {
      localStorage.setItem(this.globals.pokemon, JSON.stringify(pokemon));
    }

    private setIndexedDb(pokemon: PokemonModel[]): void {
      pokemon.forEach((p: PokemonModel) => {
        this.db.addPokemon(p);
      });
    }
}

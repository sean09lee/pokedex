import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PokemonModel } from '../models/pokemon.model';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable()
export class PokemonService {
    private baseEndpoint: string;
    private pokemonSubject: BehaviorSubject<PokemonModel[]> = new BehaviorSubject<PokemonModel[]>([]);

    public pokemon: Observable<PokemonModel[]> = this.pokemonSubject.asObservable();

    constructor(private http: HttpClient) {
        this.baseEndpoint = `https://pokeapi.co/api/v2/`;
    }

    public async initializePokemon(): Promise<void> {
      const endpoint = `${this.baseEndpoint}pokemon`;
      const response: any = await this.http.get(endpoint).toPromise();
      if (response && response.count && response.count > 0) {
        const pokemon: PokemonModel[] = response.results as PokemonModel[];
        this.pokemonSubject.next(pokemon);
        localStorage.setItem('pokemon', JSON.stringify(pokemon));
      }
    }
}

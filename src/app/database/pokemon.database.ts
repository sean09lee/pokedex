import Dexie from 'dexie';
import { Injectable } from '@angular/core';
import { PokemonModel } from '../models/pokemon.model';

@Injectable()
export class PokemonDatabase {
    private db = new PokemonDexie();

    public pokemon: Dexie.Table<PokemonModel, number> = this.db.pokemon;

    public addPokemon(pokemon: PokemonModel) {
      this.db.transaction('rw', this.db.pokemon, async() => {
        // Make sure we have something in DB:
        if ((await this.db.pokemon.where({name: pokemon.name}).count()) === 0) {
            const id = await this.db.pokemon.add({id: pokemon.id, name: pokemon.name, url: pokemon.url});
            console.log(`Pokemon added with id ${id}`);
        }
      }).catch(e => {
          console.error(e.stack || e);
      });
    }

    public getPokemon(pokemon: PokemonModel) {
      this.db.transaction('rw', this.db.pokemon, async() => {
        // Make sure we have something in DB:
        if ((await this.db.pokemon.where({id: pokemon.id}).count()) > 0) {
            const id = await this.db.pokemon.add({id: pokemon.id, name: pokemon.name, url: pokemon.url});
            console.log(`Pokemon added with id ${id}`);
        }
      }).catch(e => {
          alert(e.stack || e);
      });
    }
}

export class PokemonDexie extends Dexie {
  public pokemon: Dexie.Table<PokemonModel, number>; // id is number in this case

  public constructor() {
      super('PokemonDatabase');
      this.version(1).stores({
        pokemon: 'id,name,image'
      });
      this.pokemon = this.table('pokemon');
  }

}

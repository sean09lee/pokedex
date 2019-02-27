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
        const matching: number = await this.db.pokemon.where({name: pokemon.name}).count();
        if (matching === 0) {
          const id = await this.db.pokemon.add(pokemon);
          console.log(`Pokemon added with id ${id}`);
        } else if (matching === 1) {
          const id = await this.db.pokemon.put(pokemon);
          console.log(`Pokemon updated with id ${id}`);
        }
      }).catch(e => {
          console.error(e.stack || e);
      });
    }

    public getPokemon(pokemon: PokemonModel) {
      this.db.transaction('rw', this.db.pokemon, async() => {
        // Make sure we have something in DB:
        if ((await this.db.pokemon.where({id: pokemon.id}).count()) > 0) {
            const id = await this.db.pokemon.add(pokemon);
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


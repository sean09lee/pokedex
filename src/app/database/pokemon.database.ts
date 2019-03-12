import Dexie from 'dexie';
import { Injectable } from '@angular/core';
import { PokemonModel } from '../models/pokemon.model';

@Injectable()
export class PokemonDatabase {
    private db = new PokemonDexie();

    public pokemon: Dexie.Table<PokemonModel, number> = this.db.pokemon;

    public reinitialize(): void {
      try {
        this.db = new PokemonDexie();
      } catch {
        console.warn('DB initialization errors..');
      }
    }

    public addPokemon(pokemon: PokemonModel) {
      this.db.transaction('rw', this.db.pokemon, async() => {
        // Make sure we have something in DB:
        const matching: number = await this.db.pokemon.where({name: pokemon.name}).count();
        if (matching === 0) {
          const id = await this.db.pokemon.add(pokemon);
          console.debug(`Pokemon added with id ${id}`);
        } else if (matching === 1) {
          const id = await this.db.pokemon.put(pokemon);
          console.debug(`Pokemon updated with id ${id}`);
        }
      }).catch(e => {
          console.warn('Failed to setup offline database: IndexedDB');
          console.debug(e.stack || e);
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
      this.initStoragePersistence();
  }

  private async persist(): Promise<boolean> {
    return await navigator.storage && navigator.storage.persist &&
      navigator.storage.persist();
  }

  public async isStoragePersisted(): Promise<boolean> {
    return await navigator.storage && navigator.storage.persist &&
      navigator.storage.persisted();
  }

  private async initStoragePersistence() {
    const persist = await this.tryPersistWithoutPromtingUser();
    switch (persist) {
      case 'never':
        console.log('Not possible to persist storage');
        break;
      case 'persisted':
        console.log('Successfully persisted storage silently');
        break;
      case 'prompt':
        console.log('Not persisted, but we may prompt user when we want to.');
        await this.persist();
        break;
    }
    this.showEstimatedQuota();
  }

  private async tryPersistWithoutPromtingUser() {
    if (!navigator.storage || !navigator.storage.persisted) {
      return 'never';
    }
    if (this.isStoragePersisted()) {
      return 'persisted';
    }
    const nav: any = window.navigator;
    if (!nav.permissions || !nav.permissions.query) {
      return 'prompt'; // It MAY be successful to prompt. Don't know.
    }
    const permission: any = await nav.permissions.query({
      name: 'persistent-storage'
    });
    if (permission.status === 'granted') {
      const persisted = await this.persist();
      if (persisted) {
        return 'persisted';
      } else {
        console.log('Failed to persist');
      }
    }
    if (permission.status === 'prompt') {
      return 'prompt';
    }
    return 'never';
  }

  public async showEstimatedQuota(): Promise<void> {
    if (navigator.storage && navigator.storage.estimate) {
      const estimation = await navigator.storage.estimate();
      console.log(`Quota: ${estimation.quota}`);
      console.log(`Usage: ${estimation.usage}`);
    } else {
      console.log('StorageManager not found');
    }
  }
}

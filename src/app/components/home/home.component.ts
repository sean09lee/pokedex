import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonModel } from '../../models/pokemon.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public pokemons: PokemonModel[] = [];
  public loading = true;
  public search = '';

  private originalPokemon: PokemonModel[];

  constructor(private pokemonService: PokemonService) {
    this.pokemonService.pokemon.subscribe((pokemons: PokemonModel[]) => {
      this.originalPokemon = pokemons;
      this.pokemons = pokemons;
      this.loading = false;
    });
  }

  public ngOnInit(): void {
    this.pokemonService.initializePokemon();
  }

  public refresh(): void {
    this.loading = true;
    this.pokemonService.initializePokemon(true);
  }

  public onSearchChange(search: string): void {
    this.pokemons = this.originalPokemon.filter(x => x.name.includes(search));
  }

  public clearSearch(): void {
    this.search = '';
    this.pokemons = this.originalPokemon;
  }
}

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

  constructor(private pokemonService: PokemonService) {
    this.pokemonService.pokemon.subscribe((pokemons: PokemonModel[]) => {
      this.pokemons = pokemons;
      this.loading = false;
    });
  }

  public ngOnInit(): void {
    this.pokemonService.initializePokemon();
  }

  public updateDb(): void {
    this.loading = true;
    this.pokemonService.initializePokemon(true);
  }

}

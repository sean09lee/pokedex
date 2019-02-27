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

  constructor(private pokemonService: PokemonService) {
    this.pokemonService.pokemon.subscribe((pokemons: PokemonModel[]) => {
      this.pokemons = pokemons;
    });
  }

  public ngOnInit(): void {
    this.pokemonService.initializePokemon();
  }

}

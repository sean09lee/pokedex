import { Component, OnInit, ViewChild } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonModel } from '../../models/pokemon.model';
import { ElectronService } from '../../services/electron.service';
import * as blobutil from 'blob-util';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('file') file;
  public pokemons: PokemonModel[] = [];
  public loading = true;
  public search = '';
  public isElectron: boolean;

  private originalPokemon: PokemonModel[];

  constructor(private pokemonService: PokemonService, private electronService: ElectronService) {
    this.pokemonService.pokemon.subscribe((pokemons: PokemonModel[]) => {
      this.originalPokemon = pokemons;
      this.pokemons = pokemons;
      this.loading = false;
    });
    this.isElectron = this.electronService.isElectron();
  }

  public ngOnInit(): void {
    this.pokemonService.initializePokemon();
  }

  public refresh(): void {
    this.loading = true;
    this.pokemonService.initializePokemon(true);
  }

  public async save(): Promise<void> {
    this.loading = true;
    await this.pokemonService.save();
    this.loading = false;
  }

  public upload(): void {
    if (this.isElectron) {
      this.loading = true;
      this.pokemonService.upload();
      this.loading = false;
    } else {
      this.file.nativeElement.click();
    }
  }

  public onFileUploaded(): void {
    this.loading = true;
    const files: { [key: string]: File } = this.file.nativeElement.files;
    for (const key in files) {
      // tslint:disable-next-line:radix
      if (!isNaN(parseInt(key))) {
        const file: File = files[key];
        const reader = new FileReader();
        reader.onload = (event: any) => {
          const self = this;
          const pokemon: PokemonModel[] = JSON.parse(event.target.result);
          self.pokemonService.updatePokemonFromFile(pokemon);
          this.loading = false;
        };
        reader.readAsText(file);
      } else {
        this.loading = false;
      }
    }
  }

  public onSearchChange(search: string): void {
    this.pokemons = this.originalPokemon.filter(x => x.name.includes(search));
  }

  public clearSearch(): void {
    this.search = '';
    this.pokemons = this.originalPokemon;
  }
}

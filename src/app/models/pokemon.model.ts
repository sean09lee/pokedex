import { SafeUrl } from '@angular/platform-browser';
import { StatsModel } from './stats.model';

export class PokemonModel {
  id: number;
  name: string;
  url: string;
  safeUrl: SafeUrl;
  blob: Blob;
  baseExperience: number;
  height: number;
  weight: number;
  stats: StatsModel[];
}

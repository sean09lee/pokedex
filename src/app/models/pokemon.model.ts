import { SafeUrl } from '@angular/platform-browser';
import { StatsModel } from './stats.model';

export class PokemonModel {
  id: number;
  name: string;
  url: string;
  safeUrl: SafeUrl;
  blob: Blob;
  base64blob: string;
  baseExperience: number;
  height: number;
  weight: number;
  stats: StatsModel[];
  flipped: boolean;
}

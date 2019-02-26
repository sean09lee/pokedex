import { SafeUrl } from '@angular/platform-browser';

export class PokemonModel {
  id: number;
  name: string;
  url: string;
  safeUrl: SafeUrl;
  blob: Blob;
}

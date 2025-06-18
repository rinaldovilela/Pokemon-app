import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
  ],
})
export class PokemonCardComponent {
  @Input() pokemon!: { name: string; url: string };
  @Input() isFavorite: boolean = false;
  @Output() favoriteToggled = new EventEmitter<number>();
  @Output() cardClicked = new EventEmitter<number>();
  @Input() showDetails: boolean = false;
  @Input() pokemonDetails?: {
    types?: string;
    height?: string;
    weight?: string;
    imageUrl?: string;
  };

  constructor() {
    addIcons({ heart, heartOutline });
  }

  getPokemonId(url: string): number {
    const id = url.split('/').filter(Boolean).pop();
    return Number(id || '0');
  }

  getImageUrl(url: string): string {
    const id = this.getPokemonId(url);
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  }

  onFavoriteClick(event: Event) {
    event.stopPropagation();
    this.favoriteToggled.emit(this.getPokemonId(this.pokemon.url));
  }

  onCardClick() {
    this.cardClicked.emit(this.getPokemonId(this.pokemon.url));
  }

  onImageLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    img.classList.add('loaded');
  }
}

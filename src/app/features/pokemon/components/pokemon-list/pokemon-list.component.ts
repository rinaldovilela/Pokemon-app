import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { PokemonService } from 'src/app/core/services/pokemon.service';
import { Pokemon } from 'src/app/core/models/pokemon.model';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonButtons,
  IonFooter,
  IonSpinner,
} from '@ionic/angular/standalone';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonButtons,
    IonFooter,
    ThemeToggleComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PokemonListComponent implements OnInit, OnDestroy {
  pokemons: Pokemon[] = [];
  offset: number = 0;
  limit: number = 20;
  isSmallScreen: boolean = false;
  favoriteStates: { [key: number]: boolean } = {};
  private favoritesSubscription!: Subscription;

  constructor(
    private pokemonService: PokemonService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadPokemons();
    this.checkScreenSize();
    this.setupFavoritesSubscription();
  }

  ngOnDestroy() {
    this.favoritesSubscription?.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth <= 576;
  }

  async loadPokemons() {
    this.pokemonService
      .getPokemonList(this.offset, this.limit)
      .subscribe(async (data) => {
        this.pokemons = data.results;
        await this.updateFavoriteStates();
      });
  }

  private setupFavoritesSubscription() {
    this.favoritesSubscription = this.pokemonService.favorites$.subscribe(
      () => {
        this.updateFavoriteStates();
      }
    );
  }

  private async updateFavoriteStates() {
    const favorites = await this.pokemonService.getFavorites();
    this.pokemons.forEach((p) => {
      const id = this.getIdFromUrl(p.url);
      this.favoriteStates[id] = favorites.includes(id);
    });
  }

  previousPage() {
    if (this.offset >= this.limit) {
      this.offset -= this.limit;
      this.loadPokemons();
    }
  }

  nextPage() {
    this.offset += this.limit;
    this.loadPokemons();
  }

  getImageUrl(url: string): string {
    const id = url.split('/').filter(Boolean).pop();
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  }

  goToDetail(id: number) {
    this.router.navigate(['detail', id], { relativeTo: this.route });
  }

  goToFavorites() {
    this.router.navigate(['favorites'], { relativeTo: this.route });
  }

  getIdFromUrl(url: string): number {
    const id = url.split('/').filter(Boolean).pop();
    return Number(id);
  }

  onImageLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    img.classList.add('loaded');
  }

  async toggleFavorite(id: number) {
    await this.pokemonService.toggleFavorite(id);
  }
}

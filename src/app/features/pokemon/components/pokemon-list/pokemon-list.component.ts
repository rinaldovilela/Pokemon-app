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
import { Subject, Subscription, takeUntil } from 'rxjs';
import { PokemonCardComponent } from 'src/app/shared/components/pokemon-card/pokemon-card.component';

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
    IonButton,
    IonIcon,
    IonButtons,
    IonFooter,
    ThemeToggleComponent,
    PokemonCardComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PokemonListComponent implements OnInit, OnDestroy {
  pokemons: Pokemon[] = [];
  offset: number = 0;
  limit: number = 20;
  totalPokemons: number = 0;
  hasNextPage: boolean = false;
  hasPreviousPage: boolean = false;
  isSmallScreen: boolean = false;
  favoriteStates: { [key: number]: boolean } = {};
  currentPage: number = 1;
  totalPages: number = 0;
  private favoritesSubscription!: Subscription;
  public loading: boolean = true;
  private navDebounce = false;
  private destroy$ = new Subject<void>();

  constructor(
    private pokemonService: PokemonService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadPokemons();
    this.checkScreenSize();
    this.setupFavoritesSubscription(); // Adicione esta linha
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
    this.loading = true;

    try {
      type PokemonListResponse = {
        count: number;
        next: string | null;
        previous: string | null;
        results: Pokemon[];
      };

      const data = (await this.pokemonService
        .getPokemonList(this.offset, this.limit)
        .pipe(takeUntil(this.destroy$))
        .toPromise()) as PokemonListResponse;

      if (data) {
        // Cálculos otimizados
        this.totalPokemons = data.count;
        this.totalPages = Math.max(1, Math.ceil(data.count / this.limit));
        this.currentPage = Math.min(
          this.totalPages,
          Math.max(1, Math.floor(this.offset / this.limit) + 1)
        );

        this.pokemons = data.results;
        this.hasNextPage = !!data.next;
        this.hasPreviousPage = !!data.previous;

        await this.updateFavoriteStates();
      }
    } catch (error) {
      console.error('Erro ao carregar:', error);
      this.setSafeFallbackState();
    } finally {
      this.loading = false;
    }
  }
  async nextPage() {
    if (this.navDebounce || !this.hasNextPage) return;

    this.navDebounce = true;
    this.offset += this.limit;

    try {
      await this.loadPokemons();
    } finally {
      this.navDebounce = false;
    }
  }

  private async updateFavoriteStates() {
    const favorites = await this.pokemonService.getFavorites();
    this.pokemons.forEach((p) => {
      const id = this.getIdFromUrl(p.url);
      this.favoriteStates[id] = favorites.includes(id);
    });
  }

  private setupFavoritesSubscription() {
    this.favoritesSubscription = this.pokemonService.favorites$.subscribe(
      () => {
        this.updateFavoriteStates();
      }
    );
  }

  previousPage() {
    if (this.offset >= this.limit) {
      this.offset -= this.limit;
      this.loadPokemons();
    }
  }

  // nextPage() {
  //   this.offset += this.limit;
  //   this.loadPokemons();
  // }

  firstPage() {
    this.offset = 0;
    this.loadPokemons();
  }

  lastPage() {
    this.offset = (this.totalPages - 1) * this.limit;
    this.loadPokemons();
  }

  goToPage(page: number) {
    this.offset = (page - 1) * this.limit;
    this.loadPokemons();
  }

  getImageUrl(url: string): string {
    const id = url.split('/').filter(Boolean).pop();
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  }

  goToDetail(id: number) {
    this.router.navigate(['detail', id], {
      relativeTo: this.route,
      state: { from: '/pokemon' }, // Ajustado para /pokemon
    });
  }

  goToFavorites() {
    this.router.navigate(['favorites'], {
      relativeTo: this.route,
      state: { from: '/pokemon' },
    });
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

  private setSafeFallbackState() {
    this.totalPages = Math.max(1, this.totalPages); // Garante mínimo 1
    this.currentPage = Math.max(1, Math.min(this.currentPage, this.totalPages));
    this.hasNextPage = this.offset + this.limit < this.totalPokemons;
    this.hasPreviousPage = this.offset > 0;
  }
}

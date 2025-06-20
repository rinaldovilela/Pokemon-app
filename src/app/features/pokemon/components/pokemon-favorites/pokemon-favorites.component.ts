import { Component, OnInit, OnDestroy } from '@angular/core';
import { PokemonService } from 'src/app/core/services/pokemon.service';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
  IonBackButton,
  IonButtons,
} from '@ionic/angular/standalone';
import { PokemonDetails } from 'src/app/core/models/pokemon.model';
import { Router, ActivatedRoute } from '@angular/router';
import { PokemonCardComponent } from 'src/app/shared/components/pokemon-card/pokemon-card.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pokemon-favorites',
  templateUrl: './pokemon-favorites.component.html',
  styleUrls: ['./pokemon-favorites.component.scss'],
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
    IonSpinner,
    IonBackButton,
    IonButtons,
    PokemonCardComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PokemonFavoritesComponent implements OnInit, OnDestroy {
  favoriteIds: number[] = [];
  favoriteDetails: PokemonDetails[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;
  backRoute: string = '/pokemon';
  private favoritesSubscription!: Subscription;

  constructor(
    private pokemonService: PokemonService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['from']) {
      this.backRoute = navigation.extras.state['from'];
    }
    this.loadFavorites();
    this.setupFavoritesSubscription();
  }

  ngOnDestroy() {
    this.favoritesSubscription?.unsubscribe();
  }

  private setupFavoritesSubscription() {
    this.favoritesSubscription = this.pokemonService.favorites$.subscribe(
      () => {
        this.loadFavorites();
      }
    );
  }

  async loadFavorites() {
    this.isLoading = true;
    this.errorMessage = null;
    this.favoriteDetails = [];
    try {
      this.favoriteIds = await this.pokemonService.getFavorites();
      if (this.favoriteIds.length > 0) {
        const detailPromises = this.favoriteIds.map((id) =>
          this.pokemonService.getPokemonDetails(id).toPromise()
        );
        const details = await Promise.all(detailPromises);
        this.favoriteDetails = details.filter(
          (detail): detail is PokemonDetails => !!detail && 'id' in detail
        );
      }
    } catch (error) {
      this.errorMessage = 'Erro ao carregar favoritos. Tente novamente.';
      console.error('Erro ao carregar favoritos:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async toggleFavorite(id: number) {
    await this.pokemonService.toggleFavorite(id);
  }

  goToDetail(id: number) {
    this.router.navigate(['/pokemon/detail', id], {
      state: {
        from: '/pokemon/favorites',
        fromUrl: this.router.url,
      },
    });
  }
}

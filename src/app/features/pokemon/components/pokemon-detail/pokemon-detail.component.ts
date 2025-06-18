import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from 'src/app/core/services/pokemon.service';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonToast,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';
import { PokemonDetails } from 'src/app/core/models/pokemon.model';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Subscription } from 'rxjs';
import { PokemonCardComponent } from 'src/app/shared/components/pokemon-card/pokemon-card.component';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    IonToast,
    PokemonCardComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PokemonDetailComponent implements OnInit, OnDestroy {
  pokemonDetails: PokemonDetails | null = null;
  isLoading: boolean = true;
  hasError: boolean = false;
  isFavorite: boolean = false;
  isToastOpen = false;
  toastMessage = '';
  toastColor = 'success';
  toastIcon = 'heart';
  toastCssClass = '';
  private favoritesSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService
  ) {
    addIcons({ heart, heartOutline });
  }

  ngOnInit() {
    this.loadPokemonDetails();
    this.setupFavoritesSubscription();
  }

  ngOnDestroy() {
    this.favoritesSubscription?.unsubscribe();
  }

  private setupFavoritesSubscription() {
    this.favoritesSubscription = this.pokemonService.favorites$.subscribe(
      (favorites) => {
        if (this.pokemonDetails?.id) {
          this.isFavorite = favorites.includes(this.pokemonDetails.id);
        }
      }
    );
  }

  private async loadPokemonDetails() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.isFavorite = await this.pokemonService.isFavorite(id);

      this.pokemonService.getPokemonDetails(id).subscribe({
        next: (details) => {
          if (details && details.id) {
            this.pokemonDetails = details;
          } else {
            this.hasError = true;
            this.showErrorToast('Pokémon não encontrado');
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.hasError = true;
          this.isLoading = false;
          this.showErrorToast('Erro ao carregar detalhes');
        },
      });
    } else {
      this.hasError = true;
      this.isLoading = false;
      this.showErrorToast('ID inválido');
    }
  }

  async toggleFavorite(id?: number) {
    if (!id) return;

    try {
      await this.pokemonService.toggleFavorite(id);
      this.isFavorite = await this.pokemonService.isFavorite(id);

      const pokemonName = this.pokemonDetails?.name || 'Pokémon';
      if (this.isFavorite) {
        this.toastIcon = 'heart';
        this.toastCssClass = 'toast-heart-pop';
        this.showSuccessToast(`${pokemonName} adicionado aos favoritos!`);
      } else {
        this.toastIcon = 'heart-outline';
        this.toastCssClass = 'toast-heart-fade';
        this.showWarningToast(`${pokemonName} removido dos favoritos!`);
      }
    } catch (error) {
      this.toastIcon = 'heart';
      this.toastCssClass = 'toast-shake';
      this.showErrorToast('Erro ao atualizar favoritos');
      console.error('Error toggling favorite:', error);
    }
  }

  private showSuccessToast(message: string) {
    this.toastMessage = message;
    this.toastColor = 'success';
    this.isToastOpen = true;
  }

  private showWarningToast(message: string) {
    this.toastMessage = message;
    this.toastColor = 'warning';
    this.isToastOpen = true;
  }

  private showErrorToast(message: string) {
    this.toastMessage = message;
    this.toastColor = 'danger';
    this.isToastOpen = true;
  }

  get typesFormatted(): string {
    return (
      this.pokemonDetails?.types?.map((t) => t.type.name).join(', ') ?? 'N/A'
    );
  }

  get heightInMeters(): string {
    return this.pokemonDetails?.height
      ? (this.pokemonDetails.height / 10).toFixed(2)
      : 'N/A';
  }

  get weightInKg(): string {
    return this.pokemonDetails?.weight
      ? (this.pokemonDetails.weight / 10).toFixed(2)
      : 'N/A';
  }
}

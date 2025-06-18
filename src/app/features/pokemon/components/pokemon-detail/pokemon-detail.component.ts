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
  IonSpinner,
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
    IonSpinner,
    PokemonCardComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PokemonDetailComponent implements OnInit, OnDestroy {
  pokemonDetails: PokemonDetails | null = null;
  isLoading: boolean = true;
  hasError: boolean = false;
  isFavorite: boolean = false;
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
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.hasError = true;
          this.isLoading = false;
        },
      });
    } else {
      this.hasError = true;
      this.isLoading = false;
    }
  }

  async toggleFavorite(id?: number) {
    if (!id) return;
    await this.pokemonService.toggleFavorite(id);
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

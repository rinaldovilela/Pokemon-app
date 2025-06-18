import { Component, OnInit } from '@angular/core';
import { PokemonService } from 'src/app/core/services/pokemon.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PokemonDetails } from 'src/app/core/models/pokemon.model';
import { Router, ActivatedRoute } from '@angular/router';
import { from } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-pokemon-favorites',
  templateUrl: './pokemon-favorites.component.html',
  styleUrls: ['./pokemon-favorites.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class PokemonFavoritesComponent implements OnInit {
  favoriteIds: number[] = [];
  favoriteDetails: PokemonDetails[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(
    private pokemonService: PokemonService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadFavorites();
  }

  async loadFavorites() {
    this.isLoading = true;
    this.errorMessage = null;
    try {
      this.favoriteIds = await this.pokemonService.getFavorites();
      if (this.favoriteIds.length > 0) {
        const detailObservables = this.favoriteIds.map((id) =>
          this.pokemonService.getPokemonDetails(id).pipe(
            catchError((error) => {
              console.error(`Erro ao carregar Pokémon ID ${id}:`, error);
              return [];
            })
          )
        );
        const details = await Promise.all(
          detailObservables.map((obs) => obs.toPromise())
        );
        this.favoriteDetails = details.filter(
          (d): d is PokemonDetails => !!d && d.id !== undefined
        );
      }
    } catch (error) {
      this.errorMessage = 'Erro ao carregar favoritos. Tente novamente.';
      console.error('Erro geral ao carregar favoritos:', error);
    } finally {
      this.isLoading = false;
    }
  }

  goToDetail(id: number) {
    this.router.navigate(['detail', id], { relativeTo: this.route });
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from 'src/app/core/services/pokemon.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PokemonDetails } from 'src/app/core/models/pokemon.model';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class PokemonDetailComponent implements OnInit {
  pokemonDetails: PokemonDetails | null = null; // null antes do carregamento ou em caso de erro
  isLoading: boolean = true;
  hasError: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Carregando detalhes do Pokémon com ID:', id);
    if (id) {
      this.pokemonService.getPokemonDetails(id).subscribe({
        next: (details) => {
          if (details && details.id) {
            this.pokemonDetails = details;
          } else {
            this.hasError = true;
            console.error('Invalid Pokémon details:', details);
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.hasError = true;
          this.isLoading = false;
          console.error('Erro ao carregar detalhes:', err);
        },
      });
    } else {
      this.hasError = true;
      this.isLoading = false;
      console.error('ID inválido fornecido:', id);
    }
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

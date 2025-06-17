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
  pokemonDetails: PokemonDetails | undefined;

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.pokemonService.getPokemonDetails(id).subscribe((details) => {
        if (details && details.id) {
          // Check if details are valid
          this.pokemonDetails = details;
        } else {
          console.error('Invalid Pokémon details:', details);
          this.pokemonDetails = undefined;
        }
        console.log('Detalhes do Pokémon:', this.pokemonDetails);
      });
    }
  }

  // Format types as a comma-separated string
  get typesFormatted(): string {
    return (
      this.pokemonDetails?.types?.map((t) => t.type.name).join(', ') ?? 'N/A'
    );
  }

  // Calculate height in meters
  get heightInMeters(): string {
    return this.pokemonDetails?.height
      ? (this.pokemonDetails.height / 10).toFixed(2)
      : 'N/A';
  }

  // Calculate weight in kilograms
  get weightInKg(): string {
    return this.pokemonDetails?.weight
      ? (this.pokemonDetails.weight / 10).toFixed(2)
      : 'N/A';
  }
}

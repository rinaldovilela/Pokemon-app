import { Component, OnInit } from '@angular/core';
import { PokemonService } from 'src/app/core/services/pokemon.service';
import { Pokemon } from 'src/app/core/models/pokemon.model';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ThemeToggleComponent], // Importar módulos necessários
})
export class PokemonListComponent implements OnInit {
  pokemons: Pokemon[] = [];
  offset: number = 0;
  limit: number = 20;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
    this.loadPokemons();
  }

  loadPokemons() {
    this.pokemonService
      .getPokemonList(this.offset, this.limit)
      .pipe(
        catchError((error) => {
          console.error('Erro ao carregar Pokémons:', error);
          return throwError(() => new Error('Falha na requisição à PokeAPI'));
        })
      )
      .subscribe((data) => {
        this.pokemons = data.results;
        console.log('Pokémons carregados:', this.pokemons);
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
}

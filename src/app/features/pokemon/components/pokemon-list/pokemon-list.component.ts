import { Component, OnInit, HostListener } from '@angular/core';
import { PokemonService } from 'src/app/core/services/pokemon.service';
import { Pokemon } from 'src/app/core/models/pokemon.model';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ThemeToggleComponent],
})
export class PokemonListComponent implements OnInit {
  pokemons: Pokemon[] = [];
  offset: number = 0;
  limit: number = 20;
  isSmallScreen: boolean = false;
  favoriteStates: { [key: number]: boolean } = {}; // Estado local dos favoritos

  constructor(
    private pokemonService: PokemonService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadPokemons();
    this.checkScreenSize();
    this.initializeFavoriteStates();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth <= 576;
  }

  async initializeFavoriteStates() {
    const ids = this.pokemons.map((p) => this.getIdFromUrl(p.url));
    for (const id of ids) {
      this.favoriteStates[id] = await this.pokemonService.isFavorite(id);
    }
  }

  loadPokemons() {
    this.pokemonService
      .getPokemonList(this.offset, this.limit)
      .subscribe((data) => {
        this.pokemons = data.results;
        this.initializeFavoriteStates();
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

  goToDetail(id: number) {
    this.router.navigate(['detail', id], { relativeTo: this.route });
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
    this.favoriteStates[id] = await this.pokemonService.isFavorite(id);
    console.log(`Pokémon ${id} favoritado/desfavoritado`);
  }
}

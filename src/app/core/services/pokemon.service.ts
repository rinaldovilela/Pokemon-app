import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Pokemon, PokemonDetails } from '../models/pokemon.model';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2';
  private storageReady: boolean = false;

  constructor(private http: HttpClient, private storage: Storage) {
    this.initStorage();
  }

  private async initStorage() {
    await this.storage.create();
    this.storageReady = true;
  }

  /**
   * Busca a lista de Pokémons com base em offset e limit.
   * @param offset Número inicial da paginação.
   * @param limit Quantidade de itens por página.
   * @returns Observable com a lista de Pokémons.
   */
  getPokemonList(
    offset: number = 0,
    limit: number = 20
  ): Observable<{ results: Pokemon[] }> {
    return this.http
      .get<{ results: Pokemon[] }>(
        `${this.apiUrl}/pokemon?offset=${offset}&limit=${limit}`
      )
      .pipe(
        catchError((error) => {
          console.error('Erro ao buscar lista de Pokémons:', error);
          return of({ results: [] });
        })
      );
  }

  /**
   * Busca os detalhes de um Pokémon específico por ID.
   * @param id Identificador único do Pokémon.
   * @returns Observable com os detalhes do Pokémon.
   */
  getPokemonDetails(id: number): Observable<PokemonDetails> {
    return this.http.get<PokemonDetails>(`${this.apiUrl}/pokemon/${id}`).pipe(
      catchError((error) => {
        console.error('Erro ao buscar detalhes do Pokémon:', error);
        return of({} as PokemonDetails);
      })
    );
  }

  /**
   * Adiciona ou remove um Pokémon dos favoritos.
   * @param id Identificador do Pokémon.
   * @returns Promise<boolean> indicando sucesso.
   */
  async toggleFavorite(id: number): Promise<boolean> {
    if (!this.storageReady) await this.initStorage();
    const favorites = (await this.storage.get('favorites')) || [];
    const index = favorites.indexOf(id);
    if (index === -1) {
      favorites.push(id);
    } else {
      favorites.splice(index, 1);
    }
    await this.storage.set('favorites', favorites);
    return true;
  }

  /**
   * Verifica se um Pokémon está nos favoritos.
   * @param id Identificador do Pokémon.
   * @returns Promise<boolean> indicando se está nos favoritos.
   */
  async isFavorite(id: number): Promise<boolean> {
    if (!this.storageReady) await this.initStorage();
    const favorites = (await this.storage.get('favorites')) || [];
    return favorites.includes(id);
  }

  /**
   * Retorna a lista de IDs de Pokémons favoritos.
   * @returns Promise<number[]> com os IDs dos favoritos.
   */
  async getFavorites(): Promise<number[]> {
    if (!this.storageReady) await this.initStorage();
    return (await this.storage.get('favorites')) || [];
  }
}

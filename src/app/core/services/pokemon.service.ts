import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, catchError, take } from 'rxjs/operators';
import { Pokemon, PokemonDetails } from '../models/pokemon.model';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2';
  private storageReady: boolean = false;
  private favoritesSubject = new BehaviorSubject<number[]>([]);
  public favorites$ = this.favoritesSubject.asObservable();

  constructor(private http: HttpClient, private storage: Storage) {
    this.initStorage();
  }

  private async initStorage() {
    await this.storage.create();
    this.storageReady = true;
    const favorites = (await this.storage.get('favorites')) || [];
    this.favoritesSubject.next(favorites);
  }

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

  getPokemonDetails(id: number): Observable<PokemonDetails> {
    return this.http.get<PokemonDetails>(`${this.apiUrl}/pokemon/${id}`).pipe(
      catchError((error) => {
        console.error('Erro ao buscar detalhes do Pokémon:', error);
        return of({} as PokemonDetails);
      })
    );
  }

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
    this.favoritesSubject.next(favorites);
    return true;
  }

  async isFavorite(id: number): Promise<boolean> {
    const favorites = this.favoritesSubject.value;
    return favorites.includes(id);
  }

  async getFavorites(): Promise<number[]> {
    if (!this.storageReady) await this.initStorage();
    return (await this.storage.get('favorites')) || [];
  }
}

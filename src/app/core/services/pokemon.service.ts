import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Pokemon, PokemonDetails } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  getPokemonList(
    offset: number = 0,
    limit: number = 20
  ): Observable<{ results: Pokemon[] }> {
    return this.http.get<{ results: Pokemon[] }>(
      `${this.apiUrl}/pokemon?offset=${offset}&limit=${limit}`
    );
  }

  getPokemonDetails(id: number): Observable<PokemonDetails> {
    return this.http.get<PokemonDetails>(`${this.apiUrl}/pokemon/${id}`).pipe(
      catchError((error) => {
        console.error('Erro ao buscar detalhes do Pokémon:', error);
        throw error;
      })
    );
  }
}

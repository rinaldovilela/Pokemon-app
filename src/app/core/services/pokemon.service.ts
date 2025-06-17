import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Pokemon, PokemonDetails } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

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
          return of({ results: [] }); // Retorna lista vazia em caso de erro
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
        return of({} as PokemonDetails); // Retorna objeto vazio tipado em caso de erro
      })
    );
  }
}

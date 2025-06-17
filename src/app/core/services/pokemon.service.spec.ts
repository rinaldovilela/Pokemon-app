import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { PokemonService } from './pokemon.service';

describe('PokemonService', () => {
  let service: PokemonService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PokemonService],
    });
    service = TestBed.inject(PokemonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch pokemon list', () => {
    const mockResponse = {
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      ],
    };
    service.getPokemonList(0, 20).subscribe((data) => {
      expect(data.results.length).toBe(1);
      expect(data.results[0].name).toBe('bulbasaur');
    });
    const req = httpMock.expectOne(
      'https://pokeapi.co/api/v2/pokemon?offset=0&limit=20'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  afterEach(() => {
    httpMock.verify();
  });
});

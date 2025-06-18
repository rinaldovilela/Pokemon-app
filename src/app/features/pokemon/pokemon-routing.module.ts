import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { PokemonDetailComponent } from './components/pokemon-detail/pokemon-detail.component';
import { PokemonFavoritesComponent } from './components/pokemon-favorites/pokemon-favorites.component';

const routes: Routes = [
  { path: '', component: PokemonListComponent },
  { path: 'detail/:id', component: PokemonDetailComponent },
  { path: 'favorites', component: PokemonFavoritesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PokemonRoutingModule {}

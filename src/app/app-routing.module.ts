import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PokemonListComponent } from './features/pokemon/components/pokemon-list/pokemon-list.component';

const routes: Routes = [
  {
    path: 'pokemon',
    loadChildren: () =>
      import('./features/pokemon/pokemon.module').then((m) => m.PokemonModule),
  },
  { path: '', redirectTo: '/pokemon', pathMatch: 'full' },
  { path: '**', redirectTo: '/pokemon' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

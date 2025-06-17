import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PokemonListComponent } from './features/pokemon/components/pokemon-list/pokemon-list.component';

const routes: Routes = [
  {
    path: 'pokemon',
    component: PokemonListComponent,
  },
  { path: '', redirectTo: '/pokemon', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

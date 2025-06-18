import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { PokemonDetailComponent } from './components/pokemon-detail/pokemon-detail.component';
import { PokemonRoutingModule } from './pokemon-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IonicModule,
    PokemonRoutingModule,
    PokemonListComponent,
    PokemonDetailComponent,
  ],
})
export class PokemonModule {}

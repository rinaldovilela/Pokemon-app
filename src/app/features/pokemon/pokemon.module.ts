import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { PokemonRoutingModule } from './pokemon-routing.module';
const routes: Routes = [];

@NgModule({
  declarations: [PokemonListComponent],
  imports: [CommonModule, IonicModule, PokemonRoutingModule],
})
export class PokemonModule {}

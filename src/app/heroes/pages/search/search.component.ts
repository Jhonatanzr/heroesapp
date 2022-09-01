import { Component, OnInit } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Heroe } from '../../interface/heroes.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {

  termino: string = '';
  heroes: Heroe[] = [];
  heroeSeleccionado!: Heroe | undefined;

  constructor( private heroesService: HeroesService ) { }

  ngOnInit(): void {
  }

  buscando(){
    if (!this.termino.trim()) return;

    this.heroesService.getSugerencias( this.termino.trim() )
        .subscribe( heroes => {this.heroes = heroes
        // console.log(heroes)
      });
  }

  opcionSeleccionada( event: MatAutocompleteSelectedEvent ){
    if (!event.option.value) {
      this.heroeSeleccionado = undefined;
      return;
    }
    
    const heroe: Heroe = event.option.value;
    this.termino = heroe.superhero;

    this.heroesService.getHeroePorId( heroe.id! )
        .subscribe( heroe => this.heroeSeleccionado = heroe );
  }
}

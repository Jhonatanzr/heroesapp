import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, throwError } from 'rxjs';
import { Heroe, Publisher } from '../../interface/heroes.interface';
import { HeroesService } from '../../services/heroes.service';
import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styles: [
    `
    img {
      width: 100%;
      border-radius: 5px;
    }
    `
  ]
})
export class AddComponent implements OnInit {

  publisher = [
    {
      id: 'DC Comics',
      desc: 'DC - Comics'
    },
    {
      id: 'Marvel Comics',
      desc: 'Marvel - Comics'
    }
  ];

  heroe: Heroe ={
    superhero: '',
    alter_ego: '',
    characters: '',
    first_appearance: '',
    publisher: Publisher.DCComics,
    alt_img: ''
  };

  constructor( private activateRoute: ActivatedRoute,
               private heroesService: HeroesService,
               private router: Router,
               private snackBar: MatSnackBar,
               public dialog: MatDialog) { }

  ngOnInit(): void {
    // console.log(this.router.url)
    if ( !this.router.url.includes('editar') ) {
      return;
    }

    this.activateRoute.params
        .pipe(
          switchMap( ({ id }) => this.heroesService.getHeroePorId( id ) )
        )
        .subscribe( heroe => this.heroe = heroe);
  }

  saveHero(){
    if( this.heroe.superhero.trim().length === 0) return;

    if( this.heroe.id ){
      this.heroesService.editHero( this.heroe )
          .subscribe( resp => this.mostrarSnakbar('Registro actualizado'))
    } else {
      this.heroesService.addHero( this.heroe )
      .subscribe( heroe => {
        this.router.navigate(['/heroes/editar', heroe.id]);
        this.mostrarSnakbar('Registro creado');
        // console.log(heroe);
      });

    }
  }

  deleteHero(){
    const dialog = this.dialog.open( ConfirmarComponent, {
      width: '300px',
      data: {...this.heroe}
    });

    dialog.afterClosed()
          .pipe(
            switchMap( resp => resp ? this.heroesService.deleteHero( this.heroe.id! ): throwError(() => new Error('Eliminacion Cancelada')) )
          )
          .subscribe({
              next: resp => {
                      this.router.navigate(['/heroes']);
                    },
              error: (err) => console.log(err.message)
            });
  }

  mostrarSnakbar( mensaje: string ){
    this.snackBar.open( mensaje, 'Ok!', {
      duration: 2500
    });
  }

}

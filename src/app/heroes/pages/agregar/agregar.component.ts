import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';
import { Heroe, Publisher } from '../../interfaces/heroes.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [
    `
    img{
      width: 48%;
      border-radius: 5px;
      margin-left: 25%;
    }
    `
  ]
})
export class AgregarComponent implements OnInit {

  publishers = [
    {
      id: 'DC Comics',
      des: 'DC-Comics'
    },
    {
      id: 'Marvel Comics',
      des: 'Marvel-Comics'
    }
  ];

  heroe: Heroe = {
    superhero: '',
    alter_ego: '',
    characters: '',
    first_appearance: '',
    publisher: Publisher.DCComics,
    alt_img: '',
  }

  constructor( private heroesService: HeroesService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private _snackBar: MatSnackBar,
              public dialog: MatDialog) { }

  ngOnInit(): void {

    if(!this.router.url.includes('editar')) {
      return;
    }
    this.activatedRoute.params
      .pipe(
        switchMap(({id}) => this.heroesService.getHeroePorId(id))
      )
      .subscribe(heroe => this.heroe = heroe);
  }

  addHero() {
    if (this.heroe.superhero.trim().length === 0) {
      return;
    }
    if(this.heroe.id) {
      this.heroesService.updateHeroe(this.heroe)
        .subscribe(heroe => this.openSnackBar(`${heroe.superhero} actualizado`));
    }else {
      this.heroesService.crearHeroe(this.heroe)
        .subscribe(heroe => {
          this.router.navigate(['/heroes/editar', heroe.id]);
          this.openSnackBar(`Registro de ${heroe.superhero} exitoso`);
        });
    }
  }

  deletHero() {
  
    const dialog = this.dialog.open(ConfirmarComponent, {
      width: '250px'
    });
    dialog.afterClosed().subscribe(
      (result) => {
        if(result){
          this.heroesService.deleteHeroe(this.heroe.id!)
          .subscribe(() => this.router.navigate(['/heroes']));
        }
      }
    )
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'ok!', {
      duration: 2500,
      data: {...this.heroe}
    });
  }

}

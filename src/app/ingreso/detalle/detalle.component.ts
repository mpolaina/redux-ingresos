import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { IngresoGasto } from 'src/app/models/ingresos.model';

import { Subscription } from 'rxjs';

import { registerLocaleData } from "@angular/common";
import localeEs from "@angular/common/locales/eu";
import { IngresosService } from '../../services/ingresos.service';
import Swal from 'sweetalert2';
registerLocaleData(localeEs, "es");

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnInit, OnDestroy {

  ingresos: IngresoGasto[] = []
  ingresoSubs: Subscription

  constructor(
      private store: Store<AppState>,
      private ingresoService: IngresosService
  ) { }

  ngOnInit(): void {

    // OBSERVABLE DE INGRESOS-GASTOS
    this.ingresoSubs = this.store.select('ingresosGastos')
                          .subscribe( ({ items }) =>  this.ingresos = items )

  }

  ngOnDestroy(): void {
    this.ingresoSubs.unsubscribe()
  }

  borrarItem( uid: string ) {
    this.ingresoService.borrarIngreso( uid )
        .then( () => Swal.fire('Borrado', 'Item Borrado',  'success') )
        .catch( err => Swal.fire('Error', err.message ,  'error') )
  }



}

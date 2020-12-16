import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as igActions from '../ingreso/ingreso-gasto.actions';

import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { IngresosService } from '../services/ingresos.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  userSubs: Subscription
  ingresosSubs: Subscription

  constructor(
      private store: Store<AppState>,
      private ingresoService: IngresosService
  ) { }

  ngOnInit(): void {

    // OBSERVABLE DE USUARIO excluyendo cuando sea nulo
    this.userSubs = this.store.select('user')
        .pipe( filter( auth => auth.user != null) )
        .subscribe( ( {user} ) => {

          // OBS DE ITEMS DEL USUARIO LOGEADO fb == Set Items en el store

          this.ingresosSubs = this.ingresoService.initIngresosGastosListener( user.uid )
            .subscribe( ingresosGastosFB => {

                this.store.dispatch( igActions.setItems( { items: ingresosGastosFB } ) )

            } )
        })
  }

  ngOnDestroy(): void {
    this.ingresosSubs.unsubscribe()
    this.userSubs.unsubscribe()
  }

}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { IngresoGasto } from '../models/ingresos.model';
import { IngresosService } from '../services/ingresos.service';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as ui from '../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  styles: [
  ]
})
export class IngresoComponent implements OnInit, OnDestroy {

  ingresoForm:   FormGroup
  tipo:            string = 'ingreso'
  cargando:       boolean = false
  loadingSubs: Subscription

  constructor(
      private fb: FormBuilder,
      private ingresoService :IngresosService,
      private store: Store<AppState>
  ) { }

  ngOnInit(): void {

      this.ingresoForm = this.fb.group({
          descripcion: ['', Validators.required],
          importe: ['', Validators.required],
      })

      // this.store.select('ui').subscribe( ui => this.cargando = ui.isLoading)
      this.loadingSubs = this.store.select('ui')
          .subscribe( ({ isLoading }) => this.cargando = isLoading)

  }

  ngOnDestroy(): void {
    this.loadingSubs.unsubscribe()
  }

  guardar(){

      if ( this.ingresoForm.invalid ) { return }

      this.store.dispatch( ui.isLoading() )

      const { descripcion, importe } = this.ingresoForm.value
      const ingresoGasto = new IngresoGasto( descripcion, importe, this.tipo)

      this.ingresoService.crearIngreso( ingresoGasto )
          .then( () => {
              this.ingresoForm.reset() // reset formulario
              this.store.dispatch( ui.stopLoading() ) // cancelar loading
              Swal.fire('Registro creado', descripcion, 'success')
          })
          .catch( err => {
              this.store.dispatch( ui.stopLoading() )
              Swal.fire('Error', err.message, 'error')
          })
  }

}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { ChartsModule } from 'ng2-charts';

import { DashboardRoutingModule } from '../dashboard/dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';

// Componentes
import { DashboardComponent } from '../dashboard/dashboard.component';
import { IngresoComponent } from './ingreso.component';
import { EstadisticaComponent } from './estadistica/estadistica.component';
import { DetalleComponent } from './detalle/detalle.component';
import { OrdenIngresoPipe } from '../pipes/orden-ingreso.pipe';
import { StoreModule } from '@ngrx/store';
import { ingresoGastoReducer } from './ingreso-gasto.reducer';



@NgModule({
  declarations: [
    DashboardComponent,
    IngresoComponent,
    EstadisticaComponent,
    DetalleComponent,
    OrdenIngresoPipe
  ],
  imports: [
    CommonModule,
    StoreModule.forFeature(  'ingresosGastos', ingresoGastoReducer ),
    ReactiveFormsModule,
    ChartsModule,
    SharedModule,
    DashboardRoutingModule
  ]
})
export class IngresoModule { }

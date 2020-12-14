import { Routes } from '@angular/router';

import { EstadisticaComponent } from '../ingreso/estadistica/estadistica.component';
import { IngresoComponent } from '../ingreso/ingreso.component';
import { DetalleComponent } from '../ingreso/detalle/detalle.component';

export const dashboardRoutes: Routes = [

  { path: '', component: EstadisticaComponent },
  { path: 'ingreso', component: IngresoComponent },
  { path: 'detalle', component: DetalleComponent },

];

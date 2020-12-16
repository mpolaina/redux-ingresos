import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { IngresoGasto } from '../../models/ingresos.model';

import { MultiDataSet, Label } from 'ng2-charts';


@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: [
  ]
})
export class EstadisticaComponent implements OnInit {

  ingresos: number = 0
  gastos: number = 0

  totalIngresos: number = 0
  totalGastos: number = 0


    // Doughnut
    public doughnutChartLabels: Label[] = ['Ingresos', 'Gastos'];
    public doughnutChartData: MultiDataSet = [[]];

  constructor( private store: Store<AppState> ) { }

  ngOnInit(): void {

      this.store.select('ingresosGastos')
        .subscribe( ({items}) => this.generarEstadistica( items ))

  }

  generarEstadistica( items: IngresoGasto[]) {

    // evitar que aumente por la suscripción a los ingresos activa
    this.ingresos = 0
    this.gastos = 0
    this.totalIngresos = 0
    this.totalGastos = 0

    for (const item of items) {

        if ( item.tipo === 'ingreso') {
          this.totalIngresos += item.importe
          this.ingresos++ // para contar el num de ingresos
        } else {
          this.totalGastos += item.importe
          this.gastos++
        }
    }

    this.doughnutChartData = [ [this.totalIngresos, this.totalGastos] ]

  }

}

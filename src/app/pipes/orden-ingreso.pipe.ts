import { Pipe, PipeTransform } from '@angular/core';
import { IngresoGasto } from '../models/ingresos.model';

@Pipe({
  name: 'ordenIngreso'
})
export class OrdenIngresoPipe implements PipeTransform {

  transform( items: IngresoGasto[] ): IngresoGasto[] {

      return items.slice().sort( (a, b) => {
          // ordenamos los ingresos antes que los gastos
          if ( a.tipo === 'ingreso') {
            return -1
          } else {
            return 1
          }

      })
  }

}

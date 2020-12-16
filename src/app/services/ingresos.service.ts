import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore'
import { map } from 'rxjs/operators';
import { IngresoGasto } from '../models/ingresos.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IngresosService {

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService) { }

  crearIngreso( ingreso: IngresoGasto ) {

      const { uid } = this.authService.user // viene del GET del authservice.
      delete ingreso.uid
      return this.firestore.doc(`${ uid }/ingresos-gastos`)
              .collection('items')
              .add( {...ingreso} )
              // ... fb requiere propiedades no la instancia de clase
  }

  initIngresosGastosListener( uid: string ){

      // uid lo recibe del dashboard.comp.ts
      return this.firestore.collection( `${ uid }/ingresos-gastos/items` )
          .snapshotChanges()
          .pipe(
            map( snapshot => snapshot.map( documento => ( {
                // const data:{} = documento.payload.doc.data()
                   uid: documento.payload.doc.id,
                   ...documento.payload.doc.data() as any // ...data
                } )
              )
            )
          )
  }

  borrarIngreso( uidItem: string ) {

      const { uid } = this.authService.user
      return this.firestore.doc( `${ uid }/ingresos-gastos/items/${ uidItem }` )
          .delete()
  }
}

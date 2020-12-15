import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as auth from '../auth/auth.actions';

import { map } from 'rxjs/operators'
import { Usuario } from '../models/usuario.model';
import { Subscription } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  autenticado: Subscription

  constructor(
      public auth: AngularFireAuth,
      public firestore: AngularFirestore,
      private store: Store<AppState> ) { }

  initAuthListener(){
      // se carga en el app.component
      this.auth.authState.subscribe( fireUser => {
          // console.log( fireUser )
          if ( fireUser ) {
            // existe usuario
            this.autenticado = this.firestore.doc(`${ fireUser.uid }/usuario`).valueChanges()
                .subscribe( (fireUser: any) => {
                  // nueva instancia de usuario
                  const usuario = Usuario.fromFirebase( fireUser )
                  // establecemos usuario
                  this.store.dispatch( auth.setUser( {user: usuario} ) )
                })
          } else {
            // no existe
            this.autenticado.unsubscribe()
            this.store.dispatch( auth.unSetUser( ) )
          }
      })
  }

  crearUsuario( nombre: string, email: string, password: string) {

      return this.auth.createUserWithEmailAndPassword(email, password)
              .then( ({ user }) => {
                 const newUser = new Usuario( user.uid, nombre, user.email )
                 // firebase no acepta instancias de clase, hay que expandirla a sus elem
                 return this.firestore.doc(`${ user.uid }/usuario`).set( {...newUser} )
              })
  }

  loginUsuario( email: string, password: string ) {

      return this.auth.signInWithEmailAndPassword( email, password )
  }

  logout() { return this.auth.signOut() }

  isAuth() {

    return this.auth.authState.pipe(
      map( firebaseUser => firebaseUser != null )
      // devuelve un true si el usuario es != a null
    )
  }
}

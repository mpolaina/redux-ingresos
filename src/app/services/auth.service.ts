import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as auth from '../auth/auth.actions';
import * as ingresos from '../ingreso/ingreso-gasto.actions';

import { map } from 'rxjs/operators'
import { Usuario } from '../models/usuario.model';
import { Subscription } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  autenticado: Subscription
  private _usuarioAuth: Usuario

  // con este get tomamos el usuario desde el ingreso.service
  get user() {
    return {... this._usuarioAuth }
  }

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
                  // nueva instancia de usuario desde fb
                  const usuario = Usuario.fromFirebase( fireUser )
                  this._usuarioAuth = usuario

                  // [Auth] setUser
                  this.store.dispatch( auth.setUser( {user: usuario} ) )
                })
          } else {
            // no existe o cerró sesión
            this._usuarioAuth = null
            //this.store.dispatch( auth.unSetUser( ) )
            //this.store.dispatch( ingresos.unSetItems() )
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

  logout() {
    this.autenticado.unsubscribe()
    this.store.dispatch( auth.unSetUser( ) )
    this.store.dispatch( ingresos.unSetItems() )
    return this.auth.signOut()
  }

  isAuth() {

    return this.auth.authState.pipe(
      map( firebaseUser => firebaseUser != null )
      // devuelve un true si el usuario es != a null
    )
  }
}

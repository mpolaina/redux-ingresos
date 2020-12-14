import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators'
import { Usuario } from '../models/usuario.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( public auth: AngularFireAuth,
               public firestore: AngularFirestore ) { }

  initAuthListener(){
    this.auth.authState.subscribe( firebaseUser => {
      console.log( firebaseUser )
      console.log( firebaseUser?.uid )
      console.log( firebaseUser?.email )
    })
  }

  crearUsuario( nombre: string, email: string, password: string) {
      return this.auth.createUserWithEmailAndPassword(email, password)
              .then( ({ user }) => {

                 const newUser = new Usuario( user.uid, nombre, user.email )

                 return this.firestore.doc(`${ user.uid }/usuario`).set( {...newUser} )

              })
  }

  loginUsuario( email: string, password: string ) {
      return this.auth.signInWithEmailAndPassword( email, password )
  }

  logout(){
      return this.auth.signOut()
  }

  isAuth(){
    return this.auth.authState.pipe(
      map( firebaseUser => firebaseUser != null )
      // devuelve un true si el usuario es != a null
    )
  }
}

import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from '../../shared/ui.actions';

import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})

export class RegisterComponent implements OnInit, OnDestroy {

  registroForm: FormGroup
  cargando: boolean = false
  uiSubscription: Subscription

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private store: Store<AppState>,
    private router: Router ) { }

  ngOnInit(): void {

      this.registroForm = this.fb.group({
        nombre: ['Manuel', Validators.required],
        email: ['m.polaina@gmail.com', [Validators.required, Validators.email] ],
        password: ['123456', Validators.required]
      })

      this.uiSubscription = this.store.select('ui')
                            .subscribe( ui => this.cargando = ui.isLoading)
  }

  ngOnDestroy(): void {
      this.uiSubscription.unsubscribe()
  }

  crearUsuario(  ){

    if ( this.registroForm.invalid ) { return }

    this.store.dispatch( ui.isLoading() )

    const { nombre, email, password } = this.registroForm.value
    // firebase createUser
    this.authService.crearUsuario( nombre, email, password )
        .then( credenciales => {
          console.log(credenciales)
          this.store.dispatch( ui.stopLoading() )
          this.router.navigate(['/'])
        }).catch( error => Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message
          //text: 'Algo salió mal'
        }))

  }

}

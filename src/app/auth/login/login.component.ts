import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from '../../shared/ui.actions';

import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

import { Subscription } from 'rxjs';
import { setUser } from '../auth.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup
  cargando: boolean = false
  loadingSubs: Subscription

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState> ) { }

  ngOnInit(): void {

    this.loginForm = this.fb.group({
        email: ['m.polaina@gmail.com', Validators.required],
        password: ['123456', Validators.required]
    })

    this.loadingSubs = this.store.select('ui')
                            .subscribe( ui => this.cargando = ui.isLoading )
  }

  ngOnDestroy(): void {
    this.loadingSubs.unsubscribe()
  }

  login(){

    if ( this.loginForm.invalid ) { return }
    // al hacer click isLoading = cargando para a true
    this.store.dispatch( ui.isLoading() )

    const { email, password } = this.loginForm.value
    // firebase login
    this.authService.loginUsuario( email, password )
        .then( credenciales => {
            console.log(credenciales.user.uid)
            // al realizarse el login, isLoading = cargando para a false
            this.store.dispatch( ui.stopLoading() )
            this.router.navigate(['/'])
        })
        .catch( error => {
            this.store.dispatch( ui.stopLoading() )
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: error.message
              //text: 'Algo salió mal'
            })
        }

        )
  }

}

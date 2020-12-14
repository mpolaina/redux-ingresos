import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  registroForm: FormGroup

  constructor( private fb: FormBuilder,
               private authService: AuthService,
               private router: Router ) { }

  ngOnInit(): void {

    this.registroForm = this.fb.group({
      nombre: ['Manuel', Validators.required],
      email: ['m.polaina@gmail.com', [Validators.required, Validators.email] ],
      password: ['123456', Validators.required]
    })

  }

  crearUsuario(  ){

    if ( this.registroForm.invalid ) { return }

    Swal.fire({
      title: 'Registrando Usuario',
      didOpen: () => {
        Swal.showLoading()
      }
    })

    const { nombre, email, password } = this.registroForm.value
    this.authService.crearUsuario( nombre, email, password )
        .then( credenciales => {
          console.log(credenciales)
          Swal.close()
          this.router.navigate(['/'])
        }).catch( error => Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message
          //text: 'Algo salió mal'
        }))

  }

}

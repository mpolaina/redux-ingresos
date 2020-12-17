import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators'
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate, CanLoad {

  constructor( private authService: AuthService,
               private router: Router) {}
  canLoad(): Observable<boolean> {
    return this.authService.isAuth()
            .pipe(
                tap( logeado => {
                  if( !logeado ) { this.router.navigate(['/login']) }
                }),
                take(1) // completa la subscripción una vez se ha emitido valor.
            )
  }

  canActivate(): Observable<boolean> {
    return this.authService.isAuth().pipe(
      // disparamos un efecto secundario isAuth->true, logeado-> true
      tap( logeado => {
        if( !logeado ) {
          this.router.navigate(['/login'])
        }
      } )
    )
  }

}

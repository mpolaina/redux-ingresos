import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {

  username: string
  userSubs: Subscription

  constructor(
      private authService: AuthService,
      private router: Router,
      private store: Store<AppState>
  ) { }

  ngOnInit(): void {

       this.userSubs = this.store.select('user')
            .pipe(
               filter( ({ user }) => user != null)
            )
            .subscribe(  ({ user }) => this.username = user.nombre )

  }

  ngOnDestroy(): void {
     this.userSubs.unsubscribe()
  }

  logout(){
    this.authService.logout().then( () => {
      this.router.navigate(['/login'])
    } )

  }

}

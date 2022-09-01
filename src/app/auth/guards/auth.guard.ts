import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor( private authService: AuthService,
               private router:Router ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      return this.authService.validarAutenticacion()
                .pipe(
                  tap( resp =>{
                    if ( !resp ){
                      this.router.navigate(['./auth/login']);
                    }
                  })
                );
    
      // if ( this.authService.auth.id ){
      //   console.log( 'Cargo true AuthGuard - CanActivate' )
      //   return true;
      // }
      
      // console.log( 'Bloqueado por el AuthGuard - CanActivate' )
      // return false;
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {

      return this.authService.validarAutenticacion()
                .pipe(
                  tap( resp =>{
                    if ( !resp ){
                      this.router.navigate(['./auth/login']);
                    }
                  })
                 );
    
  //   if ( this.authService.auth.id ){
  //     console.log( 'Cargo true AuthGuard - CanLoad' )
  //     return true;
  //   }
    
  //   console.log( 'Bloqueado por el AuthGuard - CanLoad' )
  //   return false;
  }
}

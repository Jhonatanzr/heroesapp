import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../interfaces/auth.interface';
import { tap, Observable, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl;
  private _auth: Auth | undefined;

  get auth(){
    return {...this._auth};
  }

  constructor( private http: HttpClient) { }

  validarAutenticacion(): Observable<boolean> {
    if ( !localStorage.getItem('token') ){
        // console.log('No existe el toeken')
        return of(false);
    }

    return this.http.get<Auth>(`${ this.baseUrl }/usuarios/1`)
               .pipe(
                map( resp => {
                  // console.log(resp);
                  // console.log('existe el toeken')
                  this._auth = resp;
                  return true;
                })
               );

  }

  login(){
    return this.http.get<Auth>(`${ this.baseUrl }/usuarios/1`)
               .pipe(
                tap( resp => this._auth = resp ),
                tap( resp => localStorage.setItem('token', resp.id) )
               );
  }

  logout(){
    this._auth = undefined;
  }
}

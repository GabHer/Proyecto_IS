import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

const helper = new JwtHelperService();
@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {

  login = false;

  constructor( private httpClient: HttpClient, private router:Router ) {

  }

  inicioSesion( datos:any ){
    return this.httpClient.post('http://localhost:8888/login', datos)

  }
  cerrarSesion(){
   localStorage.removeItem('token');
   this.router.navigate(["/"]);
  }

  leerToken(){
    const tokenUsuario = localStorage.getItem('token');
    const tokenExpiro = helper.isTokenExpired(tokenUsuario); // helper
    if ( tokenExpiro ){
      return false;
    }

    return true;

  }
  guardarToken( token:any ){
    localStorage.setItem("token", token);
  }
  mostrarError(error:any){}
}



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
    let data = localStorage.getItem('token');
    let tokenUsuario:any;
    if( data ){
      tokenUsuario = JSON.parse(data);
    }

    const tokenExpiro = helper.isTokenExpired(tokenUsuario.token); // helper
    if ( tokenExpiro ){
      return false;
    }

    return true;

  }
  guardarToken( data:any ){

    localStorage.setItem("token", JSON.stringify({token:data.token, id:data.correo}));

  }

  mostrarError(error:any){}
}



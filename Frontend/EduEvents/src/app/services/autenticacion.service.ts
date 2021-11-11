import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

const helper = new JwtHelperService();
@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {

  constructor( private httpClient: HttpClient ) {
    this.leerToken();
  }

  inicioSesion( datos:any ){
    return this.httpClient.post('http://localhost:8888/login', datos)

  }
  cerrarSesion(){
   localStorage.removeItem('token');
   //set usuarioLogeged = false;
  }

  private leerToken(){
    const tokenUsuario = localStorage.getItem('token');
    const tokenExpiro = helper.isTokenExpired(tokenUsuario); // helper

    // set usuarioLogeged = tokenExpiro

  }
  private guardarToken(){}
  private handlerError(error:any){}
}



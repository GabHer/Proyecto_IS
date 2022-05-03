import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

const helper = new JwtHelperService();
@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {

  login = false;

  constructor( private httpClient: HttpClient, private router:Router ) {

  }

  inicioSesion( datos:any ){
    return this.httpClient.post(`${environment.API_URL}/login`, datos)

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
      const tokenExpiro = helper.isTokenExpired(tokenUsuario.token); // helper

      return tokenExpiro ? false: true;
    }



    return false;

  }
  guardarToken( data:any ){

    localStorage.setItem("token", JSON.stringify({token:data.token, id:data.correo}));

  }


  enviarCorreoRecuperarContrasena( datos:any ){
    return this.httpClient.post(`${environment.API_URL}/inicioSesion/restablecer_contrasena/verificar_correo`, datos)
  }

  validarTokenRecuperarContrasena( datos:any ){
    return this.httpClient.post(`${environment.API_URL}/inciarSesion/restablecer_contrasena/${datos.Correo}`, datos)

  }

  actualizarContrasena( datos:any ){
    return this.httpClient.post(`${environment.API_URL}/inciarSesion/restablecer_contrasena/cambio_contrasena/${datos.Correo}`, datos)
  }


  mostrarError(error:any){}
}



import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor( private httpClient: HttpClient ) { }

  obtenerUsuarios(){
    return this.httpClient.get('http://localhost:8080/registrate');
    
  }
  guardarUsuario(usuario:any){
    console.log("Guardando usuario...");
    console.log(usuario);
    return this.httpClient.post('http://localhost:8080/registrate',usuario);
  }
}

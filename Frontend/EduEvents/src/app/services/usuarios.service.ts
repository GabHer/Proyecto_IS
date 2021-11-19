import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor( private httpClient: HttpClient ) { }

  obtenerUsuarios(){
    return this.httpClient.get('http://localhost:8888/registro');


  }
  guardarUsuario(usuario:any){
    return this.httpClient.post('http://localhost:8888/registro',usuario);
  }

  obtenerUsuario(correo:string){
    return this.httpClient.get(`http://localhost:8888/registro/${correo}`);

  }
  editarUsuario(objUsuario:any){
    return this.httpClient.put(`http://localhost:8888/editar_perfil`,objUsuario );

  }

}

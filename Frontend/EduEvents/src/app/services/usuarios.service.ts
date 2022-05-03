import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor( private httpClient: HttpClient ) { }

  obtenerUsuarios(){
    return this.httpClient.get(`${environment.API_URL}/registro`);


  }
  guardarUsuario(usuario:any){
    return this.httpClient.post(`${environment.API_URL}/registro`,usuario);
  }

  obtenerUsuario(correo:string){
    return this.httpClient.get(`${environment.API_URL}/registro/${correo}`);

  }
  obtenerUsuarioPorId(id:number){
    return this.httpClient.get(`${environment.API_URL}/registro/buscarPorId/${id}`);

  }
  editarUsuario(objUsuario:any){
    return this.httpClient.put(`${environment.API_URL}/editar_perfil`,objUsuario );

  }

}

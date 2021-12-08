import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService{
  constructor( private httpClient: HttpClient ) { }

  enviarAsistencias(objAsistencia:any){
    return this.httpClient.post(`http://localhost:8888/asistencia`, objAsistencia);
  }

  emisionAsistencias(idConferencia:number){
    return this.httpClient.get(`http://localhost:8888/asistencia/asistenciaEmision/${idConferencia}`);
  }
}

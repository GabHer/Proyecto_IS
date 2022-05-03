import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AsistenciaService{
  constructor( private httpClient: HttpClient ) { }

  enviarAsistencias(objAsistencia:any){
    return this.httpClient.post(`${environment.API_URL}/asistencia`, objAsistencia);
  }

  emisionAsistencias(idConferencia:number){
    return this.httpClient.get(`${environment.API_URL}/asistencia/asistenciaEmision/${idConferencia}`);
  }

  obtenerLista(idConferencia:number){
    return this.httpClient.get(`${environment.API_URL}/asistencia/obtenerListaAsistenciaPorIdConferencia/${idConferencia}`);
  }
}

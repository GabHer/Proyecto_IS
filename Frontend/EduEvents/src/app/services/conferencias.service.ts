import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ConferenciasService {

  constructor( private httpClient: HttpClient ) { }

  obtenerConferencias( idEvento:number){
    return this.httpClient.get(`${environment.API_URL}/conferencia/obtenerConferenciasPorIdEvento/${idEvento}`);
  }

  obtenerConferenciasUsuario( idUsuario:number ){
    return this.httpClient.get(`${environment.API_URL}/conferencia/obtenerConferenciasPorIdUsuario/${idUsuario}`);

  }

  eliminarConferencia( idConferencia:number ){
    return this.httpClient.delete(`${environment.API_URL}/conferencia/eliminarConferencia/${idConferencia}`);

  }

  registrarEnConferencia( objInscripcion:any ){
    return this.httpClient.post(`${environment.API_URL}/inscripcion/NuevaInscripcion`,objInscripcion);
  }
  
  eliminarInscripcion( idParticipante:number, idConferencia:number ){
    return this.httpClient.delete(`${environment.API_URL}/inscripcion/eliminarInscripcion/${idParticipante}/${idConferencia}`);
  }
  obtenerParticipantesConferencia( idConferencia:number ){

    return this.httpClient.get(`${environment.API_URL}/inscripcion/obtenerInscripcionesPorIdConferencia/${idConferencia}`);
  }



}

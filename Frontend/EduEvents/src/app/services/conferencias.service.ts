import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConferenciasService {

  constructor( private httpClient: HttpClient ) { }

  obtenerConferencias( idEvento:number){
    return this.httpClient.get(`http://localhost:8888/conferencia/obtenerConferenciasPorIdEvento/${idEvento}`);
  }

  obtenerConferenciasUsuario( idUsuario:number ){
    return this.httpClient.get(`http://localhost:8888/conferencia/obtenerConferenciasPorIdUsuario/${idUsuario}`);

  }

  eliminarConferencia( idConferencia:number ){
    return this.httpClient.delete(`http://localhost:8888/conferencia/eliminarConferencia/${idConferencia}`);

  }

  registrarEnConferencia( objInscripcion:any ){
    return this.httpClient.post(`http://localhost:8888/inscripcion/NuevaInscripcion`,objInscripcion);
  }
  obtenerParticipantesConferencia( idConferencia:number ){
  console.log()
    return this.httpClient.get(`http://localhost:8888/inscripcion/obtenerInscripcionesPorIdConferencia/${idConferencia}`);
  }



}

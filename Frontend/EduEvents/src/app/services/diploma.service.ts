import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DiplomaService{
  constructor( private httpClient: HttpClient ) { }

  enviarFirmas(objFirmas:any){
    return this.httpClient.post(`http://localhost:8888/diplomas/gestionFirmas`, objFirmas);
  }

  seleccionFirmas(idConferencia:number){
    return this.httpClient.get(`http://localhost:8888/diplomas/seleccionFirmas/${idConferencia}`);
  }

  guardarFirmaEncargado(objFirmaEncargado:any){
    return this.httpClient.put(`http://localhost:8888/diplomas/guardarFirmaEncargado`, objFirmaEncargado);
  }

  obtenerDatosDiploma(idConferencia, idPersona){
    return this.httpClient.get(`http://localhost:8888/diplomas/obtenerDatosDiploma/${idConferencia}/${idPersona}`);
  }
}

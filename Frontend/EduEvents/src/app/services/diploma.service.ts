import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DiplomaService{
  constructor( private httpClient: HttpClient ) { }

  enviarFirmas(objFirmas:any){
    return this.httpClient.post(`${environment.API_URL}/diplomas/gestionFirmas`, objFirmas);
  }

  seleccionFirmas(idConferencia:number){
    return this.httpClient.get(`${environment.API_URL}/diplomas/seleccionFirmas/${idConferencia}`);
  }

  guardarFirmaEncargado(objFirmaEncargado:any){
    return this.httpClient.put(`${environment.API_URL}/diplomas/guardarFirmaEncargado`, objFirmaEncargado);
  }

  obtenerDatosDiploma(idConferencia, idPersona){
    return this.httpClient.get(`${environment.API_URL}/diplomas/obtenerDatosDiploma/${idConferencia}/${idPersona}`);
  }
}

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

}

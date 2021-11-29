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



}

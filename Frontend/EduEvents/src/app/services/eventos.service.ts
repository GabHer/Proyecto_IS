import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  constructor( private httpClient: HttpClient ) { }

  crearEvento( evento:any ){
    return this.httpClient.post('http://localhost:8888/eventos/nuevoEvento', evento);

  }

  obtenerEventos(){
    return this.httpClient.get(`http://localhost:8888/eventos/obtenerEventos`);
  }

  obtenerMisEventos( idUsuario:number ){
    return this.httpClient.get(`http://localhost:8888/eventos/obtenerMisEventos/${idUsuario}`);
  }

  eliminarEvento( idEvento:number ){
    return this.httpClient.delete(`http://localhost:8888/eventos/eliminarEvento/${idEvento}`);

  }

  crearConferencia( objConferencia:any ){
    return this.httpClient.post(`http://localhost:8888/conferencia`, objConferencia);
  }
}

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
}

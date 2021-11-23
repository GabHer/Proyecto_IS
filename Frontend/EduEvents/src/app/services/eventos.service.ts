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

  obtenerEventosPorEstado(estado:any){
    return this.httpClient.get(`http://localhost:8888/eventos/obtenerEventosPorEstado/${estado}`);
  }

  obtenerMisEventosPorEstado(estado:any, idUsuario:number){
    return this.httpClient.get(`http://localhost:8888/eventos/obtenerEventosPorEstadoYUsuario/${estado}/${idUsuario}`);
  }

  obtenerEventosPorFecha(fechaInicio:string, fechaFinal:string){
    return this.httpClient.get(`http://localhost:8888/eventos/obtenerEventosPorFecha/${fechaInicio}/${fechaFinal}`);
  }

  obtenerMisEventosPorFecha(fechaInicio:string, fechaFinal:string, idOrganizador:number){
    return this.httpClient.get(`http://localhost:8888/eventos/obtenerEventosPorFechaYOrganizador/${fechaInicio}/${fechaFinal}/${idOrganizador}`);
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

  obtenerEventoPorId(idEvento:number){
    return this.httpClient.get(`http://localhost:8888/eventos/obtenerEventoPorId/${idEvento}`);
  }
}

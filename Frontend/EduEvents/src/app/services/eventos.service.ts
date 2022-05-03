import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  constructor( private httpClient: HttpClient ) { }

  crearEvento( evento:any ){
    return this.httpClient.post(`${environment.API_URL}/eventos/nuevoEvento`, evento);

  }

  obtenerEventos(){
    return this.httpClient.get(`${environment.API_URL}/eventos/obtenerEventos`);
  }

  obtenerEventosPorEstado(estado:any){
    return this.httpClient.get(`${environment.API_URL}/eventos/obtenerEventosPorEstado/${estado}`);
  }

  obtenerMisEventosPorEstado(estado:any, idUsuario:number){
    return this.httpClient.get(`${environment.API_URL}/eventos/obtenerEventosPorEstadoYUsuario/${estado}/${idUsuario}`);
  }

  obtenerEventosPorFecha(fechaInicio:string, fechaFinal:string){
    return this.httpClient.get(`${environment.API_URL}/eventos/obtenerEventosPorFecha/${fechaInicio}/${fechaFinal}`);
  }

  obtenerMisEventosPorFecha(fechaInicio:string, fechaFinal:string, idOrganizador:number){
    return this.httpClient.get(`${environment.API_URL}/eventos/obtenerEventosPorFechaYOrganizador/${fechaInicio}/${fechaFinal}/${idOrganizador}`);
  }

  obtenerMisEventos( idUsuario:number ){
    return this.httpClient.get(`${environment.API_URL}/eventos/obtenerMisEventos/${idUsuario}`);
  }

  eliminarEvento( idEvento:number ){
    return this.httpClient.delete(`${environment.API_URL}/eventos/eliminarEvento/${idEvento}`);

  }

  crearConferencia( objConferencia:any ){
    return this.httpClient.post(`${environment.API_URL}/conferencia`, objConferencia);
  }

  obtenerEventoPorId(idEvento:number){
    return this.httpClient.get(`${environment.API_URL}/eventos/obtenerEventoPorId/${idEvento}`);
  }

  obtenerListaBlanca( idEvento:number ){
    return this.httpClient.get(`${environment.API_URL}/eventos/obtenerListaBlancaPorIdEvento/${idEvento}`);
  }
  obtenerDatosEstadistica( idEvento:number ){
    return this.httpClient.get(`${environment.API_URL}/asistencia/datosGraficos/${idEvento}`);
  }

}

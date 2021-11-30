import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export interface Conferencia {
  Correo_Encargado:string
  Descripcion:string
  Fecha_Inicio:Date
  Hora_Final:string
  Hora_Inicio:Date
  Id:number
  Id_Evento:number
  Imagen:string
  Limite_Participantes:number
  Medio:string
  Modalidad:number
  Nombre:string
  Tipo:number
}
@Component({
  selector: 'app-card-conferencia',
  templateUrl: './card-conferencia.component.html',
  styleUrls: ['./card-conferencia.component.css']
})
export class CardConferenciaComponent implements OnInit {

  @Input() conferencia:Conferencia;
  @Output() onListaAsistencia = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }

  obtenerFormatoFecha( date:any){

    return date.split('T')[0]
  }

  eliminarConferencia(){
    // Falta la función de eliminar conferencias en el backend
    console.log("No programado")
  }

  mostrarListaAsistencia(){
    this.onListaAsistencia.emit(null);
  }


}

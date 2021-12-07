import { Component, OnInit, Input } from '@angular/core';
import { ConferenciasService } from 'src/app/services/conferencias.service'

export interface Conferencia {
  Asistencia: null
  Correo_Encargado:string
  Descripcion:string
  Emision_Diplomas:number
  Estado_Conferencia:string
  Fecha_Inicio:Date
  Fecha_Inscripcion:Date
  Firma_Encargado:any
  Firma_Organizador:any
  Hora_Final:string
  Hora_Inicio:Date
  Id:number
  Id_Conferencia:number
  Id_Evento:number
  Id_Persona:number
  Imagen:string
  Limite_Participantes:number
  Medio:string
  Modalidad:number
  Nombre:string
  Tipo:number,
  Lista_Participantes:any
}

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  @Input() perfil:any;
  conferencias: any;
  constructor( private serviceConferencia:ConferenciasService ) { }

  ngOnInit(): void {
    console.log(this.perfil);
    this.obtenerMisInscripciones();
  }

  extraerTipo(number){
    if(number == 0){
      return "Taller"
    }else{
      return "Conferencia"
      }

  }

  obtenerMisInscripciones(){
    this.serviceConferencia.obtenerConferenciasUsuario( this.perfil.Id ).subscribe(
      (res:any) => {
        this.conferencias = res.data;
      },
      (err:any) => {
        if( err.error.codigo == 404 ) {
          this.conferencias = [];
        }
      }
    );
  }
}

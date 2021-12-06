import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { ConferenciasService } from 'src/app/services/conferencias.service'
import { SpinnerService } from 'src/app/services/spinner.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { EventosService } from 'src/app/services/eventos.service';

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
  selector: 'app-inscripciones',
  templateUrl: './inscripciones.component.html',
  styleUrls: ['./inscripciones.component.css']
})
export class InscripcionesComponent implements OnInit {

  constructor( private serviceConferencia:ConferenciasService, private eventoService:EventosService, private spinner:SpinnerService, private usuarioService:UsuariosService ) { }

  ngOnInit(): void {
    this.obtenerUsuarioActual();
  }
  usuarioActual:any;
  usuarioEncargadoConferencia:any;
  conferencias = []
  @Input() isCollaps = false;
  @Output() verDetallesEvento = new EventEmitter<any>();

  vistaActual = {
    vistaEncargado:false,
    vistaMisInscripciones: true
  }


  verEncargado(evento:any){
    this.vistaActual.vistaEncargado = !this.vistaActual.vistaEncargado
    this.vistaActual.vistaMisInscripciones = !this.vistaActual.vistaMisInscripciones
    this.usuarioEncargadoConferencia = evento;
  }

  verDetalleConferencia(){
    this.vistaActual.vistaEncargado = !this.vistaActual.vistaEncargado
    this.vistaActual.vistaMisInscripciones = !this.vistaActual.vistaMisInscripciones
  }

  obtenerCorreoUsuarioActual(){
    let tokenUsuario = localStorage.getItem("token");

    if( tokenUsuario ){

       return JSON.parse(tokenUsuario).id;

    }
    return ""
  }

  obtenerUsuarioActual(){
    let correo = this.obtenerCorreoUsuarioActual()
    this.usuarioService.obtenerUsuario( correo ).subscribe(
      (res:any) => {

        this.usuarioActual = res.data
        this.obtenerMisInscripciones()

      },
      (err:any) => {

      },
      () => {

      }
    );

  }

  obtenerEvento( idEvento:number ){
    return this.eventoService.obtenerEventoPorId(idEvento)
  }

  obtenerMisInscripciones(){
    this.spinner.mostrarSpinner();
    this.serviceConferencia.obtenerConferenciasUsuario( this.usuarioActual.Id ).subscribe(
      (res:any) => {
        this.conferencias = res.data;

        for(let i = 0; i< this.conferencias.length; i++){

          let participante = {
            Id: this.usuarioActual.Id ,
            Nombre: this.usuarioActual.Nombre,
            Apellido: this.usuarioActual.Apellido,
            Fotografia: this.usuarioActual.Fotografia
          }
          this.conferencias[i].Lista_Participantes = [participante]
        }
      },
      (err:any) => {
        if( err.error.codigo == 404 ) {
          this.conferencias = [];
        }
        this.spinner.ocultarSpinner()
      },
      () => {
        this.spinner.ocultarSpinner()

      }
    );
  }

}

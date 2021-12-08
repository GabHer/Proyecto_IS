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
  usuarioOrganizador:any;

  conferencias = []
  @Input() isCollaps = false;
  @Output() verDetallesEvento = new EventEmitter<any>();
  idConferencia:any;
  idEventoSeleccionado:number;
  vistaActual = {
    vistaEncargado:false,
    vistaOrganizador:false,
    vistaMisInscripciones: true,
    vistaListaAsistencia: false,
    vistaDetalleEvento:false,
    vistaFirmaEncargado:false
  }

  conferenciaSeleccionada:any;


  verEncargado(evento:any){
    this.vistaActual.vistaEncargado = true;
    this.vistaActual.vistaOrganizador = false;
    this.vistaActual.vistaMisInscripciones = false;
    this.vistaActual.vistaListaAsistencia = false;
    this.vistaActual.vistaDetalleEvento = false;
    this.usuarioEncargadoConferencia = evento;
    this.vistaActual.vistaFirmaEncargado = false;
  }
  verOrganizador(evento:any){


    this.vistaActual.vistaEncargado = false;
    this.vistaActual.vistaOrganizador = true;
    this.vistaActual.vistaMisInscripciones = false;
    this.vistaActual.vistaListaAsistencia = false;
    this.vistaActual.vistaDetalleEvento = false;
    this.vistaActual.vistaFirmaEncargado = false;
    this.usuarioOrganizador = evento;
  }


  verListaAsistencia( evento:any ){
    this.vistaActual.vistaListaAsistencia = this.vistaActual.vistaListaAsistencia = true
    this.vistaActual.vistaOrganizador = false;
    this.vistaActual.vistaEncargado = false
    this.vistaActual.vistaMisInscripciones =false
    this.vistaActual.vistaDetalleEvento = false;
    this.vistaActual.vistaFirmaEncargado = false;
    this.idConferencia = evento;
  }

  verDetalleConferencia(){
    this.vistaActual.vistaEncargado = !this.vistaActual.vistaEncargado
    this.vistaActual.vistaOrganizador = !this.vistaActual.vistaEncargado
    this.vistaActual.vistaMisInscripciones = !this.vistaActual.vistaMisInscripciones
    this.vistaActual.vistaListaAsistencia = !this.vistaActual.vistaListaAsistencia
    this.vistaActual.vistaDetalleEvento = false;
    this.vistaActual.vistaFirmaEncargado = false;
  }
  verDetalleEvento(evento:number){
    this.vistaActual.vistaEncargado = false;
    this.vistaActual.vistaOrganizador = false;
    this.vistaActual.vistaMisInscripciones = false;
    this.vistaActual.vistaListaAsistencia = false;
    this.idEventoSeleccionado = evento;
    this.vistaActual.vistaDetalleEvento = true;
    this.vistaActual.vistaFirmaEncargado = false;
  }

  verSubirFirmaEncargado(evento:any){
    this.vistaActual.vistaEncargado = false;
    this.vistaActual.vistaOrganizador = false;
    this.vistaActual.vistaMisInscripciones = false;
    this.vistaActual.vistaListaAsistencia = false;
    this.vistaActual.vistaDetalleEvento = false;
    this.vistaActual.vistaFirmaEncargado = true;
    this.conferenciaSeleccionada = evento;
  }

  reset(){
    this.vistaActual.vistaEncargado = false;
    this.vistaActual.vistaFirmaEncargado = false;
    this.vistaActual.vistaOrganizador = false;
    this.vistaActual.vistaMisInscripciones = true;
    this.vistaActual.vistaListaAsistencia = false;
    this.vistaActual.vistaDetalleEvento = false;
  }

  verInscripciones(){
    this.vistaActual.vistaEncargado = false;
    this.vistaActual.vistaEncargado= false;
    this.vistaActual.vistaListaAsistencia = false;
    this.vistaActual.vistaMisInscripciones = true;
    this.vistaActual.vistaFirmaEncargado = false;

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

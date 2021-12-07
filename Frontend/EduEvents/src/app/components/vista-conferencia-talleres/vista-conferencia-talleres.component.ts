import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  selector: 'app-vista-conferencia-talleres',
  templateUrl: './vista-conferencia-talleres.component.html',
  styleUrls: ['./vista-conferencia-talleres.component.css']
})
export class VistaConferenciaTalleresComponent implements OnInit {

  constructor( private serviceConferencia:ConferenciasService, private eventosService:EventosService, private usuarioService:UsuariosService, private spinner:SpinnerService, private modalService:NgbModal ) { }

  ngOnInit(): void {
    this.obtenerUsuarioActual()
  }

  mensajeModal = [
    {tipo:"confirmacion", titulo1:"¿Eliminar?", titulo2:"La conferencia o taller se eliminaran del evento", icono:"quiz"},
    {tipo:"error", titulo1:"Ocurrió un error", titulo2:"", icono:"error"},
  ]

  idConferencia:number;

  @Input() isCollaps = false;
  @Input() vistaBuscar = false;
  @Input() isOrganizador = false;
  @Input() idEvento = -1;
  @Input() eventoSeleccionado:any = {
    id: "",
    descripcion: "",
    nombre: "",
    fechaInicio: "",
    fechaFinal: "",
    institucion: "",
    imagenes: "",
    idOrganizador:-1,
    estadoEvento: -1,
    estadoParticipantes: -1

  }
  @Output() verDetallesEvento = new EventEmitter<any>();
  usuarioEncargadoConferencia:any;
  vistaActual = {
    listaAsistencia: false,
    detalleConferencia: true,
    detalleEvento:false,
    vistaEncargado:false
  }

  idDetalleEvento:number; // Id del evento obtenido desde una card de conferencia

  conferencias:Conferencia[] = []
  misInscripciones:Conferencia[] = []
  usuarioActual:any;

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


  obtenerCorreoUsuarioActual(){
    let tokenUsuario = localStorage.getItem("token");

    if( tokenUsuario ){

       return JSON.parse(tokenUsuario).id;

    }
    return ""
  }

  obtenerMisInscripciones(){

    this.serviceConferencia.obtenerConferenciasUsuario( this.usuarioActual.Id ).subscribe(
      (res:any) => {


        this.misInscripciones = res.data;

        for(let i = 0; i< this.conferencias.length; i++){

          let participante = {
            Id: this.usuarioActual.Id ,
            Nombre: this.usuarioActual.Nombre,
            Apellido: this.usuarioActual.Apellido,
            Fotografia: this.usuarioActual.Fotografia
          }
          this.misInscripciones[i].Lista_Participantes = [participante]
        }
        this.obtenerConferencias();
      },
      (err:any) => {
        if( err.error.codigo == 404 ) {
          this.misInscripciones = [];
        }
        this.obtenerConferencias();

      },
      () => {


      }
    );
  }

  buscarMiInscripcion( id:number ){

    for( let i = 0; i < this.misInscripciones.length; i++ ){
      if( this.misInscripciones[i].Id_Conferencia == id ){
        return true;
      }
    }
    return false;
  }

  obtenerConferencias(){
    this.spinner.mostrarSpinner();
    this.serviceConferencia.obtenerConferencias( this.idEvento ).subscribe(
      (res:any) => {
        this.conferencias = res.data;

        for(let i = 0; i< this.conferencias.length; i++){

          if( this.buscarMiInscripcion(this.conferencias[i].Id) ){
            let participante = {
              Id: this.usuarioActual.Id ,
              Nombre: this.usuarioActual.Nombre,
              Apellido: this.usuarioActual.Apellido,
              Fotografia: this.usuarioActual.Fotografia
            }
            this.conferencias[i].Lista_Participantes = [participante]
          }else {
            this.conferencias[i].Lista_Participantes = []

          }
        }
      },
      (err:any) => {
        console.log(err)
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

  verListaAsistencia(idConferencia, b:boolean){
    this.vistaActual.listaAsistencia = b,
    this.vistaActual.detalleConferencia = !b
    this.vistaActual.detalleEvento = false;
    this.idConferencia = idConferencia;
  }
  verEncargado(evento:any){
    this.vistaActual.vistaEncargado = true
    this.vistaActual.listaAsistencia = false,
    this.vistaActual.detalleConferencia =false
    this.vistaActual.detalleEvento = false;
    this.usuarioEncargadoConferencia = evento;

  }
  verDetalleConferencia(){
    this.vistaActual.listaAsistencia = false,
    this.vistaActual.detalleConferencia =true
    this.vistaActual.detalleEvento = false;
    this.vistaActual.vistaEncargado = false
  }


  regresar(){

    this.verDetallesEvento.emit(null);
  }

  setIdConferencia(id:number){
    this.idConferencia = id;
  }

  onClickAbrirModalEliminarConferencia(modal:any, idConferencia:number){
    this.idConferencia = idConferencia;
    this.abrirModal(modal);
  }

  abrirModal( modal:any ){
    this.modalService.open(
      modal,
      {
        size: 'xs',
        centered: true
      }
    );
  }

  onClickConfirmarEliminarConferencia(letmodal:any, modalExito:any, idConferencia:number){
    letmodal.close('Close click')
    this.spinner.mostrarSpinner()
    this.serviceConferencia.eliminarConferencia( idConferencia ).subscribe(
      (res:any) => {
        if(res.codigo == 200){

          this.abrirModal(modalExito);
          this.obtenerConferencias()
        }

        this.spinner.ocultarSpinner()
      },
      (err:any) => {
        this.spinner.ocultarSpinner()
      }

    );
  }







}

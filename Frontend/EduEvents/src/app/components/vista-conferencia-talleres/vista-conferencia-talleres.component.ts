import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConferenciasService } from 'src/app/services/conferencias.service'
import { SpinnerService } from 'src/app/services/spinner.service';
import { UsuariosService } from 'src/app/services/usuarios.service';


export interface Conferencia {
  Correo_Encargado:string
  Descripcion:string
  Emision_Diplomas:number
  Estado_Conferencia:string
  Fecha_Inicio:Date
  Firma_Encargado:any
  Firma_Organizador:any
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
  selector: 'app-vista-conferencia-talleres',
  templateUrl: './vista-conferencia-talleres.component.html',
  styleUrls: ['./vista-conferencia-talleres.component.css']
})
export class VistaConferenciaTalleresComponent implements OnInit {

  constructor( private serviceConferencia:ConferenciasService, private usuarioService:UsuariosService, private spinner:SpinnerService, private modalService:NgbModal ) { }

  ngOnInit(): void {
    this.obtenerConferencias()
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
    idOrganizador:-1

  }
  @Output() verDetallesEvento = new EventEmitter<any>();
  usuarioEncargadoConferencia:any;
  vistaActual = {
    listaAsistencia: false,
    detalleConferencia: true,
    vistaEncargado:false
  }

  conferencias:Conferencia[] = []

  obtenerConferencias(){
    this.spinner.mostrarSpinner();
    this.serviceConferencia.obtenerConferencias( this.idEvento ).subscribe(
      (res:any) => {
        this.conferencias = res.data;

      },
      (err:any) => {
        if( err.error.codigo == 404 ) {
          this.conferencias = [];
          console.log("No se encontro conferencias para este evento")
        }
        this.spinner.ocultarSpinner()
      },
      () => {
        this.spinner.ocultarSpinner()

      }
    );
  }

  verListaAsistencia(b:boolean){
    this.vistaActual.listaAsistencia = b,
    this.vistaActual.detalleConferencia = !b
  }
  verEncargado(evento:any){
    this.vistaActual.vistaEncargado = true
    this.vistaActual.listaAsistencia = false,
    this.vistaActual.detalleConferencia =false
    this.usuarioEncargadoConferencia = evento;


  }
  verDetalleConferencia(){
    this.vistaActual.listaAsistencia = false,
    this.vistaActual.detalleConferencia =true
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

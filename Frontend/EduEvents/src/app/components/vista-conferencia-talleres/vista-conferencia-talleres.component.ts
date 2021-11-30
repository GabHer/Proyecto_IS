import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConferenciasService } from 'src/app/services/conferencias.service'
import { UsuariosService } from 'src/app/services/usuarios.service';


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
  selector: 'app-vista-conferencia-talleres',
  templateUrl: './vista-conferencia-talleres.component.html',
  styleUrls: ['./vista-conferencia-talleres.component.css']
})
export class VistaConferenciaTalleresComponent implements OnInit {

  constructor( private serviceConferencia:ConferenciasService, private usuarioService:UsuariosService ) { }

  ngOnInit(): void {
    this.obtenerConferencias()
  }

  mensajeModal = [
    {tipo:"confirmacion", titulo1:"¿Eliminar?", titulo2:"La conferencia se eliminará de tu lista", icono:"quiz"},
    {tipo:"error", titulo1:"Ocurrió un error", titulo2:"", icono:"error"},
  ]

  @Input() isCollaps = false;
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
    this.serviceConferencia.obtenerConferencias( this.idEvento ).subscribe(
      (res:any) => {
        this.conferencias = res.data;
        console.log(res)
      },
      (err:any) => {
        if( err.error.codigo == 404 ) {
          console.log("No se encontro conferencias para este evento")
        }
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






}

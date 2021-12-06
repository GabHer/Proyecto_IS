import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  selector: 'app-card-conferecnia-encargado',
  templateUrl: './card-conferecnia-encargado.component.html',
  styleUrls: ['./card-conferecnia-encargado.component.css']
})
export class CardConferecniaEncargadoComponent implements OnInit {
  @Input() conferencia:Conferencia;
  @Input() isOrganizador = false;
  @Input() vistaBuscar = false;
  @Input() observableEventoSeleccionado:any;
  @Output() onListaAsistencia = new EventEmitter<any>();
  @Output() onVerEncargado = new EventEmitter<any>();
  @Output() onVerOrganizador = new EventEmitter<any>();
  @Output() onEliminarConferencia = new EventEmitter<number>();

  eventoSeleccionado:any = {
    id: "",
    descripcion: "",
    nombre: "",
    fechaInicio: "",
    fechaFinal: "",
    institucion: "",
    imagenes: "",
    idOrganizador:-1

  }
  usuarioActual:any;
  usuarioEncargado:any;
  usuarioOrganizador:any;
  constructor( private usuarioService:UsuariosService ) { }

  ngOnInit(): void {
    this.obtenerUsuarioEncargado()
    this.obtenerEventoSeleccionado()

  }
  obtenerFormatoFecha( date:any){

    return date.split('T')[0]
  }

  obtenerEventoSeleccionado(){
    this.observableEventoSeleccionado.subscribe(
      (res:any) => {
        this.eventoSeleccionado = {
          id: res.data.Id,
          descripcion: res.data.Descripcion,
          nombre: res.data.Nombre,
          fechaInicio: res.data.Fecha_Inicio.substr(0,10),
          fechaFinal: res.data.Fecha_Final.substr(0,10),
          institucion: res.data.Institucion,
          imagenes: res.data.imagenes,
          idOrganizador: res.data.Id_Organizador,
          estadoEvento: res.data.Estado_Evento,
          estadoParticipantes: res.data.Estado_Participantes
        };

        this.obtenerUsuarioOrganizador(this.eventoSeleccionado.idOrganizador)
      }

    );

  }

  mostrarUsuarioEncargado(){
    this.onVerEncargado.emit(this.usuarioEncargado);
  }
  mostrarUsuarioOrganizador(){
    this.onVerOrganizador.emit(this.usuarioOrganizador);
  }
  obtenerCorreoUsuarioActual(){
    let tokenUsuario = localStorage.getItem("token");

    if( tokenUsuario ){

       return JSON.parse(tokenUsuario).id;

    }
    return ""
  }

  isEncargado(){
    let correo = this.obtenerCorreoUsuarioActual();
    if(correo == this.conferencia.Correo_Encargado){
      return true;
    }
    return false;
  }

  mostrarListaAsistencia(idConferencia:number){
    this.onListaAsistencia.emit(idConferencia);
  }

  obtenerUsuarioEncargado(){

    this.usuarioService.obtenerUsuario( this.conferencia.Correo_Encargado ).subscribe(
      (res:any) => {

        this.usuarioEncargado = res.data
      }
    );
  }
  obtenerUsuarioOrganizador(idUsuario:number){
    this.usuarioService.obtenerUsuarioPorId(idUsuario).subscribe(
      (res:any) => {
        this.usuarioOrganizador = res.data;
      },


      (err:any) => {
        this.usuarioOrganizador = null;
        console.log(err)
      }

    );

  }

}

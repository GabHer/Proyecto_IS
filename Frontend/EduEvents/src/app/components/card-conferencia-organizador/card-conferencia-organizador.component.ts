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
  selector: 'app-card-conferencia-organizador',
  templateUrl: './card-conferencia-organizador.component.html',
  styleUrls: ['./card-conferencia-organizador.component.css']
})
export class CardConferenciaOrganizadorComponent implements OnInit {
  @Input() conferencia:Conferencia;
  @Input() isOrganizador = false;
  @Input() vistaBuscar = false;
  @Output() onListaAsistencia = new EventEmitter<any>();
  @Output() onVerEncargado = new EventEmitter<any>();
  @Output() onEliminarConferencia = new EventEmitter<number>();
  constructor( private usuarioService:UsuariosService ) { }


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

  usuarioActual:any;
  usuarioEncargado:any;

  ngOnInit(): void {
    this.obtenerUsuarioEncargado()
  }

  obtenerFormatoFecha( date:any){

    return date.split('T')[0]
  }

  eliminarConferencia(){
    this.onEliminarConferencia.emit(this.conferencia.Id)

  }

  mostrarUsuarioEncargado(){
    this.onVerEncargado.emit(this.usuarioEncargado);
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



  mostrarListaAsistencia(){
    this.onListaAsistencia.emit(null);
  }

  obtenerUsuarioEncargado(){

    this.usuarioService.obtenerUsuario( this.conferencia.Correo_Encargado ).subscribe(
      (res:any) => {

        this.usuarioEncargado = res.data
      }
    );
  }

}

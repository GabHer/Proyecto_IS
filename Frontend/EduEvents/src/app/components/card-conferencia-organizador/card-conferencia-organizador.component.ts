import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Conferencia } from 'src/app/models/conferencia.interface'

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

}

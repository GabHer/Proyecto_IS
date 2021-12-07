import { AfterViewInit, Component, OnInit, ViewChildren , Output, EventEmitter, Input, OnChanges, SimpleChanges} from '@angular/core';
import { SidenavComponent } from './sidenav/sidenav.component';
import { AutenticacionService } from '../../services/autenticacion.service';
import { UsuariosService } from '../../services/usuarios.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerService } from 'src/app/services/spinner.service';
import { MisEventosComponent } from '../mis-eventos/mis-eventos.component';
import { HeaderDashboardComponent } from './header-dashboard/header-dashboard.component';
import { EventosService } from 'src/app/services/eventos.service';

export interface Evento  {
  Id:number,
  Caratula:string,
  Nombre:string,
  Institucion:string,
  Descripcion:string,
  Fecha_Inicio:string,
  Fecha_Final:string,
  Estado_Participantes:number,
  Estado_Evento:string,
  Id_Organizador:number
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnChanges  {




  @Input() configComponenteUsuario = {
    mostrarFormularioEditarUsuario : false
  }
  ctrlInput:string;
  ctrlInputRangoFecha:any;
  ctrlInputEstado:any;

  vistaBuscar = false;

  @Input() usuario:any ={
    Id: -1,
    Nombre: "",
    Apellido: "",
    Fecha_Nacimiento: "",
    Correo: "",
    Contrasena: "",
    Formacion_Academica: "",
    Descripcion: "",
    Fotografia: "",
    Institucion: "",
    Intereses: []
  };

  items = [
    ["Inicio", "home"],
    ["Buscar", "search"],
    ["Mis eventos", "event"],
    ["Inscripciones", "edit_calendar"],
    ["Mi perfil", "account_circle"],
    ["Cerrar sesión", "logout"],
  ]

  indexItemActual = 0;

  bandera = true;

  mensajeModal = [
    {tipo:"confirmacion", titulo1:"¿Cerrar sesión?", titulo2:"Se cerrará la sesión actual", icono:"quiz"}
  ]

  eventos:Evento[] = [];
  misEventos:Evento[] =[];
  ocultarBuscador=false;

  constructor( private eventosService:EventosService, private sanitizer: DomSanitizer, private auth:AutenticacionService, private usuariosService:UsuariosService, private modalService:NgbModal, private spinner:SpinnerService) {
    this.obtenerUsuario();

  }
  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
  }

  actualizarBandera(e:any){
    this.bandera = e;
  }

  actualizarItemActual(e:any){
    this.spinner.mostrarSpinner()
    this.vistaBuscar = false;
    this.ocultarBuscador = false;

    setTimeout(() => {
      this.indexItemActual = e;
      if(this.indexItemActual == 0){
        this.ocultarBuscador = true;
      }
      if(this.indexItemActual == 3){
        this.ocultarBuscador = true;
      }
      this.spinner.ocultarSpinner()
    }, 200);
  }
  obtenerIndexItem( nombreItem:string ){
    return this.items.findIndex( item => item[0] == nombreItem);
  }

  obtenerItem(indice:any){
    return this.items[indice][0]
  }

  onClickCerrarSesion(evento:any, modal:any, ){
    this.abrirModal(modal);
  }

  onConfirmarCerrarSesion(referenciaModal:any){
    this.spinner.mostrarSpinner()

    setTimeout(() => {
      this.auth.cerrarSesion();
      referenciaModal.close('Close click');
    }, 300);
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


  actualizarDashBoard(){
    this.obtenerUsuario();
  }
  obtenerEventos(){
    this.eventosService.obtenerEventos().subscribe(
      (res:any) => this.eventos = res.data
    );

  }


  obtenerMisEventos(){

    this.eventosService.obtenerMisEventos( this.usuario.Id ).subscribe(
      (res:any) => {
        this.misEventos = res.data
      },
      (err:any) => {
        this.misEventos = []

      }
    );
  }

  obtenerUsuario(){
    let tokenUsuario = localStorage.getItem("token");
    if( tokenUsuario ){

      let correo = JSON.parse(tokenUsuario).id;
      this.usuariosService.obtenerUsuario( correo ).subscribe(
        (res:any) => {
          this.usuario = res.data
          this.obtenerMisEventos()
          this.obtenerEventos();
        }
      );
    }
  }

  actualizarUsuarioActual(event:any){

    this.configComponenteUsuario.mostrarFormularioEditarUsuario= false;

    this.usuariosService.obtenerUsuario( event.Correo ).subscribe(
      (res:any) => this.usuario = res.data
    );

  }


  setCtrlBusqueda(event:any){

    this.ctrlInput = event;
  }
  setCtrlBusquedaFecha(event:any){

    this.ctrlInputRangoFecha = event;
  }
  setCtrlBusquedaEstado(event:any){


    this.ctrlInputEstado = event;
  }

  setOcultarBuscador(b:boolean){
    this.ocultarBuscador = b;
    console.log("Se mostrara el buscador ", b)
  }



}

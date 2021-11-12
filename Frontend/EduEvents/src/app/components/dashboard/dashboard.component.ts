import { AfterViewInit, Component, OnInit, ViewChildren , Output, EventEmitter, Input} from '@angular/core';
import { SidenavComponent } from './sidenav/sidenav.component';
import { AutenticacionService } from '../../services/autenticacion.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit  {

  @ViewChildren(SidenavComponent) sidenav: SidenavComponent;

  @Input() usuario:any;

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
  constructor( private auth:AutenticacionService) {

  }
  ngAfterViewInit(): void {

  }

  ngOnInit(): void {

    // Variables de prueba
    this.usuario = {
      nombre: 'Juan',
      apellido: 'Perez',
      nacimiento: '2001-05-28',
      email: 'juanp@gmail.com',
      contrasenia: 'Hola12345',
      formacionAcademica: 'Educación superior',
      descripcion: 'Estudiante universitario',
      imagen: '../../../assets/img/FotoDePerfilPorDefecto.png',
      institucion: 'UNAH',
      intereses: ['Programación', 'Ingeniería', 'Gatos', 'Jugar videojuegos', 'Estudiar', 'Escuchar musica', 'Practicar Futbol']
    }

  }

  actualizarBandera(e:any){
    this.bandera = e;
  }

  actualizarItemActual(e:any){
    this.indexItemActual = e;
  }
  obtenerIndexItem( nombreItem:string ){
    return this.items.findIndex( item => item[0] == nombreItem);
  }

  obtenerItem(indice:any){
    return this.items[indice][0]
  }

  onClickCerrarSesion(evento:any){
    console.log("Cerrar sesión...")
    this.auth.cerrarSesion();
  }



}

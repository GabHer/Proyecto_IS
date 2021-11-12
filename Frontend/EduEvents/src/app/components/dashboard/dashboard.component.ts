import { AfterViewInit, Component, OnInit, ViewChildren , Output, EventEmitter, Input} from '@angular/core';
import { SidenavComponent } from './sidenav/sidenav.component';
import { AutenticacionService } from '../../services/autenticacion.service';
import { UsuariosService } from '../../services/usuarios.service';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit  {

  @ViewChildren(SidenavComponent) sidenav: SidenavComponent;

  @Input() usuario:any ={
    nombre: "Juan",
    apellido: "Perez",
    nacimiento: "2020/12/20",
    email: "juanperez@gmail.com",
    contrasenia: "Hola1234",
    formacionAcademica: "Educación superior",
    descripcion: "Estudiante universitario",
    imagen: "../../../assets/img/FotoDePerfilPorDefecto.png",
    institucion: "UNAH",
    intereses: ["Programación", "Jugar videojuegos, Practicar deporte"]
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
  constructor( private sanitizer: DomSanitizer, private auth:AutenticacionService, private usuariosService:UsuariosService) {
  }
  ngAfterViewInit(): void {

  }

  ngOnInit(): void {

    this.obtenerUsuario()

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

    this.auth.cerrarSesion();
  }



  obtenerUsuario(){
    let correo = JSON.parse(localStorage.getItem("token")).id;
    console.log(correo);
    /*
    this.usuariosService.obtenerUsuario(correo).subscribe(
      (res:any)=> {
        console.log(res.data);

        // Variables de prueba
        this.usuario = {
          nombre: res.data.Nombre,
          apellido: res.data.Apellido,
          nacimiento: res.data.Fecha_Nacimiento,
          email: res.data.Correo,
          contrasenia: "",
          formacionAcademica: res.data.Formacion_Academica,
          descripcion: res.data.Descripcion,
          imagen: res.data.Fotografia,
          institucion: res.data.Institucion,
          intereses: res.data.Intereses
        }

      },
      (error:any) => {
        console.log(error);
      }
     )


     */
    }


}

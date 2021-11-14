import { AfterViewInit, Component, OnInit, ViewChildren , Output, EventEmitter, Input} from '@angular/core';
import { SidenavComponent } from './sidenav/sidenav.component';
import { AutenticacionService } from '../../services/autenticacion.service';
import { UsuariosService } from '../../services/usuarios.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerService } from 'src/app/services/spinner.service';
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

  indexItemActual = 1;

  bandera = true;

  mensajeModal = [
    {tipo:"confirmacion", titulo1:"¿Cerrar sesión?", titulo2:"Se cerrará la sesión actual", icono:"quiz"}
  ]

  constructor( private sanitizer: DomSanitizer, private auth:AutenticacionService, private usuariosService:UsuariosService, private modalService:NgbModal, private spinner:SpinnerService) {
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
    this.spinner.mostrarSpinner()

    setTimeout(() => {
      this.indexItemActual = e;
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




  obtenerUsuario(){
    let tokenUsuario = localStorage.getItem("token");
    if( tokenUsuario ){

      let correo = JSON.parse(tokenUsuario).id;
      console.log(correo);

      this.usuariosService.obtenerUsuario( correo ).subscribe(

        (res:any) => {

          //let imagen = encode( res.data.Fotografia.data );
          let imagen = res.data.Fotografia;

          this.usuario = {
            nombre: res.data.Nombre,
            apellido: res.data.Apellido,
            nacimiento: res.data.Fecha_Nacimiento,
            email: res.data.Correo,
            contrasenia: "",
            formacionAcademica: res.data.Formacion_Academica,
            descripcion: res.data.Descripcion,
            imagen: imagen,
            institucion: res.data.Institucion,
            intereses: res.data.Intereses.split(",")
          };


        },

        (error:any) => {

        },

        ()=> {

        }
      )


      }
    }


}

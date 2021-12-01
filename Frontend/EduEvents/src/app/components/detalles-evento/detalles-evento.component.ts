import { Component, OnInit, Input, EventEmitter,Output } from '@angular/core';
import { EventosService } from 'src/app/services/eventos.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-detalles-evento',
  templateUrl: './detalles-evento.component.html',
  styleUrls: ['./detalles-evento.component.css']
})
export class DetallesEventoComponent implements OnInit {
  @Input() isCollaps: boolean;
  @Input() idEvento: any;
  @Output() onChangePath = new EventEmitter<string>();
  @Output() onMostrarDetalles = new EventEmitter<any>();
  usuarioActual:any;
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

  @Input() isOrganizador = false;
  @Input() vistaBuscar = false;

  confEvento = {
    mostrarDetalleEvento : true,
    mostrarVistaConferencias : false,
  }

  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  constructor(private eventosService:EventosService,private spinner:SpinnerService, private usuarioService:UsuariosService) { }

  ngOnInit(): void {
    this.obtenerEvento(this.idEvento);
    this.obtenerUsuario()
  }

  obtenerUsuario(){
    let tokenUsuario = localStorage.getItem("token");
    if( tokenUsuario ){

      let correo = JSON.parse(tokenUsuario).id;
      this.usuarioService.obtenerUsuario( correo ).subscribe(
        (res:any) => {
          this.usuarioActual = res.data
          if(res.data.Id == this.eventoSeleccionado.idOrganizador){
            this.isOrganizador = true;
          }else{
            this.isOrganizador = false;

          }
        }
      );
    }
  }

  obtenerEvento(idEvento:any){
    this.spinner.mostrarSpinner();
    this.eventosService.obtenerEventoPorId( idEvento ).subscribe(
      (res:any) => {

        console.log(res.data);
        this.eventoSeleccionado = {
          id: res.data.Id,
          descripcion: res.data.Descripcion,
          nombre: res.data.Nombre,
          fechaInicio: res.data.Fecha_Inicio.substr(0,10),
          fechaFinal: res.data.Fecha_Final.substr(0,10),
          institucion: res.data.Institucion,
          imagenes: res.data.imagenes,
          idOrganizador: res.data.Id_Organizador
        };
        setTimeout(() => {
          this.spinner.ocultarSpinner()
        }, 200);
      },
      (err:any) => {
        console.log(err);
      }
    );
  }
  regresar(){
    this.onChangePath.emit('Mis eventos');
  }

  mostrarConferencias(b:boolean){
    this.confEvento.mostrarVistaConferencias = b;
    this.confEvento.mostrarDetalleEvento = !b;
    console.log(this.vistaBuscar)

  }


}

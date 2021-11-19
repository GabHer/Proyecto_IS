import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerService } from 'src/app/services/spinner.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.component.html',
  styleUrls: ['./registro-usuario.component.css']
})


export class RegistroUsuarioComponent implements OnInit {


  mensajeError="";

  constructor( private modalService:NgbModal, private usuariosService:UsuariosService, private spinnerService: SpinnerService) { }

  ngOnInit(): void {
    this.mensajeError = "";
  }

  /**
  * @name onSubmitRegistro
  * @summary Función al presionar el boton de registro.
  * @param {any} evento - Evento onSubmit del formulario
  * @return {}
  */
  onSubmitRegistro(modalExito:any, modalError:any, nuevoUsuario:any){

    // Si el formulario es valido, esta listo para guardar
      this.mensajeError = "";
      this.spinnerService.mostrarSpinner();
      this.usuariosService.guardarUsuario( nuevoUsuario ).subscribe(
        (res:any)=>{
          if(res.codigo == 406){
            this.mensajeError = "El correo ingresado ya esta en uso."
            this.abrirModal(modalError);
          }

          if(res.codigo == 200 ){
            this.abrirModal(modalExito);
          }

        },
        error=>{
          this.mensajeError = "No se pudo registrar el usuario"
          this.abrirModal(modalError);
        },
        () => {
          this.spinnerService.ocultarSpinner();
        }
        );

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




  obtenerUsuarios(){
    let usuario:any;
    this.spinnerService.mostrarSpinner();
    this.usuariosService.obtenerUsuarios( ).subscribe(
      (res:any)=>{
        usuario = res;
      },
      error=>{
        this.spinnerService.ocultarSpinner();
      },
      ()=> {
        this.spinnerService.ocultarSpinner();
      }
      );
  }








}

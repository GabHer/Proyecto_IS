import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerService } from 'src/app/services/spinner.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit {
  @Output() onClickMostrarFormularioEditarPerfil = new EventEmitter<Boolean>();
  @Output() actualizarUsuarioActual = new EventEmitter<any>();
  @Input() vistaUsuario = false;
  faEdit = faEdit;

  editando = {
    mostrarFormularioEditarPerfil : false,
    objEditado:{}
  }

  mensajeModal = [
    {tipo:"confirmacion", titulo1:"¿Cancelar?", titulo2:"No se guardaran los cambios", icono:"quiz"},
    {tipo:"confirmacion", titulo1:"Editar usuario?", titulo2:"Se aplicaran los cambios", icono:"quiz"},
    {tipo:"error", titulo1:"Ocurrió un error", titulo2:"", icono:"error"},
  ]
  @Input() perfil:any;


  constructor( private modalService:NgbModal, private usuariosService:UsuariosService, private spinnerService: SpinnerService) { }

  ngOnInit(): void {
  }

  obtenerNombreCompleto(){
    return `${this.perfil.Nombre} ${this.perfil.Apellido}`
  }
  mostrarFormularioEditar(){
    this.editando.mostrarFormularioEditarPerfil = true;
    this.onClickMostrarFormularioEditarPerfil.emit(true);
  }

  onClickEditar(modalConfirmacion:any, objUsuario:any ){
    this.editando.objEditado = objUsuario;
    this.abrirModal(modalConfirmacion);
  }

  editarUsuario(letModal:any ,modalError:any, modalExito:any){
    letModal.close('Close click');
    this.spinnerService.mostrarSpinner()
    this.usuariosService.editarUsuario(this.editando.objEditado).subscribe(
      (res:any) => {

        if(res.codigo == 200){
          this.editando.mostrarFormularioEditarPerfil=false;
          this.abrirModal(modalExito);
          this.actualizarUsuarioActual.emit(this.editando.objEditado);
        }
        this.spinnerService.ocultarSpinner()
      },
      (err:any) => {
        this.spinnerService.ocultarSpinner()
        this.abrirModal(modalError);
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



}

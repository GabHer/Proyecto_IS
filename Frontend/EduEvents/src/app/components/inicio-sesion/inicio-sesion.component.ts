import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.css']
})
export class InicioSesionComponent implements OnInit {

  /**
  * @name formularioInicioSesion
  * @type FormGroup
  * @summary - Formulario para el inicio de sesión.
  */
   formularioInicioSesion = new FormGroup(
    {
      email :  new FormControl('', [Validators.required]),
      contrasenia: new FormControl('', [Validators.required])
    }
  );
  /**
  * @name formularioRecuperarContrasenia
  * @type FormGroup
  * @summary - Formulario para recuperar contraseña.
  */
   formularioRecuperarContrasenia = new FormGroup(
    {
      email :  new FormControl('', [Validators.required]),
      codigo :  new FormControl(''),
      nuevaContrasenia: new FormControl('')
    }
  );





  oculto = true;

  usuarioEncontrado = false;
  codigoValido = false;

  constructor( private modalService:NgbModal ) { }

  ngOnInit(): void {
  }

  /**
  * @name getErrorMessage
  * @summary Comprueba el error del campo 'email' o 'contrasenia'.
  * @param {string} campo - Nombre del campo en el que se buscara un error de validación
  * @return { String } Retorna una cadena con el mensaje personalizado segun el error encontrado.
  */
   getErrorMessage(campo:any) {

    if (this.formularioInicioSesion.get(campo).hasError('required')) {
      return 'Este es un campo obligatorio';
    }
    return "Error";

  }
  /**
  * @name getErrorMessageRecuperarContrasenia
  * @summary Comprueba el error del campo 'email' o 'contrasenia'.
  * @param {string} campo - Nombre del campo en el que se buscara un error de validación
  * @return { String } Retorna una cadena con el mensaje personalizado segun el error encontrado.
  */
   getErrorMessageRecuperarContrasenia(campo:any) {

    if (this.formularioRecuperarContrasenia.get(campo).hasError('required')) {
      return 'Este es un campo obligatorio';
    }
    return "Error";

  }

  /**
  * @name getErrorEmailRecuperarContrasenia
  * @summary Comprueba el error del campo 'email' o 'contrasenia'.
  * @param {string} campo - Nombre del campo en el que se buscara un error de validación
  * @return { String } Retorna una cadena con el mensaje personalizado segun el error encontrado.
  */
  getErrorEmailRecuperarContrasenia(){


    if (this.formularioRecuperarContrasenia.get('email').hasError('required')) {
      return 'Este es un campo obligatorio';
    }

    if ( !this.usuarioEncontrado ) {
      return 'No se encontro ninguna cuenta registrada con ese correo';
    }

    return "Error"
  }


/**
* @name onSubmitInicioSesion
* @summary Reacciona al evento submit del formulario
* @param {any} evento - Evento onSubmit del formulario
* @return {} No retorna.
*/

  onSubmitInicioSesion(evento:any){
    console.log(evento);
  }

  /**
  * @name abrirModal
  * @summary Abre la ventana modal para recuperar contraseña
  * @param {any} modal - Ventana modal
  * @return {} No retorna.
  */
  abrirModal( modal:any ){

    this.formularioRecuperarContrasenia.get('codigo').disable();
    this.formularioRecuperarContrasenia.get('nuevaContrasenia').disable();
    this.modalService.open(
      modal,
      {
        size: 'xs',
        centered: true
      }
    );
  }




  /**
  * @name onClickEnviarCodigo
  * @summary Reacciona al evento click del boton 'enviar código'
  * @param {}  - No recibe parametros
  * @return {} No retorna.
  */
  onClickEnviarCodigo(){
    // Hacemos la consulta al backend para comprobar la existencia de ese correo electronico
    this.usuarioEncontrado = true;


    if( this.usuarioEncontrado ){
      this.formularioRecuperarContrasenia.get('codigo').enable();
      this.formularioRecuperarContrasenia.get('nuevaContrasenia').enable();

    }
  }

  /**
  * @name onClickCambiarContrasenia
  * @summary Reacciona al evento click del boton 'iniciar sesión'
  * @param {}  - No recibe parametros
  * @return {} No retorna.
  */
  onClickCambiarContrasenia(){
    // Validar que el código haga match con el código generado por el backend




    // Si pasa la validación, entonces validar que la contraseña nueva sea valida y actualizar el usuario con la nueva contraseña

    console.log(this.formularioRecuperarContrasenia.value);
  }




}

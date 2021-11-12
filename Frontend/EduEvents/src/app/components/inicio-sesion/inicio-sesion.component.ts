import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerService } from 'src/app/services/spinner.service';
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
      email :  new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      codigo :  new FormControl(''),
      nuevaContrasenia: new FormControl('', [Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')]),
      repetirContrasenia: new FormControl('', [Validators.required])
    }
  );






  oculto = true;

  recuperarContrasenia = { usuarioEncontrado: false, codigo:0 };
  codigoValido = false;
  tiempoEspera = 180; // 180 segundos
  contador:any;

  constructor( private modalService:NgbModal, private spinner:SpinnerService  ) { }

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

    if ( !this.recuperarContrasenia.usuarioEncontrado ) {
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
    this.spinner.mostrarSpinner()
    this.iniciarContador();
    setTimeout(() => {

      this.recuperarContrasenia.usuarioEncontrado = true;
      console.log(this.recuperarContrasenia);
      this.spinner.ocultarSpinner()

      if( this.recuperarContrasenia.usuarioEncontrado ){
        this.formularioRecuperarContrasenia.get('codigo').enable();
        this.formularioRecuperarContrasenia.get('nuevaContrasenia').enable();

      }
    }, 3000);





  }

  obtenerTiempoEspera(){

    return `Reenviar en: ${this.tiempoEspera}s`
  }


  iniciarContador() {
      this.contador = setInterval(() => {
        console.log(this.contador)
        if(this.tiempoEspera > 0) {

          this.tiempoEspera--;
        } else {
          this.tiempoEspera = 180;
          this.detenerContador()
        }
      },1000)
    }

    detenerContador() {
      clearInterval(this.contador);
    }

  validarCodigo(){
    // Comprobar con el backend si el código es el mismo
    console.log("Validando código...");
    this.spinner.mostrarSpinner()
    setTimeout(() => {
      this.recuperarContrasenia.codigo = 4444;
      console.log(this.recuperarContrasenia);
      this.spinner.ocultarSpinner()
    }, 3000);
    console.log(this.tiempoEspera);
    console.log(this.recuperarContrasenia);
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

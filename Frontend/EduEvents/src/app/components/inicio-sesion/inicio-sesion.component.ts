import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerService } from 'src/app/services/spinner.service';
import { AutenticacionService } from 'src/app/services/autenticacion.service';
import { Router } from '@angular/router';
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
      email :  new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$") ]),
      contrasenia: new FormControl('', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')])
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
  estadoLogin = { codigo:0, estado: "", mensaje:""};
  codigoValido = false;

  constructor( private modalService:NgbModal, private spinner:SpinnerService, private loginService:AutenticacionService, private router: Router  ) { }

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

  getErrorMessageEmail() {

    if (this.formularioInicioSesion.get('email').hasError('required')) {
      return 'Este es un campo obligatorio';
    }
    return this.formularioInicioSesion.get('email').errors?.pattern ? 'Correo no valido' : '';
  }

    /**
  * @name getErrorMessageContrasenia
  * @summary Comprueba el error del campo 'contrasenia'.
  * @param {}  - No recibe parametro
  * @return { String } Retorna una cadena con el mensaje personalizado segun el error encontrado.
  */
    getErrorMessageContrasenia() {
      if (this.formularioInicioSesion.get('contrasenia').hasError('required')) {
        return 'Este es un campo obligatorio';
      }
      return this.formularioInicioSesion.get('contrasenia').hasError('pattern') ? 'La contraseña debe tener un mínimo de 8 caracteres, al menos 1 letra mayúscula, 1 letra minúscula y 1 número' : '';
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

  onClickInicioSesion(modalExito:any, modalError:any){
    this.spinner.mostrarSpinner();

    let datos = {
      Correo: this.formularioInicioSesion.get("email").value,
      Contrasena: this.formularioInicioSesion.get("contrasenia").value
    }
    this.loginService.inicioSesion( datos ).subscribe(

      (res:any)=> {
        this.estadoLogin = res;

        if( res.codigo == 200){
          this.loginService.guardarToken(res.data);
          this.abrirModal(modalExito);
          this.router.navigate(['dashboard']);
          this.spinner.ocultarSpinner();
          return;
        }
        this.abrirModal(modalError);

      },

      (error:any) => {
        this.abrirModal(modalError);
        this.loginService.cerrarSesion()
        this.spinner.ocultarSpinner();
      },

      ()=> {
        this.spinner.ocultarSpinner();
      }


     )
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

  validarCodigo(){
    // Comprobar con el backend si el código es el mismo
    console.log("Validando código...");
    this.spinner.mostrarSpinner()
    setTimeout(() => {
      this.recuperarContrasenia.codigo = 4444;
      console.log(this.recuperarContrasenia);
      this.spinner.ocultarSpinner()
    }, 3000);

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

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerService } from 'src/app/services/spinner.service';
import { AutenticacionService } from 'src/app/services/autenticacion.service';
import { Router } from '@angular/router';
import { contraseniasIguales } from 'src/app/helppers/validaciones-personalizadas';
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
      codigo :  new FormControl('', [Validators.required]),
      contrasenia: new FormControl('', [Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')]),
      repetirContrasenia: new FormControl('', [Validators.required])
    },{ validators:contraseniasIguales }
  );






  oculto = true;
  recuperarContrasenia = { usuarioEncontrado: false, codigo:404, tiempoEspera: 180, codigoValido : false, estado:"" };
  estadoLogin = { codigo:0, estado: "", mensaje:""};

  contador:any;

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

    if(!this.recuperarContrasenia.usuarioEncontrado){
      this.formularioRecuperarContrasenia.get('codigo').disable();
      this.formularioRecuperarContrasenia.get('contrasenia').disable();
    }
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
    
    let datos = {Correo: this.formularioRecuperarContrasenia.get("email").value}
    this.loginService.enviarCorreoRecuperarContrasena(datos).subscribe(
      (res:any)=> {
        
        if(res.codigo == 200){
          this.iniciarContador();



          this.recuperarContrasenia.usuarioEncontrado = true;
          this.recuperarContrasenia.codigo = 200;
          this.recuperarContrasenia.estado = "";
          this.formularioRecuperarContrasenia.get('codigo').enable();
          this.formularioRecuperarContrasenia.get('contrasenia').enable();
          this.spinner.ocultarSpinner()
          return;
        }else{
          this.recuperarContrasenia.usuarioEncontrado = false;
          this.recuperarContrasenia.codigo = 404;
          this.recuperarContrasenia.estado= "no_encontrado";
          this.spinner.ocultarSpinner()
          return
        }
      },

      (error:any) => {
        this.recuperarContrasenia.usuarioEncontrado = false;
        this.recuperarContrasenia.codigo = 404;
        this.recuperarContrasenia.estado= "no_encontrado";
        this.spinner.ocultarSpinner()
      }
    )

  }

  obtenerTiempoEspera(){

    return `Reenviar en: ${this.recuperarContrasenia.tiempoEspera}s`
  }


  iniciarContador() {
      this.contador = setInterval(() => {

        if(this.recuperarContrasenia.tiempoEspera > 0) {

          this.recuperarContrasenia.tiempoEspera--;
        } else {
          this.recuperarContrasenia.tiempoEspera = 180;
          this.detenerContador()
        }
      },1000)
    }

    detenerContador() {
      clearInterval(this.contador);
    }

  validarCodigo(){
    // Comprobar con el backend si el código es el mismo

    this.spinner.mostrarSpinner()
    let datos = {
      Correo: this.formularioRecuperarContrasenia.get("email").value,
      Token: this.formularioRecuperarContrasenia.get("codigo").value
     }

    this.loginService.validarTokenRecuperarContrasena( datos ).subscribe (

      (res:any) => {

        if(res.codigo == 200){
          this.recuperarContrasenia.codigoValido = true;
          this.recuperarContrasenia.estado = "ok";
          this.spinner.ocultarSpinner()

          return;
        }else {
          this.recuperarContrasenia.codigoValido = false;
          this.recuperarContrasenia.estado = "error";
          this.spinner.ocultarSpinner()
          return;
        }

      },

      (error:any) => {
        this.recuperarContrasenia.codigoValido = false;
        this.recuperarContrasenia.estado = "error";
        this.spinner.ocultarSpinner()
        return;
      }

    )

  }

  /**
  * @name onClickCambiarContrasenia
  * @summary Reacciona al evento click del boton 'iniciar sesión'
  * @param {}  - No recibe parametros
  * @return {} No retorna.
  */
  onClickCambiarContrasenia( modalExito:any, modalError:any, letModal:any){

    this.spinner.mostrarSpinner();
    let datos = {
      Correo: this.formularioRecuperarContrasenia.get("email").value,
      Contrasena: this.formularioRecuperarContrasenia.get("contrasenia").value
    }
    this.loginService.actualizarContrasena( datos ).subscribe(

      (res:any) => {
        if( res.codigo == 200 ){
          this.spinner.ocultarSpinner()
          this.estadoLogin.codigo = 200;
          this.estadoLogin.estado = "ok";
          this.estadoLogin.mensaje = res.mensaje;

          this.abrirModal(modalExito);
          letModal.close('Close click');
          return;
        }
        this.spinner.ocultarSpinner()
        this.estadoLogin.codigo = 400;
        this.estadoLogin.estado = "error";
        this.estadoLogin.mensaje = res.mensaje;

        this.abrirModal(modalError);
        letModal.close('Close click');

        return
      },

      (error:any) => {
        this.spinner.ocultarSpinner()
        this.estadoLogin.codigo = 400;
        this.estadoLogin.estado = "error";
        this.estadoLogin.mensaje = "Error, No se pudo actualizar su contraseña";

        this.abrirModal(modalError);
        letModal.close('Close click');
        this.recuperarContrasenia = { usuarioEncontrado: false, codigo:404, tiempoEspera: 180, codigoValido : false, estado:"" };
        this.estadoLogin = { codigo:0, estado: "", mensaje:""};

      },

      () => {
        this.recuperarContrasenia = { usuarioEncontrado: false, codigo:404, tiempoEspera: 180, codigoValido : false, estado:"" };
        this.estadoLogin = { codigo:0, estado: "", mensaje:""};
      }



    )
  }






}

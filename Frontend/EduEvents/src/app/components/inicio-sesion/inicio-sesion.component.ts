import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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



  oculto = true;

  constructor() { }

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
* @name onSubmitInicioSesion
* @summary Reacciona al evento submit del formulario
* @param {any} evento - Evento onSubmit del formulario
* @return {} No retorna.
*/

  onSubmitInicioSesion(evento:any){
    console.log(evento);
  }

}

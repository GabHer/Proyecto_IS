import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";


/** Valida si 2 contrasenias son iguales */
export const contraseniasIguales: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const contrasenia1 = control.get('contrasenia');
  const contrasenia2 = control.get('repetirContrasenia');

  return contrasenia1.value == contrasenia2.value ?null : { contraseniasIguales: true } ;
};





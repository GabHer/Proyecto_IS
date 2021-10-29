import { Component, ElementRef, OnInit } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import {FormControl, Validators, FormGroup} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ViewChild } from '@angular/core';


import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.component.html',
  styleUrls: ['./registro-usuario.component.css']
})


export class RegistroUsuarioComponent implements OnInit {


  public archivos: any = [];
  public previsualizacion:String="";

  imgUsuarioPorDefecto = "../../../assets/img/FotoDePerfilPorDefecto.png";

  imageChangedEvent: any = '';
  croppedImage: any = '';

  oculto = true;
  errorImagen = false;
  intereses:any = [];


  /**
  * @name formularioRegistro
  * @type FormGroup
  * @summary - Formulario para el registro de usuarios.
  */
   formularioRegistro = new FormGroup(
    {
      nombre: new FormControl('', [Validators.required]),
      apellido: new FormControl('', [Validators.required]),
      email :  new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      contrasenia: new FormControl('', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')]),
      formacionAcademica: new FormControl('', Validators.required),
      descripcion: new FormControl('', Validators.required),
      imagen: new FormControl('', Validators.required),
      institucion: new FormControl('', Validators.required),
      intereses: new FormControl('', Validators.required)
    }
  );

  @ViewChild('inputImagen')
  inputImagenPerfil: ElementRef;


  constructor( private sanitizer: DomSanitizer ) { }

  ngOnInit(): void {
  }


    /**
  * @name fileChangeEvent
  * @summary Esta función actualiza la referencia al evento de un `<input type="file">`.
  * @param {any} event - Evento que se desencadena al cambiar el estado de un `<input type="file">`.
  * @return {null} Esta función no retorna.
  */
     fileChangeEvent(event: any=""): void {

      this.imageChangedEvent = event;
  }


    /**
  * @name imageCropped
  * @summary Esta función actualiza la referencia al BLOB de la imagen una vez que ha sido recortada y elegida por el usuario.
  * @param {ParamDataTypeHere} parameterNameHere - Brief description of the parameter here. Note: For other notations of data types, please refer to JSDocs: DataTypes command.
  * @return {ReturnValueDataTypeHere} Brief description of the returning value here.
  */
  imageCropped(event: ImageCroppedEvent) {

    this.croppedImage = event.base64;
  }


  /**
  * @name reiniciarInputFile
  * @summary Reinicia el input para subir archivo
  * @param {} - No recibe parametros
  * @return {} - No retorna parametros.
  */
  reiniciarInputFile() {

    this.inputImagenPerfil.nativeElement.value = "";

  }


  /**
  * @name onGuardarRecorte
  * @summary Esta función guarda la imagen recortada por el usuario y actualiza la referencia a la previsualización de la misma.
  * @param {}  - Esta función no recibe parametros.
  * @return {} - Esta función no retorna.
  */
  onGuardarRecorte(){
    this.previsualizacion = this.croppedImage;
    this.croppedImage = '';
    this.errorImagen= false;
  }
    /**
  * @name onEliminarRecorte
  * @summary Esta función elimina la referencia a la imagen cargada y recortada.
  * @param {} - Esta función no recibe parametros.
  * @return {} - Esta función no retorna.
  */
  onEliminarRecorte(){


    this.croppedImage = ""
    this.previsualizacion = ""
    this.imageChangedEvent = ""
    this.reiniciarInputFile();
    this.errorImagen = true;
  }


  /**
  * @name actualizarIntereses
  * @summary Esta función actualiza la lista de 'tags' separandolos por coma.
  * @param {any} e - Evento que se desencadena al hacer un cambio en el campo `intereses` del formulario.
  * @return {} - No retorna
  */
  actualizarIntereses(e:any){
    this.intereses = e.split(",").filter( (interes:any) => interes.trim() != "" );
  }

  /**
  * @name getErrorMessageEmail
  * @summary Comprueba el error del campo 'email'.
  * @param {}  - No recibe parametro
  * @return { String } Retorna una cadena con el mensaje personalizado segun el error encontrado.
  */
  getErrorMessageEmail() {

    if (this.formularioRegistro.get('email').hasError('required')) {
      return 'Este es un campo obligatorio';
    }
    return this.formularioRegistro.get('email').errors?.pattern ? 'Correo no valido' : '';
  }

  /**
  * @name getErrorMessageContrasenia
  * @summary Comprueba el error del campo 'contrasenia'.
  * @param {}  - No recibe parametro
  * @return { String } Retorna una cadena con el mensaje personalizado segun el error encontrado.
  */
  getErrorMessageContrasenia() {
    if (this.formularioRegistro.get('contrasenia').hasError('required')) {
      return 'Este es un campo obligatorio';
    }
    return this.formularioRegistro.get('contrasenia').hasError('pattern') ? 'La contraseña debe tener un mínimo de 8 caracteres, al menos 1 letra mayúscula, 1 letra minúscula y 1 número' : '';
  }

  /**
  * @name getErrorMessage
  * @summary Comprueba el error en un campo previamente definido.
  * @param {String } nombreForm - Nombre del campo o elemento dentro del formulario.
  * @return { String } Retorna una cadena con el mensaje personalizado segun el error encontrado.
  */
  getErrorMessage(nombreForm:string) {
    if (this.formularioRegistro.get(nombreForm).hasError('required')) {
      return 'Este es un campo obligatorio';
    }
    return '';
  }









  /*
  capturarFile(event:any):any{
    const archivoCapturado = event.target.files[0];
    this.extraerBase64(archivoCapturado).then( (imagen:any)  => {
      this.previsualizacion = imagen.base;
      console.log(imagen);
    })
    this.archivos.push(archivoCapturado);
  }

  extraerBase64 = async ($event: any) => new Promise((resolve, reject) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
        resolve({

          base: reader.result
        });
      };
      reader.onerror = error => {
        resolve({
          blob: $event,
          image,
          base: null
        });
      };

    } catch (e) {
      return null;
    }
  })

  /*

  /**
  * @name onSubmitRegistro
  * @summary Función al presionar el boton de registro.
  * @param {any} evento - Evento onSubmit del formulario
  * @return {}
  */
  onSubmitRegistro(evento:any){
    evento.preventDefault();

    // Si el formulario es valido, esta listo para guardar
    if(this.formularioRegistro.valid){

      console.log(this.formularioRegistro.value);
      return;
    }

    // De lo contrario no hara nada

    if(this.inputImagenPerfil.nativeElement.value == ""){
      this.errorImagen = true;
    }


    return
  }




}

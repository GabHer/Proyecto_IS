import { Component, ElementRef, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { contraseniasIguales } from 'src/app/helppers/validaciones-personalizadas';

@Component({
  selector: 'app-formulario-registro-usuario',
  templateUrl: './formulario-registro-usuario.component.html',
  styleUrls: ['./formulario-registro-usuario.component.css']
})
export class FormularioRegistroUsuarioComponent implements OnInit {


  @Input() editarPerfil:boolean = false;
  @Input() objUsuario:any;

  @Output() formularioRegistrar = new EventEmitter<any>();
  @Output() formularioEditar = new EventEmitter<any>();
  @Output() cancelarEditar = new EventEmitter<boolean>();

  public archivos: any = [];
  public previsualizacion:String="";

  imgUsuarioPorDefecto = "../../../assets/img/FotoDePerfilPorDefecto.png";

  imageChangedEvent: any = '';
  croppedImage: any = '';

  oculto = true;
  errorImagen = false;
  intereses:any = [];
  mensajeError="";

  mensajeModal = [
    {tipo:"confirmacion", titulo1:"¿Cancelar?", titulo2:"No se guardaran los cambios", icono:"quiz"},

  ]

    /**
  * @name formularioRegistro
  * @type FormGroup
  * @summary - Formulario para el registro de usuarios.
  */
     formularioRegistro = new FormGroup(
      {
        nombre: new FormControl('', [Validators.required]),
        apellido: new FormControl('', [Validators.required]),
        nacimiento: new FormControl('', [Validators.required]),
        email:  new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
        contrasenia: new FormControl('', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')] ),
        repetirContrasenia: new FormControl('', [Validators.required]),
        formacionAcademica: new FormControl('', Validators.required),
        descripcion: new FormControl('', Validators.required),
        imagen: new FormControl(''),
        institucion: new FormControl('', [Validators.required]),
        intereses: new FormControl('', [Validators.required]),
        inputImg: new FormControl('', [Validators.required]),
      },
      { validators:contraseniasIguales }
      );

      @ViewChild('inputImagen')
      inputImagenPerfil: ElementRef;
  constructor( private modalService:NgbModal ) { }


  onSubmitFormulario(){
    if( this.formularioRegistro.invalid ) return;
    if( !this.previsualizacion ){
      this.errorImagen = true;
      return
    }

    var objUsuario = {
      Id: -1,
      Nombre: this.formularioRegistro.get("nombre").value,
      Apellido: this.formularioRegistro.get("apellido").value,
      Institucion: this.formularioRegistro.get("institucion").value,
      Formacion_Academica: this.formularioRegistro.get("formacionAcademica").value,
      Descripcion: this.formularioRegistro.get("descripcion").value,
      Intereses: this.formularioRegistro.get("intereses").value,
      Fecha_Nacimiento: this.formularioRegistro.get("nacimiento").value,
      Fotografia: this.previsualizacion,
      Correo: this.formularioRegistro.get("email").value,
      Contrasena: this.formularioRegistro.get("contrasenia").value,
    }

    if( this.editarPerfil ){
      objUsuario.Id = this.objUsuario.Id;
      this.formularioEditar.emit(objUsuario);
    }else {

      this.formularioRegistrar.emit(objUsuario);
    }


  }

  ngOnInit(): void {
    if(this.editarPerfil){
      this.cargarFormulario()
    }
  }

  cargarFormulario(){

      this.formularioRegistro.get("nombre").setValue(this.objUsuario.Nombre);
      this.formularioRegistro.get("apellido").setValue( this.objUsuario.Apellido);
      this.formularioRegistro.get("institucion").setValue(this.objUsuario.Institucion);
      this.formularioRegistro.get("formacionAcademica").setValue(this.objUsuario.Formacion_Academica);
      this.formularioRegistro.get("descripcion").setValue(this.objUsuario.Descripcion);
      this.formularioRegistro.get("intereses").setValue(this.objUsuario.Intereses);
      this.formularioRegistro.get("nacimiento").setValue(this.objUsuario.Fecha_Nacimiento.split("T")[0]);
      this.previsualizacion = this.objUsuario.Fotografia;
      this.formularioRegistro.get("inputImg").setValue("Foto_De_Perfil");
      this.formularioRegistro.get("email").setValue(this.objUsuario.Correo);
      this.formularioRegistro.get("contrasenia").setValue('Pruebas1234');
      this.formularioRegistro.get("repetirContrasenia").setValue('Pruebas1234');

      // Desactivar el boton para subir imagen
      this.formularioRegistro.get('imagen').disable();
      this.formularioRegistro.get('inputImg').disable();
  }

  limpiarFormulario(){
    this.formularioRegistro.get("nombre").setValue("");
    this.formularioRegistro.get("apellido").setValue( "");
    this.formularioRegistro.get("institucion").setValue("");
    this.formularioRegistro.get("formacionAcademica").setValue("");
    this.formularioRegistro.get("descripcion").setValue("");
    this.formularioRegistro.get("intereses").setValue("");
    this.formularioRegistro.get("nacimiento").setValue("");
    this.previsualizacion = "";
    this.formularioRegistro.get("inputImg").setValue("");
    this.formularioRegistro.get("email").setValue("");
    this.formularioRegistro.get("contrasenia").setValue('');
    this.formularioRegistro.get("repetirContrasenia").setValue('');
  }


    /**
  * @name fileChangeEvent
  * @summary Esta función actualiza la referencia al evento de un `<input type="file">`.
  * @param {any} event - Evento que se desencadena al cambiar el estado de un `<input type="file">`.
  * @return {null} Esta función no retorna.
  */
     fileChangeEvent(event: any=""): void {
      if(event.target.files.length != 0){
        this.formularioRegistro.get("inputImg").setValue(event.target.files[0].name)
      }
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
    this.formularioRegistro.get('imagen').disable();
    this.formularioRegistro.get('inputImg').disable();
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
    // Desactivar el boton para subir imagen
    this.formularioRegistro.get('imagen').enable();
    this.formularioRegistro.get('inputImg').enable();
    this.formularioRegistro.get('inputImg').setValue('');

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


    return this.formularioRegistro.get('email').errors?.pattern ? 'Correo no válido' : '';
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

  getErrorMessageRepetirContrasenia(){

    if (this.formularioRegistro.get('repetirContrasenia').hasError('required')) {
      return 'Este es un campo obligatorio';
    }
    if (this.formularioRegistro.getError('contraseniasIguales')) {

      return 'Las contraseñas no coinciden';
    }

    return "Ocurrio un error";
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

  onClickCancelar(letModal:any){
    this.editarPerfil = false;
    this.cancelarEditar.emit(true);
    letModal.close('Close click');

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

import { Component, ElementRef, Input, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { SpinnerService } from 'src/app/services/spinner.service';
import { DiplomaService } from 'src/app/services/diploma.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-firma-encargado',
  templateUrl: './firma-encargado.component.html',
  styleUrls: ['./firma-encargado.component.css']
})
export class FirmaEncargadoComponent implements OnInit {

  @ViewChild('inputImagen')
  inputImagenPerfil: ElementRef;
  mensajeModal = [
    {tipo:"confirmacion", titulo1:"¿Eliminar?", titulo2:"La conferencia o taller se eliminaran del evento", icono:"quiz"},
    {tipo:"error", titulo1:"Ocurrió un error", titulo2:"", icono:"error"},
    {tipo:"confirmacion", titulo1:"¿Desinscribirse?", titulo2:"Se eliminara su inscripción de este evento", icono:"quiz"},
  ]

  @Input() conferencia;
  @Output() onRegresar = new EventEmitter<any>();
  usuarioEncargado:any
  constructor( private usuarioService:UsuariosService, private diplomaService:DiplomaService, private spinner:SpinnerService, private modalService:NgbModal ) { }

  ngOnInit(): void {
    this.obtenerEncargado();

  }


  imageChangedEvent: any = '';
  croppedImage: any = '';
  previsualizacion:any = "";

  formularioFirma = new FormGroup(
    {
      firma: new FormControl(''),
      inputFirma: new FormControl('', [Validators.required])
    }
  );


  subirFirma(modalExito:any, modalError:any){

    this.spinner.mostrarSpinner();

    let objFirma = {
      idConferencia : this.conferencia.Id,
      idEncargado: this.usuarioEncargado.Id,
      imagenFirma: this.previsualizacion
    }

    this.diplomaService.guardarFirmaEncargado(objFirma).subscribe(
      (res:any) => {
        if(res.codigo == 200){
          this.abrirModal(modalExito);
          this.onRegresar.emit(null);
        }else{
          this.abrirModal(modalError);
        }
        this.spinner.ocultarSpinner();
      },
      (err:any) => {
        console.log(err);
        this.mensajeModal[1].titulo2 = err.error.mensaje;
        this.abrirModal(modalError);
        this.spinner.ocultarSpinner();
      }
    );
  }

  obtenerEncargado(){
    this.usuarioService.obtenerUsuario(this.conferencia.Correo_Encargado).subscribe(
      (res:any) => {
        this.usuarioEncargado = res.data;

      },
      (err:any) => {
        console.log(err)
        this.usuarioEncargado = null;
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

    /**
  * @name fileChangeEvent
  * @summary Esta función actualiza la referencia al evento de un `<input type="file">`.
  * @param {any} event - Evento que se desencadena al cambiar el estado de un `<input type="file">`.
  * @return {null} Esta función no retorna.
  */
     fileChangeEvent(event:any): void {
      if(event.target.files.length != 0){
        this.formularioFirma.get("inputFirma").setValue(event.target.files[0].name)
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
      this.formularioFirma.get('firma').disable();
      this.formularioFirma.get('inputFirma').disable();
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

      // Desactivar el boton para subir imagen
      this.formularioFirma.get('firma').enable();
      this.formularioFirma.get('inputFirma').enable();
      this.formularioFirma.get('inputFirma').setValue('');

    }
}

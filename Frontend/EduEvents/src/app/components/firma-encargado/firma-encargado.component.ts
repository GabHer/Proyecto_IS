import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-firma-encargado',
  templateUrl: './firma-encargado.component.html',
  styleUrls: ['./firma-encargado.component.css']
})
export class FirmaEncargadoComponent implements OnInit {

  @ViewChild('inputImagen')
  inputImagenPerfil: ElementRef;

  @Input() conferencia;

  constructor() { }

  ngOnInit(): void {
    console.log(this.conferencia)
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


  subirFirma(){
    console.log(this.previsualizacion)
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

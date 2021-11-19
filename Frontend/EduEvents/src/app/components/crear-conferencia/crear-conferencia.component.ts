import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { v4 as uuidv4 } from 'uuid';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerService } from 'src/app/services/spinner.service';
import { EventosService } from 'src/app/services/eventos.service';

@Component({
  selector: 'app-crear-conferencia',
  templateUrl: './crear-conferencia.component.html',
  styleUrls: ['./crear-conferencia.component.css']
})
export class CrearConferenciaComponent implements OnInit {

  nombreArchivoImagen = 'Subir imagen';



  @Output() onChangePath = new EventEmitter<string>();
  @Output() onCrearConferencia = new EventEmitter<any>();
  @Input() isCollaps: boolean;
  @Input() organizador: any;

  labelPosition: 'taller' | 'conferencia' = 'conferencia';
  disabled = false;

  mostrarImg = true;
  ImageChangeEvent: any = '';

  imageChangedEvent: any = '';
  croppedImage: any = '';

  previsualizacion:any = '';
  previsualizacionImg:any = '';
  constructor(private sanitizer: DomSanitizer, private modalService:NgbModal, private eventoService:EventosService, private spinner:SpinnerService  ) { }

  ngOnInit(): void {
  }

  formularioCrearConferencia = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    tipo: new FormControl('', [Validators.required]),
    encargado: new FormControl('', [Validators.required]),
    horaInicio: new FormControl('', [Validators.required]),
    horaFinal: new FormControl('', [Validators.required]),
    fecha: new FormControl('', [Validators.required]),
    cantidadAsistentes: new FormControl('', [Validators.required]),
    lugar: new FormControl('', [Validators.required]),
    subirImg: new FormControl('', [Validators.required]),
    inputImg: new FormControl( 'Seleccionar', [Validators.required]),
  });

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });


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
  * @name imgFileChangeEvent
  * @summary Esta función actualiza la referencia al evento de un `<input type="file">`.
  * @param {any} event - Evento que se desencadena al cambiar el estado de un `<input type="file">`.
  * @return {null} Esta función no retorna.
  */
    imgFileChangeEvent(event: any=""): void {
      this.ImageChangeEvent = event;
      this.mostrarImg = false;

  }

  /**
  * @name onGuardarRecorteImg
  * @summary Esta función guarda la imagen recortada por el usuario y actualiza la referencia a la previsualización de la misma.
  * @param {}  - Esta función no recibe parametros.
  * @return {} - Esta función no retorna.
  */
   onGuardarRecorteImg(){
    this.formularioCrearConferencia.get('inputImg').setValue(this.ImageChangeEvent.target.files[0].name);
    this.previsualizacionImg = this.croppedImage;
    this.croppedImage = '';
    this.ImageChangeEvent = '';
    this.mostrarImg = true;
  }

    /**
  * @name onEliminarRecorteImg
  * @summary Esta función elimina la referencia a la imagen cargada y recortada.
  * @param {} - Esta función no recibe parametros.
  * @return {} - Esta función no retorna.
  */
  onEliminarRecorteImg(){
    this.croppedImage = ""
    this.previsualizacionImg = ""
    this.ImageChangeEvent = ""
    this.mostrarImg = true;
  }

  abrirModal( modal:any ){
    this.modalService.open(
      modal,
      {
        size: 'xs',
        centered: true
      }
    );
  };

  onClickCancelar( modal:any){
    this.abrirModal(modal);
  };

  onModalCancelar( letModal:any ){
    letModal.close('Close click');
    this.onChangePath.emit('Mis eventos');
  };

  onClickCrearEvento( modalExito:any, modalError:any){

    if( this.formularioCrearConferencia.invalid ) return;

  };
}

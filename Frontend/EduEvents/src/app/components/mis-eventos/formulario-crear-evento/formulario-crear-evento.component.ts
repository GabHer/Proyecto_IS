import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { v4 as uuidv4 } from 'uuid';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerService } from 'src/app/services/spinner.service';
import { ListaBlancaService } from 'src/app/services/lista-blanca.service';

@Component({
  selector: 'app-formulario-crear-evento',
  templateUrl: './formulario-crear-evento.component.html',
  styleUrls: ['./formulario-crear-evento.component.css']
})
export class FormularioCrearEventoComponent implements OnInit {

  @ViewChild('UploadFileInput') uploadFileInput: ElementRef;
  nombreArchivoListaBlanca = 'Seleccionar';
  nombreArchivoImagen = 'Subir imagen';

  @Output() onChangePath = new EventEmitter<string>();
  @Output() onCrearEvento = new EventEmitter<any>();
  @Input() isCollaps: boolean;
  @Input() organizador: any;

  mostrarCaratula = true;
  mostrarMiniaturaImagenes = true;


  labelPosition: 'privado' | 'publico' = 'publico';
  disabled = false;


  imagenesEvento:any = [];

  caratulaImageChangeEvent: any = '';
  caratulaCroppedImage: any = '';

  imageChangedEvent: any = '';
  croppedImage: any = '';

  previsualizacion:any = '';
  previsualizacionCaratula:any = '';

  listaBlanca:any = '';


  mensajeModal = [
    {tipo:"confirmacion", titulo1:"¿Cancelar?", titulo2:"El evento no se creara", icono:"quiz"},
    {tipo:"error", titulo1:"Ocurrió un error", titulo2:"", icono:"error"},
  ]

  constructor( private sanitizer: DomSanitizer, private modalService:NgbModal, private listaBlancaService:ListaBlancaService  ) { }


  ngOnInit(): void {
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
  * @name caratulaImageCropped
  * @summary Esta función actualiza la referencia al BLOB de la imagen una vez que ha sido recortada y elegida por el usuario.
  * @param {ParamDataTypeHere} parameterNameHere - Brief description of the parameter here. Note: For other notations of data types, please refer to JSDocs: DataTypes command.
  * @return {ReturnValueDataTypeHere} Brief description of the returning value here.
  */
     caratulaImageCropped(event: ImageCroppedEvent) {
      this.caratulaCroppedImage = event.base64;
    }

  /**
  * @name formularioCrearEvento
  * @type FormGroup
  * @summary - Formulario para crear eventos.
  */
   formularioCrearEvento = new FormGroup(
    {
      nombre: new FormControl('', [Validators.required]),
      institucion: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required]),
      tipoEvento: new FormControl( '', [Validators.required]),
      subirArchivo: new FormControl('', [Validators.required]),
      inputArchivo: new FormControl( 'Seleccionar'),
      subirImagen: new FormControl('', [Validators.required]),
      inputCaratula: new FormControl( 'Seleccionar'),
      subirCaratula: new FormControl('')
    }
    );

    range = new FormGroup({
      start: new FormControl(),
      end: new FormControl(),
    });


    /**
  * @name fileChangeEvent
  * @summary Esta función actualiza la referencia al evento de un `<input type="file">`.
  * @param {any} event - Evento que se desencadena al cambiar el estado de un `<input type="file">`.
  * @return {null} Esta función no retorna.
  */
     fileChangeEvent(event: any=""): void {
      this.imageChangedEvent = event;
      this.mostrarMiniaturaImagenes = false;
  }

    /**
  * @name caratulaFileChangeEvent
  * @summary Esta función actualiza la referencia al evento de un `<input type="file">`.
  * @param {any} event - Evento que se desencadena al cambiar el estado de un `<input type="file">`.
  * @return {null} Esta función no retorna.
  */
     caratulaFileChangeEvent(event: any=""): void {
      this.caratulaImageChangeEvent = event;
      this.mostrarCaratula = false;

  }


    /**
  * @name archivoFileChangeEvent
  * @summary Esta función actualiza la referencia al evento de un `<input type="file">`.
  * @param {any} event - Evento que se desencadena al cambiar el estado de un `<input type="file">`.
  * @return {null} Esta función no retorna.
  */
     archivoFileChangeEvent(event:any): void {
      let archivoCapturado = event.target.files[0];


      this.formularioCrearEvento.get('inputArchivo').setValue(archivoCapturado.name);

      this.extraerBase64(archivoCapturado).then( (contenido:any)  => {
        this.listaBlanca = contenido.base;
      })

  }


  extraerBase64 = async ($event: any) => new Promise((resolve, reject) => {
    try {
      const unsafeFile = window.URL.createObjectURL($event);
      const contenido = this.sanitizer.bypassSecurityTrustUrl(unsafeFile);
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
          contenido,
          base: null
        });
      };

    } catch (e) {
      return null;
    }
  })

  /**
  * @name onGuardarRecorte
  * @summary Esta función guarda la imagen recortada por el usuario y actualiza la referencia a la previsualización de la misma.
  * @param {}  - Esta función no recibe parametros.
  * @return {} - Esta función no retorna.
  */
   onGuardarRecorte(){

    let dataImagen = {
      id: uuidv4(),
      blob : this.croppedImage,
      fileData: this.imageChangedEvent.target.files[0]
    }

    this.imagenesEvento.push(dataImagen);
    this.onEliminarRecorte();
    this.mostrarMiniaturaImagenes = true;
  }
  /**
  * @name onGuardarRecorte
  * @summary Esta función guarda la imagen recortada por el usuario y actualiza la referencia a la previsualización de la misma.
  * @param {}  - Esta función no recibe parametros.
  * @return {} - Esta función no retorna.
  */
   onGuardarRecorteCaratula(){
    this.formularioCrearEvento.get('inputCaratula').setValue(this.caratulaImageChangeEvent.target.files[0].name);
    this.previsualizacionCaratula = this.caratulaCroppedImage;
    this.caratulaCroppedImage = '';
    this.caratulaImageChangeEvent = '';
    this.mostrarCaratula = true;
  }

    /**
  * @name onEliminarRecorte
  * @summary Esta función elimina la referencia a la imagen cargada y recortada.
  * @param {} - Esta función no recibe parametros.
  * @return {} - Esta función no retorna.
  */
  onEliminarRecorteCaratula(){
    this.caratulaCroppedImage = ""
    this.previsualizacionCaratula = ""
    this.caratulaImageChangeEvent = ""
    this.mostrarCaratula = true;
  }
    /**
  * @name onEliminarRecorte
  * @summary Esta función elimina la referencia a la imagen cargada y recortada.
  * @param {} - Esta función no recibe parametros.
  * @return {} - Esta función no retorna.
  */
  onEliminarRecorte(){

    console.log(this.previsualizacion);
    this.croppedImage = ""
    this.previsualizacion = ""
    this.imageChangedEvent = ""
    this.mostrarMiniaturaImagenes = true;
  }
  eliminarImagen( idImagen:string ){
    this.imagenesEvento = this.imagenesEvento.filter( (imagen:any) => imagen.id != idImagen );
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

  onClickCrearEvento( modalExito:any, modalError:any){

    if( this.formularioCrearEvento.invalid ) return;

    console.log(this.formularioCrearEvento.get('subirCaratula'));
    let evento = {
      Nombre: this.formularioCrearEvento.get('nombre').value,
      Institucion: this.formularioCrearEvento.get('institucion').value,
      Descripcion: this.formularioCrearEvento.get('descripcion').value,
      Fecha_Inicio: this.range.get('start').value,
      Fecha_Final: this.range.get('end').value,
      Estado_Participantes: this.formularioCrearEvento.get('tipoEvento').value == 'privado' ? 0 : 1,
      Estado_Evento: 'Inactivo',
      Id_Organizacion: this.organizador.id,
      Lista_Blanca: this.listaBlanca,
      imagenesEvento: this.imagenesEvento,
      Caratula: this.previsualizacionCaratula

    }


    if( (evento.Lista_Blanca == '') && (evento.Estado_Participantes == 0)){
      this.mensajeModal[1].titulo2 = 'Si un evento es privado se requiere una lista blanca con los participantes con acceso';
      this.abrirModal( modalError );
      return;
    }

    if( evento.imagenesEvento.length == 0 ){
      this.mensajeModal[1].titulo2 = 'Es necesario que subas almenos una imagen para promocionar tu evento';
      this.abrirModal( modalError );
      return;
    }
    if( this.previsualizacionCaratula == '' ){
      this.mensajeModal[1].titulo2 = 'Se requiere una imagen de caratula para tu evento';
      this.abrirModal( modalError );
      return;
    }

    // Hacer la petición al servidor
    this.abrirModal(modalExito);
    console.log(evento);
    this.onChangePath.emit('Mis eventos');
    this.onCrearEvento.emit(evento);
  }


  onClickCancelar( modal:any){
    this.abrirModal(modal);
  }

  onModalCancelar( letModal:any ){
    letModal.close('Close click');
    this.onChangePath.emit('Mis eventos');
  }

}

import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { v4 as uuidv4 } from 'uuid';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerService } from 'src/app/services/spinner.service';
import { EventosService } from 'src/app/services/eventos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';


export interface Encargado {
  id:number,
  imagen: string;
  nombre: string;
  apellido: string;
  correo: string;
  institucion:string;
  formacionAcademica:string;
  intereses:any;
  descripcion:string;
}
@Component({
  selector: 'app-crear-conferencia',
  templateUrl: './crear-conferencia.component.html',
  styleUrls: ['./crear-conferencia.component.css']
})
export class CrearConferenciaComponent implements OnInit {

  nombreArchivoImagen = 'Subir imagen';
  usuarios:any = [];


  @Output() onChangePath = new EventEmitter<string>();
  @Output() onCrearConferencia = new EventEmitter<any>();
  @Input() isCollaps: boolean;
  @Input() organizador: any;
  @Input() idEvento: any;

  labelPositionTipo: 'taller' | 'conferencia' = 'conferencia';
  labelPositionCanal: 'presencial' | 'virtual' = 'virtual';
  disabled = false;

  mostrarImg = true;
  ImageChangeEvent: any = '';

  imageChangedEvent: any = '';
  croppedImage: any = '';

  previsualizacion:any = '';
  previsualizacionImg:any = '';

  encargado = new FormControl('', [Validators.required]);
  filteredEncargado:Observable<Encargado[]>;


  encargados: Encargado[] = [
    {
      id: -1,
      imagen: "",
      nombre: "",
      apellido: "",
      correo: "",
      institucion:"",
      formacionAcademica:"",
      intereses: "",
      descripcion:""
    }
  ]

  constructor(private sanitizer: DomSanitizer, private modalService:NgbModal, private eventoService:EventosService, private spinner:SpinnerService, private usuarioService:UsuariosService ) {

    this.filteredEncargado = this.encargado.valueChanges.pipe(
      startWith(''),
      map(encargado => (encargado ? this._filterEncargados(encargado) : this.encargados.slice())),
    );

  }

  ngOnInit(): void {
    this.obtenerUsuarios();


  }


  private _filterEncargados(value:string): Encargado[] {
    const filterValue = value.toLowerCase();
    return this.encargados.filter( encargado => encargado.correo.toLocaleLowerCase().includes(filterValue) );
  }




  formularioCrearConferencia = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    tipo: new FormControl('', [Validators.required]),
    horaInicio: new FormControl('', [Validators.required]),
    horaFinal: new FormControl('', [Validators.required]),
    fecha: new FormControl('', [Validators.required]),
    cantidadAsistentes: new FormControl('', [Validators.required]),
    canal: new FormControl('', [Validators.required]),
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

  obtenerFormatoFecha( date:Date){

    return date.toISOString().split('T')[0]
  }

  onClickCrearConferenciaEvento( modalExito:any, modalError:any){

    if( this.formularioCrearConferencia.invalid ) return;
    let objConferencia = {
      Id_Evento : this.idEvento,
      Nombre: this.formularioCrearConferencia.get("nombre").value,
      Descripcion: this.formularioCrearConferencia.get("descripcion").value,
      Tipo: this.formularioCrearConferencia.get("tipo").value,
      Id_Encargado: this.encargado.value,
      Hora_Inicio: this.formularioCrearConferencia.get("horaInicio").value,
      Hora_Final: this.formularioCrearConferencia.get("horaFinal").value,
      Fecha: this.obtenerFormatoFecha(this.formularioCrearConferencia.get("fecha").value),
      Limite_Participantes: this.formularioCrearConferencia.get("cantidadAsistentes").value,
      Lugar: this.formularioCrearConferencia.get("lugar").value,
      Imagen: this.previsualizacionImg
    }


    console.log(objConferencia);

  };



  obtenerUsuarios(){
    this.usuarioService.obtenerUsuarios().subscribe(
      (res:any) => {
        this.usuarios = res;

        for (let i = 0; i < this.usuarios.length; i++) {

          let encargado:Encargado = {
            apellido: this.usuarios[i].Apellido,
            correo: this.usuarios[i].Correo,
            descripcion: this.usuarios[i].Descripcion,
            formacionAcademica: this.usuarios[i].Formacion_Academica,
            id: this.usuarios[i].Id,
            institucion: this.usuarios[i].Institucion,
            imagen: this.usuarios[i].Fotografia,
            intereses: this.usuarios[i].Intereses,
            nombre: this.usuarios[i].Nombre
          }
          this.encargados.push(encargado);
        }
      },
      (err:any) => {
        console.log(err)
      }
    );
  }
}

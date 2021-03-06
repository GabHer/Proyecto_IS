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

  evento:any = {}

  labelPositionTipo: 'Taller' | 'Conferencia' = 'Conferencia';
  labelPositionCanal: 'Presencial' | 'Virtual' = 'Virtual';
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

  mensajeModal = [
    {tipo:"confirmacion", titulo1:"??Cancelar?", titulo2:"??No se guardar??n los cambios!", icono:"quiz"},
    {tipo:"error", titulo1:"Ocurri?? un error", titulo2:"No se pudo guardar.", icono:"error"},
  ]

  constructor(private sanitizer: DomSanitizer, private modalService:NgbModal, private eventoService:EventosService, private spinner:SpinnerService, private usuarioService:UsuariosService ) {

    this.filteredEncargado = this.encargado.valueChanges.pipe(
      startWith(''),
      map(encargado => (encargado ? this._filterEncargados(encargado) : this.encargados.slice())),
    );

  }

  ngOnInit(): void {
    this.obtenerUsuarios();
    this.obtenerEvento();

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
  * @summary Esta funci??n actualiza la referencia al BLOB de la imagen una vez que ha sido recortada y elegida por el usuario.
  * @param {ParamDataTypeHere} parameterNameHere - Brief description of the parameter here. Note: For other notations of data types, please refer to JSDocs: DataTypes command.
  * @return {ReturnValueDataTypeHere} Brief description of the returning value here.
  */
      imageCropped(event: ImageCroppedEvent) {

      this.croppedImage = event.base64;
    }

    /**
  * @name imgFileChangeEvent
  * @summary Esta funci??n actualiza la referencia al evento de un `<input type="file">`.
  * @param {any} event - Evento que se desencadena al cambiar el estado de un `<input type="file">`.
  * @return {null} Esta funci??n no retorna.
  */
    imgFileChangeEvent(event: any=""): void {
      
      this.ImageChangeEvent = event;
      this.mostrarImg = false;
  }

  /**
  * @name onGuardarRecorteImg
  * @summary Esta funci??n guarda la imagen recortada por el usuario y actualiza la referencia a la previsualizaci??n de la misma.
  * @param {}  - Esta funci??n no recibe parametros.
  * @return {} - Esta funci??n no retorna.
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
  * @summary Esta funci??n elimina la referencia a la imagen cargada y recortada.
  * @param {} - Esta funci??n no recibe parametros.
  * @return {} - Esta funci??n no retorna.
  */
  onEliminarRecorteImg(){
    this.croppedImage = ""
    this.previsualizacionImg = ""
    this.ImageChangeEvent = ""
    this.mostrarImg = true;
    this.formularioCrearConferencia.get("inputImg").setValue("");
    this.formularioCrearConferencia.get("subirImg").setValue("");
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

  obtenerFormatoFecha( date:any){

    return date.toISOString().split('T')[0]
  }

  onClickCrearConferenciaEvento( modalExito:any, modalError:any){

    if( this.formularioCrearConferencia.invalid ) return;
    this.spinner.mostrarSpinner();

    let objConferencia = {
      Id_Evento : this.idEvento,
      Tipo: this.formularioCrearConferencia.get("tipo").value == 'Conferencia' ? 1 : 0 ,
      Nombre: this.formularioCrearConferencia.get("nombre").value,
      Descripcion: this.formularioCrearConferencia.get("descripcion").value,
      Modalidad: this.formularioCrearConferencia.get("canal").value == 'Virtual'? 1 : 0,
      Medio: this.formularioCrearConferencia.get("lugar").value,
      Correo_Encargado: this.encargado.value,
      Fecha_Inicio: this.obtenerFormatoFecha(this.formularioCrearConferencia.get("fecha").value),
      Hora_Inicio: this.formularioCrearConferencia.get("horaInicio").value,
      Hora_Final: this.formularioCrearConferencia.get("horaFinal").value,
      Imagen: this.previsualizacionImg,
      Limite_Participantes: this.formularioCrearConferencia.get("cantidadAsistentes").value,
    }


    this.eventoService.crearConferencia( objConferencia ).subscribe(
      (res:any) => {
          if(res.codigo == 200){
            this.abrirModal(modalExito);
            this.onCrearConferencia.emit(null);

          }

          if( res.codigo == 406 ){
            this.mensajeModal[1].titulo2 = res.mensaje
            this.abrirModal(modalError);
          }
          this.spinner.ocultarSpinner();

      },
      (err:any) => {

        if(err.error.error.estado == 'fecha_no_v??lida'){
          this.mensajeModal[1].titulo2 = "Fecha no v??lida, la fecha de la conferencia o taller debe de estar dentro del rango del evento";
          this.abrirModal(modalError);
        }else{
          this.mensajeModal[1].titulo2 = "Ocurrio un error, intentalo de nuevo";
          this.abrirModal(modalError);
        }
        this.spinner.ocultarSpinner();

      }
    );

  };


  obtenerEvento(){
    this.eventoService.obtenerEventoPorId(this.idEvento).subscribe(
      (res:any) => {
        this.evento = res.data;
      },
      err => console.log(err)
    );
  }


  obtenerUsuarios(){
    this.usuarioService.obtenerUsuarios().subscribe(
      (res:any) => {
        this.usuarios = res;
        let encargados = []
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
          encargados.push(encargado);
        }
        this.encargados = encargados;
      },
      (err:any) => {
      }
    );
  }
}

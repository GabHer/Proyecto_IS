import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { EventosService } from 'src/app/services/eventos.service';
import { SpinnerService } from 'src/app/services/spinner.service';

export interface Evento  {
  Id:number,
  Caratula:string,
  Nombre:string,
  Institucion:string,
  Descripcion:string,
  Fecha_Inicio:string,
  Fecha_Final:string,
  Estado_Participantes:number,
  Estado_Evento:string,
  Id_Organizador:number
}

@Component({
  selector: 'app-mis-eventos',
  templateUrl: './mis-eventos.component.html',
  styleUrls: ['./mis-eventos.component.css']
})
export class MisEventosComponent implements OnInit, OnChanges {

  @Input() isCollaps:boolean;
  @Input() usuarioActual:any;
  @Input() ctrlBuscar:string = '';
  @Input() ctrlBuscarRangoFecha:any = '';
  @Input() ctrlBuscarEstado:any = '';
  @Input() vistaBuscar = false;

  @Output() onCrearConferencia = new EventEmitter<any>();
  @Output() onCrearEvento = new EventEmitter<any>();
  @Output() onEliminarEvento = new EventEmitter<any>();
  @Output() onOcultarBuscador = new EventEmitter<boolean>();


  nombre = new FormControl('');
  filtroActual:any = {
    nombre : true,
    fecha: false,
    tipo: false
  }
  @Input() misEventos: Evento[] = [
    {
      Id:-1,
      Caratula: "",
      Nombre: "",
      Institucion: "",
      Descripcion: "",
      Fecha_Inicio: "",
      Fecha_Final: "",
      Estado_Participantes: -1,
      Estado_Evento: "",
      Id_Organizador: -1
    }
    ];
  eventosPorFecha: Evento[] = [];
  eventosPorEstado: Evento[] = [];
  filteredEvento:Observable<Evento[]>;
  idEvento = -1;



  mostrarFormularioEvento = false;
  mostrarFormularioConferencia = false;
  mostrarDetallesEvento = false;

  mensajeModal = [
    {tipo:"confirmacion", titulo1:"¿Eliminar?", titulo2:"El evento se eliminará de tu lista", icono:"quiz"},
    {tipo:"error", titulo1:"Ocurrió un error", titulo2:"", icono:"error"},
  ]

  constructor( private eventosService:EventosService,private spinner:SpinnerService, private modalService:NgbModal ) {


  }
  ngOnChanges(changes: SimpleChanges): void {

    if( changes?.ctrlBuscar?.currentValue != '' ){
      this.nombre.setValue(this.ctrlBuscar);
      this.filtroActual.nombre = true;
      this.filtroActual.fecha = false;
      this.filtroActual.tipo = false;

    }
    if( changes?.ctrlBuscarRangoFecha?.currentValue ){
      this.filtroActual.nombre = false;
      this.filtroActual.fecha = true;
      this.filtroActual.tipo = false;
      this.obtenerMisEventosPorFecha()
    }
    if( changes?.ctrlBuscarEstado?.currentValue ){
      this.filtroActual.nombre = false;
      this.filtroActual.fecha = false;
      this.filtroActual.tipo = true;
      this.obtenerMisEventosPorEstado()
    }


  }

  ngOnInit(): void {
    this.filteredEvento = this.nombre.valueChanges.pipe(
      startWith(''),
      map(evento => (evento ? this._filterNombreEvento(evento) : this.misEventos.slice())),
    );
  }
  mostrarFormularioCrearEvento(b: boolean){
    this.mostrarFormularioEvento = b
  }

  private _filterNombreEvento(value:any): Evento[] {

    const filterValue = value.toLowerCase();
    return this.misEventos.filter( evento => evento.Nombre.toLocaleLowerCase().includes(filterValue) );
  }



  onSussesCrearConferencia(){

    this.mostrarFormularioEvento = false;
    this.mostrarFormularioConferencia = false;
    this.onCrearConferencia.emit(null);


  }

  onSussesCrearEvento(){

    this.mostrarFormularioEvento = false;
    this.mostrarFormularioConferencia = false;
    this.mostrarDetallesEvento = false;
    this.onCrearEvento.emit(null);
  }

  onSussesEliminarEvento(){
    // Emitir event
    this.onEliminarEvento.emit(null);
    this.obtenerMisEventosPorFecha()
  }

  eliminarEvento(idEvento:any){

    this.spinner.mostrarSpinner();
    this.eventosService.eliminarEvento( idEvento ).subscribe(
      (res:any) => {
        this.onSussesEliminarEvento()
      },
      (err:any) => {
        this.spinner.ocultarSpinner();
      },
      () => {
        this.spinner.ocultarSpinner();
      }
    );
  }

  onClickAbrirModalEliminarEvento(modal:any, idEvento:number){
    this.idEvento = idEvento;
    this.abrirModal(modal);
  }

  onClickConfirmarEliminarEvento(letModal:any, idEvento:any){
    letModal.close('Close click');
    this.eliminarEvento(idEvento);
  }

  actualizarPath( path:string ){

    this.vistaBuscar = false;

    switch (path) {
      case "Mis eventos":
        this.onOcultarBuscador.emit(false)
        this.mostrarFormularioEvento = false;
        this.mostrarFormularioConferencia = false;
        this.mostrarDetallesEvento = false;
        break;

      default:
        break;
    }

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

  mostrarFormularioCrearConferencia(event:any){
    this.mostrarFormularioConferencia = true;
    this.onOcultarBuscador.emit(true)
    this.idEvento = event;
  }

  obtenerMisEventosPorFecha(){
    if(!this.ctrlBuscarRangoFecha) return;
    this.eventosService.obtenerMisEventosPorFecha( this.ctrlBuscarRangoFecha.fechaInicio, this.ctrlBuscarRangoFecha.fechaFinal, this.usuarioActual.Id ).subscribe(
      (res:any) => {
        this.eventosPorFecha = res.data
        this.ctrlBuscarRangoFecha = null;
      },
      (err) => {
        this.eventosPorFecha = [];
        this.ctrlBuscarRangoFecha = null;
      }
    );
  }
  obtenerMisEventosPorEstado(){
    if(!this.ctrlBuscarEstado) return;
    this.eventosService.obtenerMisEventosPorEstado( this.ctrlBuscarEstado, this.usuarioActual.Id ).subscribe(
      (res:any) => {
        if(res.codigo == 200 ){
          this.eventosPorEstado = res.data
          this.ctrlBuscarEstado = null;
        }
      },
      (err) => {
        this.eventosPorEstado = [];
        this.ctrlBuscarEstado = null;
      }
    );
  }
  mostrarFormularioDetallesEvento(event:any){

    this.onOcultarBuscador.emit(true)
    this.mostrarDetallesEvento = true;
    this.idEvento = event;
    console.log(this.idEvento);
  }

  obtenerEvento(id:number){

    let evento =  this.misEventos.filter( (evento:any) => evento.Id == id );
    return evento[0];
  }



}

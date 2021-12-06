import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
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
  Estado_Evento:number,
  Id_Organizador:number
}


@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit, OnChanges {


  @Input() usuarioActual:any;
  @Input() ctrlBuscar:string = '';
  @Input() ctrlBuscarRangoFecha:any = '';
  @Input() ctrlBuscarEstado:any = '';

  nombre = new FormControl('');

  eventos: Evento[] = [];
  eventosPorFecha: Evento[] = [];
  eventosPorEstado: Evento[] = [];
  filtroActual:any = {
    nombre : true,
    fecha: false,
    tipo: false
  }

    filteredEvento:Observable<Evento[]>;

  constructor( private eventosService:EventosService, private spinner:SpinnerService ) {
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
        this.obtenerEventosPorFecha()
      }

  }

  ngOnInit(): void {
    this.obtenerEventos();
  }


  private _filterNombreEvento(value:any): Evento[] {

    const filterValue = value.toLowerCase();
    return this.eventos.filter( evento => evento.Nombre.toLocaleLowerCase().includes(filterValue) );
  }

  setCtrlBuscar(value:string){
    this.ctrlBuscar = value;
    this.nombre.setValue(value);
    this.filtroActual.nombre = true;
    this.filtroActual.fecha = false;
    this.filtroActual.tipo = false;

  }
  setCtrlBuscarPorFecha(value:any){
    this.ctrlBuscarRangoFecha = value;
    this.filtroActual.nombre = false;
    this.filtroActual.fecha = true;
    this.filtroActual.tipo = false;
    this.obtenerEventosPorFecha()
  }
  setCtrlBuscarPorEstado(value:any){
    this.ctrlBuscarEstado = value;
    this.filtroActual.nombre = false;
    this.filtroActual.fecha = false;
    this.filtroActual.tipo = true;
    this.obtenerEventosPorEstado()
  }

  private obtenerEventos(){
    this.spinner.mostrarSpinner()
    this.eventosService.obtenerEventos().subscribe(
      (res:any)=> {

        this.eventos = res.data

        this.filteredEvento = this.nombre.valueChanges.pipe(
          startWith(''),
          map(evento => (evento ? this._filterNombreEvento(evento) : this.eventos.slice())),
        );
      },
      (err:any) => {

        this.eventos = [];
        this.spinner.ocultarSpinner();
      },
      () => {
        this.spinner.ocultarSpinner();
      }

     );
  }

  obtenerEventosPorFecha(){
    if(!this.ctrlBuscarRangoFecha) return;
    this.eventosService.obtenerEventosPorFecha( this.ctrlBuscarRangoFecha.fechaInicio, this.ctrlBuscarRangoFecha.fechaFinal ).subscribe(
      (res:any) => {
        this.eventosPorFecha = res.data
        this.ctrlBuscarRangoFecha = {};
      },
      (err) => {

        this.eventosPorFecha = [];
        this.ctrlBuscarRangoFecha = {};
      }
    );
  }

  obtenerEventosPorEstado(){
    if(!this.ctrlBuscarEstado) return;
    this.eventosService.obtenerEventosPorEstado( this.ctrlBuscarEstado ).subscribe(
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


}

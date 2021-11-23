import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { EventosService } from 'src/app/services/eventos.service';

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
  selector: 'app-buscar-evento',
  templateUrl: './buscar-evento.component.html',
  styleUrls: ['./buscar-evento.component.css']
})
export class BuscarEventoComponent implements OnInit, OnChanges {
  @Input() collapsar:boolean;
  @Input() ctrlBuscar:string = '';
  @Input() ctrlBuscarRangoFecha:any = '';
  @Input() ctrlBuscarEstado:any = '';
  @Input() idUsuarioActual:number = -1;

  nombre = new FormControl('');
  filtroActual:any = {
    nombre : true,
    fecha: false,
    tipo: false
  }
  @Input() eventos: Evento[] = [];
  eventosPorFecha: Evento[] = [];
  eventosPorEstado: Evento[] = [];
  filteredEvento:Observable<Evento[]>;
  constructor( private eventosService:EventosService ) {


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
    if( changes?.ctrlBuscarEstado?.currentValue ){
      this.filtroActual.nombre = false;
      this.filtroActual.fecha = false;
      this.filtroActual.tipo = true;
      this.obtenerEventosPorEstado()
    }


  }




  actualizarInput(value:string){
    this.nombre.setValue(value);
    return value;
  }

  private _filterNombreEvento(value:any): Evento[] {

    const filterValue = value.toLowerCase();
    return this.eventos.filter( evento => evento.Nombre.toLocaleLowerCase().includes(filterValue) );
  }

  ngOnInit(): void {
    this.filteredEvento = this.nombre.valueChanges.pipe(
      startWith(''),
      map(evento => (evento ? this._filterNombreEvento(evento) : this.eventos.slice())),
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

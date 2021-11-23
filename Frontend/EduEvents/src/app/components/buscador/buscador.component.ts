import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
  Estado_Evento:number,
  Id_Organizador:number
}

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})
export class BuscadorComponent implements OnInit {
  @Output() filtrarBusqueda = new EventEmitter<any>();
  @Output() filtrarBusquedaFecha = new EventEmitter<any>();
  @Output() filtrarPorEstado = new EventEmitter<any>();

  @Input() idUsuarioActual:number = -1;
  @Input() eventos: Evento[] = [
    {
      Id:-1,
      Caratula: "",
      Nombre: "",
      Institucion: "",
      Descripcion: "",
      Fecha_Inicio: "",
      Fecha_Final: "",
      Estado_Participantes: 0,
      Estado_Evento: 0,
      Id_Organizador: -1
    }
    ];
  filtroActual:string = "Nombre"; // Nombre | Fecha | Estado
  filteredEvento:Observable<Evento[]>;

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  estado = new FormControl('');
  nombre = new FormControl('');
  constructor( private eventosService:EventosService ) {

  }

  ngOnInit(): void {
    this.filteredEvento = this.nombre.valueChanges.pipe(
      startWith(''),
      map(evento => (evento ? this._filterNombreEvento(evento) : this.eventos.slice())),
    );
  }

  private _filterNombreEvento(value:string): Evento[] {
    const filterValue = value.toLowerCase();
    return this.eventos.filter( evento => evento.Nombre.toLocaleLowerCase().includes(filterValue) );
  }

  seleccionarFiltro( strFiltro:string ){
    this.filtroActual = strFiltro;

  }

  obtenerFormatoFecha( date:Date){

    return date.toISOString().split('T')[0]
  }

  onChangeInputNombre(){
    this.filtrarBusqueda.emit(this.nombre.value);
  }

  onChangeInputFecha(){

    if (this.range.controls.start.hasError('matStartDateInvalid')) return;
    if (this.range.controls.end.hasError('matEndDateInvalid')) return;
    if ( !this.range.controls.start.value || ! this.range.controls.end.value ) return;

    let fechaInicio = this.obtenerFormatoFecha(this.range.controls.start.value);
    let fechaFinal = this.obtenerFormatoFecha(this.range.controls.end.value);

    this.filtrarBusquedaFecha.emit({fechaInicio: fechaInicio, fechaFinal: fechaFinal});
  }

  onChangeSelectEstado(){
    this.filtrarPorEstado.emit(this.estado.value);
  }
}

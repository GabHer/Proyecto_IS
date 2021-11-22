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

  nombre = new FormControl('');

  eventos: Evento[] = [];

    filteredEvento:Observable<Evento[]>;

  constructor( private eventosService:EventosService, private spinner:SpinnerService ) {
  }
  ngOnChanges(changes: SimpleChanges): void {

      this.nombre.setValue(this.ctrlBuscar);


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


}

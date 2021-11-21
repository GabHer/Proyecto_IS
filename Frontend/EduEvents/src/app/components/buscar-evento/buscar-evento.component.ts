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
  @Input() idUsuarioActual:number = -1;

  nombre = new FormControl('');

  eventos: Evento[] = [
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

    filteredEvento:Observable<Evento[]>;
  constructor( private eventosService:EventosService ) {


   }
  ngOnChanges(changes: SimpleChanges): void {
    this.nombre.setValue(this.ctrlBuscar);
  }


  actualizarInput(value:string){
    this.nombre.setValue(value);
    console.log(this.nombre.value);
    return value;
  }

  private _filterNombreEvento(value:any): Evento[] {

    const filterValue = value.toLowerCase();
    return this.eventos.filter( evento => evento.Nombre.toLocaleLowerCase().includes(filterValue) );
  }

  ngOnInit(): void {
    this.obtenerEventos();

  }

  obtenerEventos(){
    this.eventosService.obtenerEventos().subscribe(
      (res:any) => {
        this.eventos = res.data;
        this.filteredEvento = this.nombre.valueChanges.pipe(
          startWith(''),
          map(evento => (evento ? this._filterNombreEvento(evento) : this.eventos.slice())),
        );

      },
      (err) => {
        console.log(err);
      }
    );
  }


}

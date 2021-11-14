import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})
export class BuscadorComponent implements OnInit {
  @Output() filtrarBusqueda = new EventEmitter<any>();
  filtroActual:string = "Nombre"; // Nombre | Fecha | Estado

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  nombre = new FormControl('');
  estado = new FormControl('');
  constructor() { }

  ngOnInit(): void {
  }

  seleccionarFiltro( strFiltro:string ){
    this.filtroActual = strFiltro;

  }

  onClickBuscar(){

    console.log(this.nombre.value)
    console.log(this.estado.value)
    console.log(this.range.value)


    // Buscar segun this.filtroActual
    /*
    this.eventoServicio.obtenerEventos( this.filtroActual, data )
    */
   let eventoEncontrado = {evento: "Evento encontrado"}

    this.filtrarBusqueda.emit(eventoEncontrado);


  }

}

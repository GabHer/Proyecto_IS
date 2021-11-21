import { Component, OnInit } from '@angular/core';
import { FiltroUsuarios } from '../filtro-usuarios';

@Component({
  selector: 'app-tabla-filtro-usuarios',
  templateUrl: './tabla-filtro-usuarios.component.html',
  styleUrls: ['./tabla-filtro-usuarios.component.css']
})
export class TablaFiltroUsuariosComponent implements OnInit {
  displayedColumns = ["seqNo", "description", "duration"];
  onRowClicked(row:any) {
    console.log('Row clicked: ', row);
  }

  constructor() { }

  ngOnInit(): void {
  }

}

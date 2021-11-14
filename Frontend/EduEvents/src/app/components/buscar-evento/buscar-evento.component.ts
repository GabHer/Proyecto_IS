import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-buscar-evento',
  templateUrl: './buscar-evento.component.html',
  styleUrls: ['./buscar-evento.component.css']
})
export class BuscarEventoComponent implements OnInit {
  @Input() collapsar:boolean;
  constructor() { }

  ngOnInit(): void {
  }

}

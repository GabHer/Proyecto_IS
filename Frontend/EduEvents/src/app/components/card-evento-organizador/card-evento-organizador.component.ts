import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-card-evento-organizador',
  templateUrl: './card-evento-organizador.component.html',
  styleUrls: ['./card-evento-organizador.component.css']
})
export class CardEventoOrganizadorComponent implements OnInit {
  @Input() evento:any;
  @Output() onClickEliminarEvento = new EventEmitter<number>();
  constructor() { }

  ngOnInit(): void {
  }

  eliminarEvento(){
    console.log(this.evento);
    this.onClickEliminarEvento.emit(this.evento.Id);
  }


}

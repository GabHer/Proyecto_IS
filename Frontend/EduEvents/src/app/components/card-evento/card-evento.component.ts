import { Component, Input, OnInit, Output , EventEmitter } from '@angular/core';

@Component({
  selector: 'app-card-evento',
  templateUrl: './card-evento.component.html',
  styleUrls: ['./card-evento.component.css']
})
export class CardEventoComponent implements OnInit {

  @Input() evento:any;
  @Output() onClickCardEvento = new EventEmitter<number>();



  constructor(  ) { }

  ngOnInit(): void {

  }

  seleccionarEvento(idEvento:number){
    this.onClickCardEvento.emit(idEvento)
  }

}

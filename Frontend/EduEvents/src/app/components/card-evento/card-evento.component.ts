import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-evento',
  templateUrl: './card-evento.component.html',
  styleUrls: ['./card-evento.component.css']
})
export class CardEventoComponent implements OnInit {

  @Input() evento:any;


  constructor() { }

  ngOnInit(): void {

  }

}

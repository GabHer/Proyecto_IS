import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-evento-organizador',
  templateUrl: './card-evento-organizador.component.html',
  styleUrls: ['./card-evento-organizador.component.css']
})
export class CardEventoOrganizadorComponent implements OnInit {
  @Input() evento:any;
  constructor() { }

  ngOnInit(): void {
  }

}

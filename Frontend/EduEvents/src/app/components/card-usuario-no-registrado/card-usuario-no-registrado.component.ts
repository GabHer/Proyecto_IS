import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-usuario-no-registrado',
  templateUrl: './card-usuario-no-registrado.component.html',
  styleUrls: ['./card-usuario-no-registrado.component.css']
})
export class CardUsuarioNoRegistradoComponent implements OnInit {

  @Input() evento:any;
  constructor() { }

  ngOnInit(): void {
  }

}

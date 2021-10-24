import { Component, OnInit } from '@angular/core';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  items:any = {
    home: true,
    eventos:false,
    acercaDe:false,
    contactanos:false,
    iniciarSesion:false,
    registrate:false
  }
  itemActual = 'home';
  cssItemActual = 'div-item-actual'


  constructor() { }

  ngOnInit(): void {
  }
  seleccionarItem(item:string){
    this.items[this.itemActual]= false;
    this.items[item]= true;
    this.itemActual=item;

  }

  item(nombreItem:string){
    if(this.items[nombreItem]){
      return this.cssItemActual;
    }
    return "";
  }

}


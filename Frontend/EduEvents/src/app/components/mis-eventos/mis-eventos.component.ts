import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-mis-eventos',
  templateUrl: './mis-eventos.component.html',
  styleUrls: ['./mis-eventos.component.css']
})
export class MisEventosComponent implements OnInit {

  @Input() isCollaps:boolean;
  @Input() usuarioActual:any;

  mostrarFormulario = false;

  misEventos:any = [];

  constructor() { }

  ngOnInit(): void {

  }
  mostrarFormularioCrearEvento(b: boolean){
    this.mostrarFormulario = b
  }

  actualizarPath( path:string ){
    if( path== 'Mis eventos' ){
      this.mostrarFormulario = false;
    }else{
      this.mostrarFormulario = false;
    }
  }

}

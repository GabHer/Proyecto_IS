import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header-dashboard',
  templateUrl: './header-dashboard.component.html',
  styleUrls: ['./header-dashboard.component.css']
})
export class HeaderDashboardComponent implements OnInit {
  @Output() bandera = new EventEmitter<Boolean>();
  @Input() usuarioHeader:any;
  @Input() nombreItemActual:string;
  @Output() onClickUsuario = new EventEmitter<string>();

  mostrarBtn = true;
  constructor() { }

  ngOnInit(): void {
  }

  onClickBtnTogglet(b:boolean){
    this.mostrarBtn = b;
    this.bandera.emit(b);
  }

  obtenerNombreCompleto(){
    return `${this.usuarioHeader.nombre} ${this.usuarioHeader.apellido}`
  }

  verMiPerfil(){
    this.onClickUsuario.emit('Mi perfil');
  }

}

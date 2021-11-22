import { Component, EventEmitter, Input, OnInit, Output, ViewChildren } from '@angular/core';
import { SpinnerService } from 'src/app/services/spinner.service';
import { BuscadorComponent } from '../../buscador/buscador.component';
@Component({
  selector: 'app-header-dashboard',
  templateUrl: './header-dashboard.component.html',
  styleUrls: ['./header-dashboard.component.css']
})
export class HeaderDashboardComponent implements OnInit {
  @Output() bandera = new EventEmitter<Boolean>();
  @Input() usuarioHeader:any;
  @Input() eventos:any= [];
  @Input() nombreItemActual:string;
  @Output() onClickUsuario = new EventEmitter<string>();
  @Output() ctrlInput = new EventEmitter<any>();



  mostrarBtn = true;
  constructor( private spinner:SpinnerService ) { }

  ngOnInit(): void {

  }



  onClickBtnTogglet(b:boolean){
    this.mostrarBtn = b;
    this.bandera.emit(b);
  }

  obtenerNombreCompleto(){

    return `${this.usuarioHeader.Nombre.split(" ")[0]} ${this.usuarioHeader.Apellido.split(" ")[0]}`
  }

  verMiPerfil(){
    this.onClickUsuario.emit('Mi perfil');
  }

  filtrarBusqueda(event:any){
    this.ctrlInput.emit(event);
  }


}

import { Component, OnInit , Input, Output, EventEmitter} from '@angular/core';
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  @Output() bandera = new EventEmitter<Boolean>();
  @Output() setItem =  new EventEmitter<any>();

  @Input () indexItemActual:any;
  @Input() mostrarBotonTogglet = true;

  /* Items del sidenav de la forma [ "item", "icono de google fonts"] */
  @Input() items = [
    ["Inicio", "home"],
    ["Buscar", "search"],
    ["Mis eventos", "event"],
    ["Inscripciones", "edit_calendar"],
    ["Mi perfil", "account_circle"],
    ["Cerrar sesión", "logout"],
  ]
  showFiller = false;

  constructor(  ) { }

  ngOnInit(): void {

  }

  mostarTogglet(sidenavToggle:any, b:boolean){
    sidenavToggle.toggle();
    this.mostrarBotonTogglet = b;
    this.bandera.emit(b);
  }

  seleccionarItem( nombreItem:string ) {
    this.indexItemActual = this.obtenerIndexItem( nombreItem );
    this.setItem.emit(this.indexItemActual);

  }

  obtenerIndexItem( nombreItem:string ){
    return this.items.findIndex( item => item[0] == nombreItem);
  }

  setItems(items:any){
    this.items = items;
  }

}

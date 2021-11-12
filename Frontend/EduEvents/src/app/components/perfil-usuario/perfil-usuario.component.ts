import { Component, Input, OnInit } from '@angular/core';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit {

  faEdit = faEdit;


  @Input() perfil:any;
  constructor() { }

  ngOnInit(): void {
  }

  obtenerNombreCompleto(){
    return `${this.perfil.nombre} ${this.perfil.apellido}`
  }

}

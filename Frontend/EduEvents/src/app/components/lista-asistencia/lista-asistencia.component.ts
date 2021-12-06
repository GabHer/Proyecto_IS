import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormControlName} from '@angular/forms';
import { ConferenciasService } from 'src/app/services/conferencias.service';
import { MatListOption } from '@angular/material/list';
import { FlowAssignment } from 'typescript';


@Component({
  selector: 'app-lista-asistencia',
  templateUrl: './lista-asistencia.component.html',
  styleUrls: ['./lista-asistencia.component.css']
})
export class ListaAsistenciaComponent implements OnInit {

  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];
  organizador = false;
  encargado = false;
  inscritos : any;
  mensajeNoInscritos = false;
  idUsuarioSeleccionado: any;

  @Output() verConferencias = new EventEmitter<any>();
  @Input() idConferencia:number;
  vistaActual = {
    vistaUsuario:false,
    vistaLista: true
  }

  constructor( private serviceConferencia:ConferenciasService ) { }

  ngOnInit(  ): void {
    this.obtenerInscripcionesConferencias();
  };

  onGroupsChange(options: MatListOption[]) {
    console.log(options.map(o => o.value));
  }

  obtenerInscripcionesConferencias(){
    this.serviceConferencia.obtenerParticipantesConferencia(this.idConferencia).subscribe(
      (res:any) => {
        console.log(res.data);
        this.inscritos = res.data
      },
      (err:any) => {
        if( err.error.codigo == 404 ) {
          this.mensajeNoInscritos = true;
          console.log("No se encontró asistentes para esta conferencia");
        }
      }
    );
  }

  verUsuario(idUsuario){
    console.log(idUsuario);
    this.vistaActual.vistaUsuario = !this.vistaActual.vistaUsuario
    this.vistaActual.vistaLista = !this.vistaActual.vistaLista
    this.idUsuarioSeleccionado = idUsuario;
  }

  verGestionarAsistentes(){
    this.vistaActual.vistaUsuario = !this.vistaActual.vistaUsuario
    this.vistaActual.vistaLista = !this.vistaActual.vistaLista
  }

  regresar(){
    this.verConferencias.emit(null);
  }
}

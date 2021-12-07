import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormControlName} from '@angular/forms';
import { ConferenciasService } from 'src/app/services/conferencias.service';
import { AsistenciaService } from 'src/app/services/asistencia.service';
import { MatListOption } from '@angular/material/list';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FlowAssignment } from 'typescript';


@Component({
  selector: 'app-lista-asistencia',
  templateUrl: './lista-asistencia.component.html',
  styleUrls: ['./lista-asistencia.component.css']
})
export class ListaAsistenciaComponent implements OnInit {

  organizador = false;
  encargado = false;
  inscritos : any;
  mensajeNoInscritos = false;
  idUsuarioSeleccionado: any;
  asistencias: any;
  listaAsistencia:any;
  boolOrganizador: any;
  boolEncargado: any;
  jsonGenerarDiplomas: any;

  @Output() verConferencias = new EventEmitter<any>();
  @Input() idConferencia:number;
  vistaActual = {
    vistaUsuario:false,
    vistaLista: true
  }

  constructor( private serviceConferencia:ConferenciasService, private serviceAsistencia:AsistenciaService, private modalService:NgbModal ) { }

  ngOnInit(  ): void {
    this.obtenerInscripcionesConferencias();
  };

  onGroupsChange(options: MatListOption[]) {
    this.listaAsistencia = options.map(o => o.value);

    if(this.listaAsistencia.length == 0){
      this.listaAsistencia = null;
    }
  }

  onOrganizador(options: MatListOption[]){
    this.boolOrganizador = options.map(o => o.value);
    this.boolOrganizador.push(0);
  }

  onEncargado(options: MatListOption[]){
    this.boolEncargado = options.map(o => o.value);
    this.boolEncargado.push(0);
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

  enviarAsistencias(modalDialogoExito){
    this.asistencias = {
      "idConferencia": this.idConferencia,
      "listaAsistencia": this.listaAsistencia
    }


    this.serviceAsistencia.enviarAsistencias( this.asistencias ).subscribe(

      (res:any) => {
        this.abrirModal(modalDialogoExito);
        this.listaAsistencia = null;
        console.log(res.mensaje);
      },

      (err:any) => {
        if( err.error.codigo == 404 ) {
          console.log("No se pudo guardar asistencias");
        }
      }

    );
  }

  abrirModal( modal:any ){
    this.modalService.open(
      modal,
      {
        size: 'xs',
        centered: true
      }
    );
  }

  generarDiplomas(){
    if(this.boolEncargado == undefined){
      this.jsonGenerarDiplomas ={
        "idConferencia" : this.idConferencia,
        "firmaOrganizador" : this.boolOrganizador[0],
        "firmaEncargado": this.boolOrganizador[1],
        "imagenFirma": "Blob"
      }
    }else if(this.boolOrganizador == undefined){
      this.jsonGenerarDiplomas ={
        "idConferencia" : this.idConferencia,
        "firmaEncargado": this.boolEncargado[0],
        "firmaOrganizador": this.boolEncargado[1],
        "imagenFirma": "Blob"
      }
    }else{
      this.jsonGenerarDiplomas ={
        "idConferencia" : this.idConferencia,
        "firmaOrganizador" : this.boolOrganizador[0],
        "firmaEncargado": this.boolEncargado[0],
        "imagenFirma": "Blob"
      }
    }

    console.log(this.jsonGenerarDiplomas);
  }

  obtenerAsistencias(){

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

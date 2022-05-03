import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ConferenciasService } from 'src/app/services/conferencias.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-vista-participantes-encargado',
  templateUrl: './vista-participantes-encargado.component.html',
  styleUrls: ['./vista-participantes-encargado.component.css']
})
export class VistaParticipantesEncargadoComponent implements OnInit {
  inscritos = [];
  mensajeNoInscritos = false;
  idUsuarioSeleccionado: any;
  usuarioSeleccionado:any;
  @Input() idConferencia:number;
  @Output() verDetallesEvento = new EventEmitter<any>();

  verParticipantes = true;

  constructor( private serviceConferencia:ConferenciasService, private spinner:SpinnerService ) { }

  ngOnInit(): void {
    this.obtenerInscripcionesConferencias();
  }

  verPerfilUsuario(objPersona){
    this.verParticipantes = false;
    this.usuarioSeleccionado = objPersona;
  }

  obtenerInscripcionesConferencias(){
    this.spinner.mostrarSpinner()
    this.serviceConferencia.obtenerParticipantesConferencia(this.idConferencia).subscribe(
      (res:any) => {
        this.inscritos = res.data
        this.spinner.ocultarSpinner()
      },
      (err:any) => {
        if( err.error.codigo == 404 ) {
          this.mensajeNoInscritos = true;
          console.log("No se encontró asistentes para esta conferencia");
        }
        this.inscritos = []
        this.spinner.ocultarSpinner()
      }
    );
  }

  verUsuario(idUsuario){

  }


  regresar(){
    this.verDetallesEvento.emit(null);
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventosService } from 'src/app/services/eventos.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-mis-eventos',
  templateUrl: './mis-eventos.component.html',
  styleUrls: ['./mis-eventos.component.css']
})
export class MisEventosComponent implements OnInit {

  @Input() isCollaps:boolean;
  @Input() usuarioActual:any;

  idEvento = -1;

  mostrarFormulario = false;
  misEventos:any = [];


  mensajeModal = [
    {tipo:"confirmacion", titulo1:"¿Eliminar?", titulo2:"El evento se eliminara de tu lista", icono:"quiz"},
    {tipo:"error", titulo1:"Ocurrió un error", titulo2:"", icono:"error"},
  ]

  constructor( private eventosService:EventosService,private spinner:SpinnerService, private modalService:NgbModal ) {
  }

  ngOnInit(): void {
    this.obtenerMisEventos();

  }
  mostrarFormularioCrearEvento(b: boolean){
    this.mostrarFormulario = b
  }

  obtenerMisEventos(){
    this.spinner.mostrarSpinner()
    this.eventosService.obtenerMisEventos( this.usuarioActual.id ).subscribe(
      (res:any)=> {

        this.misEventos = res.data
      },
      (err:any) => {

        this.misEventos = [];
        this.spinner.ocultarSpinner();
      },
      () => {
        this.spinner.ocultarSpinner();
      }

     );
  }

  eliminarEvento(idEvento:any){

    this.spinner.mostrarSpinner();
    this.eventosService.eliminarEvento( idEvento ).subscribe(
      (res:any) => {
        console.log("Se ha eliminado el evento");
      },
      (err:any) => {
        this.spinner.ocultarSpinner();
      },
      () => {
        this.spinner.ocultarSpinner();
        this.obtenerMisEventos();
      }
    );
  }

  onClickAbrirModalEliminarEvento(modal:any, idEvento:number){
    this.idEvento = idEvento;
    this.abrirModal(modal);
  }

  onClickConfirmarEliminarEvento(letModal:any, idEvento:any){
    letModal.close('Close click');
    this.eliminarEvento(idEvento);
  }

  actualizarPath( path:string ){
    if( path== 'Mis eventos' ){
      this.mostrarFormulario = false;
    }else{
      this.mostrarFormulario = false;
    }
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



}

import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { EventosService } from 'src/app/services/eventos.service';
import { SpinnerService } from 'src/app/services/spinner.service';

export interface Evento  {
  Id:number,
  Caratula:string,
  Nombre:string,
  Institucion:string,
  Descripcion:string,
  Fecha_Inicio:string,
  Fecha_Final:string,
  Estado_Participantes:number,
  Estado_Evento:string,
  Id_Organizador:number
}

@Component({
  selector: 'app-mis-eventos',
  templateUrl: './mis-eventos.component.html',
  styleUrls: ['./mis-eventos.component.css']
})
export class MisEventosComponent implements OnInit, OnChanges {

  @Input() isCollaps:boolean;
  @Input() usuarioActual:any;
  @Input() ctrlBuscar:string = '';

  nombre = new FormControl('');

  misEventos: Evento[] = [
    {
      Id:-1,
      Caratula: "",
      Nombre: "",
      Institucion: "",
      Descripcion: "",
      Fecha_Inicio: "",
      Fecha_Final: "",
      Estado_Participantes: -1,
      Estado_Evento: "",
      Id_Organizador: -1
    }
    ];

    filteredEvento:Observable<Evento[]>;

    idEvento = -1;

  mostrarFormularioEvento = false;
  mostrarFormularioConferencia = false;



  mensajeModal = [
    {tipo:"confirmacion", titulo1:"¿Eliminar?", titulo2:"El evento se eliminara de tu lista", icono:"quiz"},
    {tipo:"error", titulo1:"Ocurrió un error", titulo2:"", icono:"error"},
  ]

  constructor( private eventosService:EventosService,private spinner:SpinnerService, private modalService:NgbModal ) {


  }
  ngOnChanges(changes: SimpleChanges): void {
    this.nombre.setValue(this.ctrlBuscar);

  }

  ngOnInit(): void {
    this.obtenerMisEventos();

  }
  mostrarFormularioCrearEvento(b: boolean){
    this.mostrarFormularioEvento = b
  }

  private _filterNombreEvento(value:any): Evento[] {

    const filterValue = value.toLowerCase();
    return this.misEventos.filter( evento => evento.Nombre.toLocaleLowerCase().includes(filterValue) );
  }

  obtenerMisEventos(){
    this.spinner.mostrarSpinner()
    this.eventosService.obtenerMisEventos( this.usuarioActual.id ).subscribe(
      (res:any)=> {

        this.misEventos = res.data

        this.filteredEvento = this.nombre.valueChanges.pipe(
          startWith(''),
          map(evento => (evento ? this._filterNombreEvento(evento) : this.misEventos.slice())),
        );
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
    switch (path) {
      case "Mis eventos":
        this.mostrarFormularioEvento = false;
        this.mostrarFormularioConferencia = false;
        break;

      default:
        break;
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

  mostrarFormularioCrearConferencia(event:any){
    this.mostrarFormularioConferencia = true;
    this.idEvento = event;
    console.log(this.idEvento);
  }



}

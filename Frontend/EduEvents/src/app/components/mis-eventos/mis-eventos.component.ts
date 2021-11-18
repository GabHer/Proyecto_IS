import { Component, Input, OnInit } from '@angular/core';
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

  mostrarFormulario = false;
  misEventos:any = [];

  constructor( private eventosService:EventosService,private spinner:SpinnerService ) {
  }

  ngOnInit(): void {
    console.log(this.usuarioActual);
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

  actualizarPath( path:string ){
    if( path== 'Mis eventos' ){
      this.mostrarFormulario = false;
    }else{
      this.mostrarFormulario = false;
    }
  }

}

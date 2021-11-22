import { Component, OnInit, Input, EventEmitter,Output } from '@angular/core';
import { EventosService } from 'src/app/services/eventos.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-detalles-evento',
  templateUrl: './detalles-evento.component.html',
  styleUrls: ['./detalles-evento.component.css']
})
export class DetallesEventoComponent implements OnInit {
  @Input() isCollaps: boolean;
  @Input() idEvento: any;
  @Output() onChangePath = new EventEmitter<string>();
  @Output() onMostrarDetalles = new EventEmitter<any>();

  eventoSeleccionado:any;

  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  constructor(private eventosService:EventosService,private spinner:SpinnerService) { }

  ngOnInit(): void {
    this.obtenerEvento(this.idEvento);
  }

  obtenerEvento(idEvento:any){

    this.eventosService.obtenerEventoPorId( idEvento ).subscribe(
      (res:any) => {
        console.log(res.data);
        this.eventoSeleccionado = {
          id: res.data[0].Id,
          descripcion: res.data[0].Descripcion,
          nombre: res.data[0].Nombre,
          fechaInicio: res.data[0].Fecha_Inicio.substr(0,10),
          fechaFinal: res.data[0].Fecha_Final.substr(0,10),
          institucion: res.data[0].Institucion
        };
      },
      (err:any) => {
        console.log(err);
      }
    );
  }
  regresar(){
    this.onChangePath.emit('Mis eventos');
  }

}

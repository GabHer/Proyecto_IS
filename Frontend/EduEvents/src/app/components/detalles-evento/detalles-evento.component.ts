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
          id: res.data.Id,
          descripcion: res.data.Descripcion,
          nombre: res.data.Nombre,
          fechaInicio: res.data.Fecha_Inicio.substr(0,10),
          fechaFinal: res.data.Fecha_Final.substr(0,10),
          institucion: res.data.Institucion,
          imagenes: res.data.imagenes
        };
        console.log(this.eventoSeleccionado.imagenes);
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

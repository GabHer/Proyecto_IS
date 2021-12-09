import { Component, Input, OnInit } from '@angular/core';
import { Data_BAR_CHAR } from 'src/app/models/barChar';
import { IBarChart } from 'src/app/models/charts.interface';
import { EventosService } from 'src/app/services/eventos.service'
import { SpinnerService } from 'src/app/services/spinner.service'

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {

  @Input() evento:any;
  data: IBarChart[] = [];
  view: [number,number] = [700, 400];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition:any = 'below';

  colorScheme:any = {
    domain: ['#4484CE', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor( private eventoService:EventosService, private spinner:SpinnerService ) { }

  ngOnInit(): void {
    this.obtenerData();
  }

  obtenerData(){

    this.spinner.mostrarSpinner()
    this.eventoService.obtenerDatosEstadistica(this.evento.Id).subscribe(
      (res:any) => {
        if(res.codigo == 200 ){
          var datosEstadistica:IBarChart[] = [];

          let data = res.data;
          for(let index = 0; index < data.length; index ++){
            let obj = {
              name: data[index].name,
              value: data[index].value,
              extra: {
                code: data[index].code
              }
            }
            datosEstadistica.push(obj);
          }
          this.data = datosEstadistica;
        }else {
          this.data = [];
        }
        this.spinner.ocultarSpinner()
      },
      (err:any) => {
        this.data = [];
        this.spinner.ocultarSpinner()
      }
    );
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

}

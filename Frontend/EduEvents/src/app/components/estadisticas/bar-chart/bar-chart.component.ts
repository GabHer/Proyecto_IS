import { Component, OnInit, NgModule, Input } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Data_BAR_CHAR } from 'src/app/models/barChar';
import { IBarChart } from 'src/app/models/charts.interface';
import { EventosService } from 'src/app/services/eventos.service';
import { SpinnerService } from 'src/app/services/spinner.service'

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {

  @Input() evento:any;
  data: IBarChart[] = [];
  view: [number,number] = [700, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Conferencia';
  showYAxisLabel = true;
  yAxisLabel = 'Asistentes';

  colorScheme:any = {
    domain: ['#4484CE', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor( private eventoService:EventosService, private spinner:SpinnerService ) {

   }

   onSelect(event) {
    console.log(event);
  }

  ngOnInit(): void {
    this.obtenerData()
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
}

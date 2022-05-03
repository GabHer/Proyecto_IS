import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {

  @Input() evento:any
  seleccionReporte = new FormGroup({
    tipo: new FormControl('', [Validators.required])
  });
  labelPositionReporte: 'Pastel' | 'Barras' = 'Barras';
  constructor() { }

  ngOnInit(): void {

  }

}

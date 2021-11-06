import { Injectable } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  constructor( private spinner: NgxSpinnerService ) { }

  public mostrarSpinner(){
    this.spinner.show();
  }

  public ocultarSpinner(){
    this.spinner.hide();
  }
}

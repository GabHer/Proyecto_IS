import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ListaBlancaService {

  srcArchivo = '';
  constructor( private http: HttpClient ) { }

  setArchivo( srcArchivo:string ){
    this.srcArchivo = srcArchivo;
  }

  getInfo() {
    return this.http.get(this.srcArchivo, {responseType: 'text'});
  }
}

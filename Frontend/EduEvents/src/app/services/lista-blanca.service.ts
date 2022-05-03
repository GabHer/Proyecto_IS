import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ListaBlancaService {


  constructor( private httpClient: HttpClient ) { }



  getInfo( archivo:any ) {
    return this.httpClient.get(archivo, { responseType: 'text' });

  }
}

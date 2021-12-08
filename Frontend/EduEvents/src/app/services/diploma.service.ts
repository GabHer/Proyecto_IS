import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DiplomaService{
  constructor( private httpClient: HttpClient ) { }

  enviarFirmas(objFirmas:any){
    console.log(objFirmas);
    return this.httpClient.post(`http://localhost:8888/diplomas/gestionFirmas`, objFirmas);
  }

}

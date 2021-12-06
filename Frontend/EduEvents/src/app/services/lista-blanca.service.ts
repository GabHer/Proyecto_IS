import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ListaBlancaService {


  constructor( private httpClient: HttpClient ) { }



  getInfo( archivo:any ) {
    return this.httpClient.get(archivo, { responseType: 'text' });
    //return this.httpClient.post(`http://localhost:8888/leerArchivo`,archivo);

    // Para leer el csv a partir de un archivo ccdificado en base 64

    /*
    this.listaBlancaService.getInfo(evento).subscribe(
      (res:any) => {
        let csvToRowArray = res.split("\n");

        let arrayLista = [];
        for(let index=1; index < csvToRowArray.length -1 ; index++){
          let row = csvToRowArray[index].split(',');
          arrayLista.push(row);
        }

        console.log(arrayLista);
      },

      (err:any) => {
        console.log(err);
      }
    );

    */


  }
}
